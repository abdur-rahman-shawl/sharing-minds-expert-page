import { NextRequest, NextResponse } from 'next/server'

import { serializeMentorApplication } from '@/lib/mentor-applications/application'
import { getVerifiedApplicationUser } from '@/lib/mentor-applications/auth'
import { jsonError } from '@/lib/mentor-applications/http'
import {
  claimMentorApplicationForVerifiedUser,
} from '@/lib/mentor-applications/promotion'
import {
  assertTrustedOrigin,
  getRequestIpHash,
  getRequestUserAgent,
  MentorApplicationSecurityError,
} from '@/lib/mentor-applications/security'
import {
  issueMentorApplicationSession,
  setMentorApplicationSessionCookie,
} from '@/lib/mentor-applications/session'
import { MentorApplicationConflictError } from '@/lib/mentor-applications/application'
import { isLegacyMentorApplicationAutoClaimEnabled } from '@/lib/expert-registration/feature'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    if (!isLegacyMentorApplicationAutoClaimEnabled()) {
      return jsonError('Legacy application linking is currently paused', 503)
    }
    assertTrustedOrigin(request)
    const user = await getVerifiedApplicationUser(request)
    if (!user) return jsonError('A verified SharingMinds account is required', 401)

    const result = await claimMentorApplicationForVerifiedUser({
      userId: user.id,
    })
    if (!result.application) {
      return jsonError('No mentor application matches this verified email', 404)
    }

    const scopedSession = await issueMentorApplicationSession({
      applicationId: result.application.id,
      requestIp: getRequestIpHash(request),
      userAgent: getRequestUserAgent(request),
    })
    const response = NextResponse.json({
      success: true,
      linked: result.linked,
      promotion: result.promotion,
      application: await serializeMentorApplication(result.application),
    })
    setMentorApplicationSessionCookie(response, scopedSession)
    return response
  } catch (error) {
    if (error instanceof MentorApplicationSecurityError) {
      return jsonError(error.message, 403)
    }
    if (error instanceof MentorApplicationConflictError) {
      return jsonError(error.message, 409)
    }
    console.error('[mentor-applications] Application claim failed', error)
    return jsonError('Unable to claim the mentor application', 500)
  }
}
