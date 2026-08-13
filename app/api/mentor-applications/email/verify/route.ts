import { NextRequest, NextResponse } from 'next/server'

import {
  serializeMentorApplication,
  verifyMentorApplicationOtpAndIssueSession,
} from '@/lib/mentor-applications/application'
import {
  handleMentorApplicationRouteError,
  jsonError,
} from '@/lib/mentor-applications/http'
import {
  assertTrustedOrigin,
  getRequestIpHash,
  getRequestUserAgent,
} from '@/lib/mentor-applications/security'
import { setMentorApplicationSessionCookie } from '@/lib/mentor-applications/session'
import { verifyMentorApplicationOtpSchema } from '@/lib/validations/mentor-application'
import { getCurrentAttributionVisitId } from '@/lib/campaign-attribution/server'
import {
  isLegacyMentorApplicationAccessEnabled,
  isLegacyMentorApplicationIntakeEnabled,
} from '@/lib/expert-registration/feature'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    if (!isLegacyMentorApplicationAccessEnabled()) {
      return jsonError('Legacy application access is currently unavailable', 503)
    }
    assertTrustedOrigin(request)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return jsonError('Request body must be valid JSON', 400)
    }

    const parsed = verifyMentorApplicationOtpSchema.safeParse(body)
    if (!parsed.success) {
      return jsonError('The verification code is invalid or has expired', 400)
    }

    let attributionVisitId: string | null = null
    try {
      attributionVisitId = await getCurrentAttributionVisitId(request)
    } catch (error) {
      console.error('[campaign-attribution] Unable to resolve application source', error)
    }

    const result = await verifyMentorApplicationOtpAndIssueSession({
      ...parsed.data,
      attributionVisitId,
      requestIp: getRequestIpHash(request),
      userAgent: getRequestUserAgent(request),
      allowCreate: isLegacyMentorApplicationIntakeEnabled(),
    })

    if (!result.verified || !result.data) {
      return jsonError('The verification code is invalid or has expired', 400)
    }

    const application = await serializeMentorApplication(result.data.application)
    const response = NextResponse.json({ success: true, application })
    setMentorApplicationSessionCookie(response, result.data.session)
    return response
  } catch (error) {
    return handleMentorApplicationRouteError('Email verification failed', error)
  }
}
