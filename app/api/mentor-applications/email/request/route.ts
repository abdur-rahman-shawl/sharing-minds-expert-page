import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { mentorApplications } from '@/lib/db/schema'
import { jsonError } from '@/lib/mentor-applications/http'
import { requestEmailOtp } from '@/lib/mentor-applications/otp'
import {
  assertTrustedOrigin,
  createOpaqueUuid,
  getRequestIpHash,
  getRequestUserAgent,
  MentorApplicationSecurityError,
  normalizeEmail,
} from '@/lib/mentor-applications/security'
import { requestMentorApplicationOtpSchema } from '@/lib/validations/mentor-application'
import { markCurrentCampaignVisitOtpRequested } from '@/lib/campaign-attribution/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const GENERIC_MESSAGE =
  'If the address is valid, a verification code has been sent.'

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request)
  } catch (error) {
    if (error instanceof MentorApplicationSecurityError) {
      return jsonError(error.message, 403)
    }
    throw error
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError('Request body must be valid JSON', 400)
  }

  const parsed = requestMentorApplicationOtpSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Enter a valid email address', 422)
  }

  // Once the input is syntactically valid, all outcomes are intentionally
  // indistinguishable to avoid revealing existing applications.
  try {
    try {
      await markCurrentCampaignVisitOtpRequested(request)
    } catch (error) {
      console.error('[campaign-attribution] Unable to mark OTP start', error)
    }

    const normalizedEmail = normalizeEmail(parsed.data.email)
    const [existingApplication] = await db
      .select({ id: mentorApplications.id })
      .from(mentorApplications)
      .where(eq(mentorApplications.normalizedEmail, normalizedEmail))
      .limit(1)

    const result = await requestEmailOtp({
      email: normalizedEmail,
      purpose: 'MENTOR_APPLICATION_ACCESS',
      applicationId: existingApplication?.id,
      requestIp: getRequestIpHash(request),
      userAgent: getRequestUserAgent(request),
    })

    return NextResponse.json(
      { success: true, message: GENERIC_MESSAGE, challengeId: result.challengeId },
      { status: 202 },
    )
  } catch (error) {
    console.error('[mentor-applications] OTP request could not be completed', error)
    return NextResponse.json(
      {
        success: true,
        message: GENERIC_MESSAGE,
        challengeId: createOpaqueUuid(),
      },
      { status: 202 },
    )
  }
}
