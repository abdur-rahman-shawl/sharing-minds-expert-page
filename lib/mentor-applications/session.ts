import 'server-only'

import { and, eq, gt, isNull } from 'drizzle-orm'
import type { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'
import {
  mentorApplications,
  mentorApplicationSessions,
  type MentorApplication,
} from '@/lib/db/schema'

import {
  MENTOR_APPLICATION_SESSION_COOKIE,
  MENTOR_APPLICATION_SESSION_IDLE_TTL_MS,
  MENTOR_APPLICATION_SESSION_PATH,
  MENTOR_APPLICATION_SESSION_TTL_MS,
} from './constants'
import {
  createApplicationSessionToken,
  digestApplicationSessionToken,
} from './security'

type DatabaseTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]
type DatabaseExecutor = typeof db | DatabaseTransaction

export class MentorApplicationSessionError extends Error {
  constructor() {
    super('Application verification is required')
    this.name = 'MentorApplicationSessionError'
  }
}

export async function issueMentorApplicationSession(input: {
  applicationId: string
  requestIp?: string | null
  userAgent?: string | null
  transaction?: DatabaseTransaction
}): Promise<{ rawToken: string; expiresAt: Date }> {
  const executor: DatabaseExecutor = input.transaction || db
  const now = new Date()
  const expiresAt = new Date(now.getTime() + MENTOR_APPLICATION_SESSION_TTL_MS)
  const { rawToken, tokenDigest } = createApplicationSessionToken()

  await executor
    .update(mentorApplicationSessions)
    .set({ revokedAt: now })
    .where(
      and(
        eq(mentorApplicationSessions.applicationId, input.applicationId),
        isNull(mentorApplicationSessions.revokedAt),
      ),
    )

  await executor.insert(mentorApplicationSessions).values({
    applicationId: input.applicationId,
    tokenDigest,
    expiresAt,
    requestIp: input.requestIp || null,
    userAgent: input.userAgent || null,
  })

  return { rawToken, expiresAt }
}

export function setMentorApplicationSessionCookie(
  response: NextResponse,
  session: { rawToken: string; expiresAt: Date },
): void {
  response.cookies.set({
    name: MENTOR_APPLICATION_SESSION_COOKIE,
    value: session.rawToken,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: MENTOR_APPLICATION_SESSION_PATH,
    expires: session.expiresAt,
  })
}

export function clearMentorApplicationSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: MENTOR_APPLICATION_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: MENTOR_APPLICATION_SESSION_PATH,
    expires: new Date(0),
  })
}

/**
 * Revokes only the scoped mentor-application session presented by the caller.
 * This deliberately does not touch the Better Auth session: leaving an
 * application and signing out of SharingMinds are separate actions.
 */
export async function revokeMentorApplicationSession(
  request: NextRequest,
): Promise<boolean> {
  const rawToken = request.cookies.get(MENTOR_APPLICATION_SESSION_COOKIE)?.value
  if (!rawToken || rawToken.length < 40 || rawToken.length > 100) return false

  const revoked = await db
    .update(mentorApplicationSessions)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(
          mentorApplicationSessions.tokenDigest,
          digestApplicationSessionToken(rawToken),
        ),
        isNull(mentorApplicationSessions.revokedAt),
      ),
    )
    .returning({ id: mentorApplicationSessions.id })

  return revoked.length > 0
}

export async function getMentorApplicationFromSession(
  request: NextRequest,
): Promise<MentorApplication> {
  const rawToken = request.cookies.get(MENTOR_APPLICATION_SESSION_COOKIE)?.value
  if (!rawToken || rawToken.length < 40 || rawToken.length > 100) {
    throw new MentorApplicationSessionError()
  }

  const now = new Date()
  const idleCutoff = new Date(now.getTime() - MENTOR_APPLICATION_SESSION_IDLE_TTL_MS)
  const tokenDigest = digestApplicationSessionToken(rawToken)
  const [result] = await db
    .select({
      sessionId: mentorApplicationSessions.id,
      lastUsedAt: mentorApplicationSessions.lastUsedAt,
      application: mentorApplications,
    })
    .from(mentorApplicationSessions)
    .innerJoin(
      mentorApplications,
      eq(mentorApplicationSessions.applicationId, mentorApplications.id),
    )
    .where(
      and(
        eq(mentorApplicationSessions.tokenDigest, tokenDigest),
        isNull(mentorApplicationSessions.revokedAt),
        gt(mentorApplicationSessions.expiresAt, now),
        gt(mentorApplicationSessions.lastUsedAt, idleCutoff),
      ),
    )
    .limit(1)

  if (!result) throw new MentorApplicationSessionError()

  // Avoid a write for every rapid autosave/status poll while still enforcing a
  // rolling idle timeout.
  if (now.getTime() - result.lastUsedAt.getTime() > 60_000) {
    await db
      .update(mentorApplicationSessions)
      .set({ lastUsedAt: now })
      .where(eq(mentorApplicationSessions.id, result.sessionId))
  }

  return result.application
}
