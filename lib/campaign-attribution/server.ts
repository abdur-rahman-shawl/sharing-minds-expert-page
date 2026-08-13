import 'server-only'

import { and, eq, gt, inArray, sql } from 'drizzle-orm'
import type { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { campaignVisits, type CampaignVisit } from '@/lib/db/schema'

import {
  CAMPAIGN_APPLICATION_PATH,
  CAMPAIGN_TOUCH_COOKIE,
  CAMPAIGN_TOUCH_TTL_SECONDS,
  CAMPAIGN_VISITOR_COOKIE,
  CAMPAIGN_VISITOR_TTL_SECONDS,
  CAMPAIGN_VISIT_COOKIE,
  CAMPAIGN_VISIT_TTL_SECONDS,
} from './constants'
import { isCampaignAttributionEnabled } from './feature'
import {
  campaignAcquisitionMatches,
  parseCampaignAcquisition,
  type CampaignAcquisition,
} from './params'
import {
  createCampaignIdentifier,
  readSignedCampaignIdentifier,
  signCampaignIdentifier,
} from './security'
import { preserveFirstRecordedTimestamp } from './sql'

type CaptureCampaignVisitInput = {
  path: string
  search: string
  referrer: string
}

type CaptureCampaignVisitResult = {
  visit: CampaignVisit
  visitorId: string
  attributionVisitId: string
  shouldSetAttributionCookie: boolean
}

const VISIT_IDLE_MILLISECONDS = CAMPAIGN_VISIT_TTL_SECONDS * 1_000

function signedCookie(request: NextRequest, name: string): string | null {
  return readSignedCampaignIdentifier(request.cookies.get(name)?.value)
}

function isApplicationPath(path: string): boolean {
  return path === CAMPAIGN_APPLICATION_PATH || path.startsWith(
    `${CAMPAIGN_APPLICATION_PATH}/`,
  )
}

function visitAcquisition(visit: CampaignVisit): CampaignAcquisition {
  return {
    channel: visit.channel as CampaignAcquisition['channel'],
    source: visit.source,
    medium: visit.medium,
    campaign: visit.campaign,
    content: visit.content,
    term: visit.term,
    referrerHost: visit.referrerHost,
    clickIdType: visit.clickIdType,
    clickId: visit.clickId,
    hasExplicitCampaign: visit.channel !== 'DIRECT' && visit.medium !== 'referral',
    isDirect: visit.channel === 'DIRECT',
  }
}

async function findActiveVisit(input: {
  visitId: string | null
  visitorId: string
  now: Date
}): Promise<CampaignVisit | null> {
  if (!input.visitId) return null
  const idleCutoff = new Date(input.now.getTime() - VISIT_IDLE_MILLISECONDS)
  const [visit] = await db
    .select()
    .from(campaignVisits)
    .where(
      and(
        eq(campaignVisits.id, input.visitId),
        eq(campaignVisits.visitorId, input.visitorId),
        gt(campaignVisits.lastSeenAt, idleCutoff),
      ),
    )
    .limit(1)
  return visit || null
}

async function createVisit(input: {
  visitorId: string
  path: string
  acquisition: CampaignAcquisition
  now: Date
}): Promise<CampaignVisit> {
  const [visit] = await db
    .insert(campaignVisits)
    .values({
      visitorId: input.visitorId,
      channel: input.acquisition.channel,
      source: input.acquisition.source,
      medium: input.acquisition.medium,
      campaign: input.acquisition.campaign,
      content: input.acquisition.content,
      term: input.acquisition.term,
      landingPath: input.path,
      referrerHost: input.acquisition.referrerHost,
      clickIdType: input.acquisition.clickIdType,
      clickId: input.acquisition.clickId,
      applicationViewedAt: isApplicationPath(input.path) ? input.now : null,
      startedAt: input.now,
      lastSeenAt: input.now,
      createdAt: input.now,
      updatedAt: input.now,
    })
    .returning()
  return visit
}

async function updateVisit(
  visit: CampaignVisit,
  path: string,
  now: Date,
): Promise<CampaignVisit> {
  const [updated] = await db
    .update(campaignVisits)
    .set({
      pageViewCount: sql`${campaignVisits.pageViewCount} + 1`,
      applicationViewedAt: isApplicationPath(path)
        ? preserveFirstRecordedTimestamp(campaignVisits.applicationViewedAt)
        : undefined,
      lastSeenAt: now,
      updatedAt: now,
    })
    .where(eq(campaignVisits.id, visit.id))
    .returning()
  return updated
}

export async function captureCampaignVisit(
  request: NextRequest,
  input: CaptureCampaignVisitInput,
): Promise<CaptureCampaignVisitResult> {
  const now = new Date()
  const visitorId =
    signedCookie(request, CAMPAIGN_VISITOR_COOKIE) || createCampaignIdentifier()
  const activeVisit = await findActiveVisit({
    visitId: signedCookie(request, CAMPAIGN_VISIT_COOKIE),
    visitorId,
    now,
  })
  const incoming = parseCampaignAcquisition({
    search: input.search,
    referrer: input.referrer,
    requestOrigin: request.nextUrl.origin,
  })

  const startsNewCampaignVisit =
    Boolean(activeVisit) &&
    !incoming.isDirect &&
    !campaignAcquisitionMatches(visitAcquisition(activeVisit!), incoming)

  const visit =
    !activeVisit || startsNewCampaignVisit
      ? await createVisit({
          visitorId,
          path: input.path,
          acquisition: incoming,
          now,
        })
      : await updateVisit(activeVisit, input.path, now)

  const existingTouchId = signedCookie(request, CAMPAIGN_TOUCH_COOKIE)
  const attributionVisitId =
    visit.channel !== 'DIRECT' ? visit.id : existingTouchId || visit.id
  const shouldSetAttributionCookie =
    !existingTouchId || (visit.id !== activeVisit?.id && visit.channel !== 'DIRECT')

  if (isApplicationPath(input.path) && attributionVisitId !== visit.id) {
    await db
      .update(campaignVisits)
      .set({
        applicationViewedAt: preserveFirstRecordedTimestamp(
          campaignVisits.applicationViewedAt,
        ),
        updatedAt: now,
      })
      .where(
        and(
          eq(campaignVisits.id, attributionVisitId),
          eq(campaignVisits.visitorId, visitorId),
        ),
      )
  }

  return {
    visit,
    visitorId,
    attributionVisitId,
    shouldSetAttributionCookie,
  }
}

function setSignedCookie(
  response: NextResponse,
  input: { name: string; value: string; maxAge: number },
): void {
  response.cookies.set({
    name: input.name,
    value: signCampaignIdentifier(input.value),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: input.maxAge,
  })
}

export function setCampaignAttributionCookies(
  response: NextResponse,
  result: CaptureCampaignVisitResult,
): void {
  setSignedCookie(response, {
    name: CAMPAIGN_VISITOR_COOKIE,
    value: result.visitorId,
    maxAge: CAMPAIGN_VISITOR_TTL_SECONDS,
  })
  setSignedCookie(response, {
    name: CAMPAIGN_VISIT_COOKIE,
    value: result.visit.id,
    maxAge: CAMPAIGN_VISIT_TTL_SECONDS,
  })
  if (result.shouldSetAttributionCookie) {
    setSignedCookie(response, {
      name: CAMPAIGN_TOUCH_COOKIE,
      value: result.attributionVisitId,
      maxAge: CAMPAIGN_TOUCH_TTL_SECONDS,
    })
  }
}

export async function getCurrentAttributionVisitId(
  request: NextRequest,
): Promise<string | null> {
  if (!isCampaignAttributionEnabled()) return null

  const visitorId = signedCookie(request, CAMPAIGN_VISITOR_COOKIE)
  const visitId =
    signedCookie(request, CAMPAIGN_TOUCH_COOKIE) ||
    signedCookie(request, CAMPAIGN_VISIT_COOKIE)
  if (!visitorId || !visitId) return null

  const [visit] = await db
    .select({ id: campaignVisits.id })
    .from(campaignVisits)
    .where(
      and(
        eq(campaignVisits.id, visitId),
        eq(campaignVisits.visitorId, visitorId),
      ),
    )
    .limit(1)
  return visit?.id || null
}

export async function markCurrentCampaignVisitOtpRequested(
  request: NextRequest,
): Promise<void> {
  if (!isCampaignAttributionEnabled()) return

  const visitorId = signedCookie(request, CAMPAIGN_VISITOR_COOKIE)
  const activeVisitId = signedCookie(request, CAMPAIGN_VISIT_COOKIE)
  const attributionVisitId = signedCookie(request, CAMPAIGN_TOUCH_COOKIE)
  const visitIds = Array.from(
    new Set([activeVisitId, attributionVisitId].filter((id): id is string => Boolean(id))),
  )
  if (!visitorId || visitIds.length === 0) return

  const now = new Date()
  await db
    .update(campaignVisits)
    .set({
      otpRequestedAt: preserveFirstRecordedTimestamp(
        campaignVisits.otpRequestedAt,
      ),
      lastSeenAt: now,
      updatedAt: now,
    })
    .where(
      and(
        inArray(campaignVisits.id, visitIds),
        eq(campaignVisits.visitorId, visitorId),
      ),
    )
}
