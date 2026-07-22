import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import {
  getRequestIpHash,
  getRequestUserAgent,
  assertTrustedOrigin,
} from '@/lib/mentor-applications/security'
import { requestEmailOtp } from '@/lib/mentor-applications/otp'
import { MentorApplicationSecurityError } from '@/lib/mentor-applications/security'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request)

    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      )
    }

    if (session.user.emailVerified === true) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: 'Email is already verified',
      })
    }

    const result = await requestEmailOtp({
      email: session.user.email,
      purpose: 'ACCOUNT_EMAIL_VERIFICATION',
      requestIp: getRequestIpHash(request),
      userAgent: getRequestUserAgent(request),
    })

    if (!result.accepted && !result.retryAfterSeconds) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many verification requests. Please try again later.',
        },
        { status: 429 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        challengeId: result.challengeId,
        retryAfterSeconds: result.retryAfterSeconds,
        message: 'A verification code has been sent',
      },
      { status: 202 },
    )
  } catch (error) {
    if (error instanceof MentorApplicationSecurityError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 },
      )
    }

    console.error('[account-email-verification] Failed to send OTP', error)
    return NextResponse.json(
      { success: false, error: 'Unable to send a verification code' },
      { status: 500 },
    )
  }
}
