import 'server-only'

import { randomUUID } from 'node:crypto'

import { and, desc, eq, gte, isNull, sql } from 'drizzle-orm'

import { db } from '@/lib/db'
import { emailOtpChallenges } from '@/lib/db/schema'

import {
  OTP_EMAIL_WINDOW_LIMIT,
  OTP_EMAIL_WINDOW_MS,
  OTP_IP_WINDOW_LIMIT,
  OTP_IP_WINDOW_MS,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_MS,
  OTP_TTL_MS,
  type EmailOtpPurpose,
} from './constants'
import { sendEmailOtp } from './email'
import {
  createOpaqueUuid,
  digestOtp,
  generateOtpCode,
  normalizeEmail,
  verifyOtpDigest,
} from './security'

export type RequestEmailOtpInput = {
  email: string
  purpose: EmailOtpPurpose
  requestIp?: string | null
  userAgent?: string | null
  applicationId?: string | null
}

export type RequestEmailOtpResult = {
  challengeId: string
  accepted: boolean
  retryAfterSeconds?: number
}

/**
 * Creates a purpose-bound OTP challenge. `accepted` is for server-side callers
 * only and must not be reflected in enumeration-sensitive HTTP responses.
 */
export async function requestEmailOtp(
  input: RequestEmailOtpInput,
): Promise<RequestEmailOtpResult> {
  const normalizedEmail = normalizeEmail(input.email)
  const now = new Date()
  const code = generateOtpCode()
  const challengeId = randomUUID()
  const digestKeyId = process.env.MENTOR_APPLICATION_OTP_KEY_ID || 'v1'

  const result = await db.transaction(async transaction => {
    // Serializes sends for one email+purpose pair. Counts and revocation remain
    // reliable when two browser tabs request a code concurrently.
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`${normalizedEmail}:${input.purpose}`}, 0))`,
    )

    const emailWindowStart = new Date(now.getTime() - OTP_EMAIL_WINDOW_MS)
    const ipWindowStart = new Date(now.getTime() - OTP_IP_WINDOW_MS)
    const cooldownStart = new Date(now.getTime() - OTP_RESEND_COOLDOWN_MS)

    const emailCountRow = await transaction
      .select({ count: sql<number>`count(*)::int` })
      .from(emailOtpChallenges)
      .where(
        and(
          eq(emailOtpChallenges.normalizedEmail, normalizedEmail),
          eq(emailOtpChallenges.purpose, input.purpose),
          gte(emailOtpChallenges.createdAt, emailWindowStart),
        ),
      )
    const ipCountRow = input.requestIp
      ? await transaction
          .select({ count: sql<number>`count(*)::int` })
          .from(emailOtpChallenges)
          .where(
            and(
              eq(emailOtpChallenges.requestIp, input.requestIp),
              gte(emailOtpChallenges.createdAt, ipWindowStart),
            ),
          )
      : [{ count: 0 }]
    const latest = await transaction
      .select({
        id: emailOtpChallenges.id,
        lastSentAt: emailOtpChallenges.lastSentAt,
      })
      .from(emailOtpChallenges)
      .where(
        and(
          eq(emailOtpChallenges.normalizedEmail, normalizedEmail),
          eq(emailOtpChallenges.purpose, input.purpose),
          isNull(emailOtpChallenges.consumedAt),
          isNull(emailOtpChallenges.revokedAt),
          gte(emailOtpChallenges.expiresAt, now),
        ),
      )
      .orderBy(desc(emailOtpChallenges.lastSentAt))
      .limit(1)

    const lastSentAt = latest[0]?.lastSentAt
    const coolingDown = lastSentAt && lastSentAt >= cooldownStart
    if (
      coolingDown ||
      (emailCountRow[0]?.count || 0) >= OTP_EMAIL_WINDOW_LIMIT ||
      (ipCountRow[0]?.count || 0) >= OTP_IP_WINDOW_LIMIT
    ) {
      const retryAfterSeconds = coolingDown
        ? Math.max(
            1,
            Math.ceil(
              (lastSentAt.getTime() + OTP_RESEND_COOLDOWN_MS - now.getTime()) / 1000,
            ),
          )
        : undefined
      return {
        challengeId: coolingDown && latest[0] ? latest[0].id : createOpaqueUuid(),
        accepted: false,
        retryAfterSeconds,
      }
    }

    await transaction
      .update(emailOtpChallenges)
      .set({ revokedAt: now })
      .where(
        and(
          eq(emailOtpChallenges.normalizedEmail, normalizedEmail),
          eq(emailOtpChallenges.purpose, input.purpose),
          isNull(emailOtpChallenges.consumedAt),
          isNull(emailOtpChallenges.revokedAt),
        ),
      )

    await transaction.insert(emailOtpChallenges).values({
      id: challengeId,
      normalizedEmail,
      purpose: input.purpose,
      applicationId: input.applicationId || null,
      codeDigest: digestOtp({
        challengeId,
        normalizedEmail,
        purpose: input.purpose,
        code,
      }),
      digestKeyId,
      maxAttempts: OTP_MAX_ATTEMPTS,
      expiresAt: new Date(now.getTime() + OTP_TTL_MS),
      requestIp: input.requestIp || null,
      userAgent: input.userAgent || null,
    })

    return { challengeId, accepted: true }
  })

  if (!result.accepted) return result

  try {
    await sendEmailOtp({
      email: normalizedEmail,
      code,
      purpose: input.purpose,
    })
  } catch (error) {
    await db
      .update(emailOtpChallenges)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(emailOtpChallenges.id, challengeId),
          isNull(emailOtpChallenges.consumedAt),
          isNull(emailOtpChallenges.revokedAt),
        ),
      )
    throw error
  }

  return result
}

export type VerifyEmailOtpResult =
  | {
      verified: true
      challengeId: string
      normalizedEmail: string
      applicationId: string | null
    }
  | {
      verified: false
      reason: 'INVALID_OR_EXPIRED'
    }

type DatabaseTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

/**
 * Atomically verifies and consumes one OTP challenge. When supplied, `onVerified`
 * runs in the same transaction, so a downstream write failure also rolls back
 * challenge consumption.
 */
export async function verifyEmailOtp<T = undefined>(input: {
  challengeId: string
  code: string
  purpose: EmailOtpPurpose
  onVerified?: (
    transaction: DatabaseTransaction,
    verification: {
      challengeId: string
      normalizedEmail: string
      applicationId: string | null
    },
  ) => Promise<T>
}): Promise<VerifyEmailOtpResult & { data?: T }> {
  const now = new Date()

  return db.transaction(async transaction => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${input.challengeId}, 0))`,
    )

    const [challenge] = await transaction
      .select()
      .from(emailOtpChallenges)
      .where(
        and(
          eq(emailOtpChallenges.id, input.challengeId),
          eq(emailOtpChallenges.purpose, input.purpose),
        ),
      )
      .limit(1)

    if (
      !challenge ||
      challenge.consumedAt ||
      challenge.revokedAt ||
      challenge.expiresAt <= now ||
      challenge.attemptCount >= challenge.maxAttempts
    ) {
      return { verified: false, reason: 'INVALID_OR_EXPIRED' }
    }

    const candidateDigest = digestOtp({
      challengeId: challenge.id,
      normalizedEmail: challenge.normalizedEmail,
      purpose: challenge.purpose,
      code: input.code,
    })

    if (!verifyOtpDigest(challenge.codeDigest, candidateDigest)) {
      const nextAttemptCount = challenge.attemptCount + 1
      await transaction
        .update(emailOtpChallenges)
        .set({
          attemptCount: nextAttemptCount,
          ...(nextAttemptCount >= challenge.maxAttempts ? { revokedAt: now } : {}),
        })
        .where(
          and(
            eq(emailOtpChallenges.id, challenge.id),
            isNull(emailOtpChallenges.consumedAt),
            isNull(emailOtpChallenges.revokedAt),
          ),
        )

      return { verified: false, reason: 'INVALID_OR_EXPIRED' }
    }

    const [consumed] = await transaction
      .update(emailOtpChallenges)
      .set({ consumedAt: now })
      .where(
        and(
          eq(emailOtpChallenges.id, challenge.id),
          isNull(emailOtpChallenges.consumedAt),
          isNull(emailOtpChallenges.revokedAt),
        ),
      )
      .returning({ id: emailOtpChallenges.id })

    if (!consumed) return { verified: false, reason: 'INVALID_OR_EXPIRED' }

    const verification = {
      verified: true,
      challengeId: challenge.id,
      normalizedEmail: challenge.normalizedEmail,
      applicationId: challenge.applicationId,
    } as const

    const data = input.onVerified
      ? await input.onVerified(transaction, verification)
      : undefined

    return { ...verification, data }
  })
}
