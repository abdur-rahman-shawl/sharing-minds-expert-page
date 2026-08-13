import 'server-only'

import { createHmac, randomBytes } from 'node:crypto'

import { and, eq, gt, inArray } from 'drizzle-orm'
import type { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'
import {
  mentorRegistrationDrafts,
  type MentorRegistrationDraft,
} from '@/lib/db/schema'

import {
  EXPERT_REGISTRATION_DRAFT_COOKIE,
  EXPERT_REGISTRATION_DRAFT_COOKIE_PATH,
  EXPERT_REGISTRATION_DRAFT_TTL_MS,
} from './constants'

let warnedAboutDevelopmentFallback = false

function getDraftSecret(): string {
  const explicitSecret = process.env.EXPERT_REGISTRATION_DRAFT_SECRET
  const developmentFallback =
    process.env.NODE_ENV === 'production'
      ? undefined
      : process.env.MENTOR_APPLICATION_SESSION_SECRET ||
        process.env.BETTER_AUTH_SECRET
  const secret = explicitSecret || developmentFallback

  if (!secret || secret.length < 32) {
    throw new Error(
      'EXPERT_REGISTRATION_DRAFT_SECRET must be configured with at least 32 characters',
    )
  }

  if (!explicitSecret && !warnedAboutDevelopmentFallback) {
    warnedAboutDevelopmentFallback = true
    console.warn(
      '[expert-registration] Development only: draft HMAC is using an existing auth secret',
    )
  }

  return secret
}

export function digestExpertRegistrationDraftToken(rawToken: string): string {
  return createHmac('sha256', getDraftSecret())
    .update(`sharingminds-expert-registration-draft:v1:${rawToken}`, 'utf8')
    .digest('hex')
}

export function createExpertRegistrationDraftToken(): {
  rawToken: string
  tokenDigest: string
} {
  const rawToken = randomBytes(32).toString('base64url')
  return {
    rawToken,
    tokenDigest: digestExpertRegistrationDraftToken(rawToken),
  }
}

export function setExpertRegistrationDraftCookie(
  response: NextResponse,
  input: { rawToken: string; expiresAt: Date },
): void {
  response.cookies.set({
    name: EXPERT_REGISTRATION_DRAFT_COOKIE,
    value: input.rawToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: EXPERT_REGISTRATION_DRAFT_COOKIE_PATH,
    expires: input.expiresAt,
  })
}

export function clearExpertRegistrationDraftCookie(
  response: NextResponse,
): void {
  response.cookies.set({
    name: EXPERT_REGISTRATION_DRAFT_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: EXPERT_REGISTRATION_DRAFT_COOKIE_PATH,
    expires: new Date(0),
  })
}

export async function getExpertRegistrationDraftFromRequest(
  request: NextRequest,
): Promise<MentorRegistrationDraft | null> {
  const rawToken = request.cookies.get(EXPERT_REGISTRATION_DRAFT_COOKIE)?.value
  if (!rawToken || rawToken.length < 40 || rawToken.length > 100) return null

  const [draft] = await db
    .select()
    .from(mentorRegistrationDrafts)
    .where(
      and(
        eq(
          mentorRegistrationDrafts.accessTokenDigest,
          digestExpertRegistrationDraftToken(rawToken),
        ),
        gt(mentorRegistrationDrafts.expiresAt, new Date()),
        inArray(mentorRegistrationDrafts.status, [
          'DRAFT',
          'READY_FOR_AUTH',
          'AUTHENTICATED',
          'FINALIZING',
          'COMPLETED',
        ]),
      ),
    )
    .limit(1)

  return draft || null
}

export function newDraftExpiration(now = new Date()): Date {
  return new Date(now.getTime() + EXPERT_REGISTRATION_DRAFT_TTL_MS)
}
