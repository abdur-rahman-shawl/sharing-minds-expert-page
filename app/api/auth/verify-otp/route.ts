import { and, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { users } from '@/lib/db/schema'
import { areMentorApplicationsEnabled } from '@/lib/mentor-applications/feature'
import { verifyEmailOtp } from '@/lib/mentor-applications/otp'
import { claimMentorApplicationForVerifiedUser } from '@/lib/mentor-applications/promotion'
import { isLegacyMentorApplicationAutoClaimEnabled } from '@/lib/expert-registration/feature'
import {
  assertTrustedOrigin,
  MentorApplicationSecurityError,
  normalizeEmail,
} from '@/lib/mentor-applications/security'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const verifyAccountEmailSchema = z.object({
  challengeId: z.string().uuid(),
  otp: z.string().trim().regex(/^\d{6}$/),
})

class AccountChallengeMismatchError extends Error {}

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request)

    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      )
    }

    if (session.user.emailVerified === true) {
      return NextResponse.json({ success: true, message: 'Email is already verified' })
    }

    const parsed = verifyAccountEmailSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'A valid challenge and six-digit code are required' },
        { status: 400 },
      )
    }

    const sessionEmail = normalizeEmail(session.user.email)
    const result = await verifyEmailOtp({
      challengeId: parsed.data.challengeId,
      code: parsed.data.otp,
      purpose: 'ACCOUNT_EMAIL_VERIFICATION',
      onVerified: async (transaction, verification) => {
        if (verification.normalizedEmail !== sessionEmail) {
          throw new AccountChallengeMismatchError()
        }

        const [verifiedUser] = await transaction
          .update(users)
          .set({ emailVerified: true, updatedAt: new Date() })
          .where(
            and(
              eq(users.id, session.user.id),
              eq(users.email, session.user.email),
            ),
          )
          .returning({ id: users.id })

        if (!verifiedUser) {
          throw new AccountChallengeMismatchError()
        }
      },
    })

    if (!result.verified) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification code' },
        { status: 400 },
      )
    }

    if (
      areMentorApplicationsEnabled() &&
      isLegacyMentorApplicationAutoClaimEnabled()
    ) {
      try {
        await claimMentorApplicationForVerifiedUser({
          userId: session.user.id,
        })
      } catch (error) {
        // Account verification succeeded independently. Claiming is idempotent
        // and can be retried after login or through the explicit claim endpoint.
        console.error('[account-email-verification] Application reconciliation failed', error)
      }
    }

    return NextResponse.json({ success: true, message: 'Email verified' })
  } catch (error) {
    if (
      error instanceof MentorApplicationSecurityError ||
      error instanceof AccountChallengeMismatchError
    ) {
      return NextResponse.json(
        { success: false, error: 'Verification could not be authorized' },
        { status: 403 },
      )
    }

    console.error('[account-email-verification] Failed to verify OTP', error)
    return NextResponse.json(
      { success: false, error: 'Unable to verify the code' },
      { status: 500 },
    )
  }
}
