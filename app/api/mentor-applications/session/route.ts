import { NextRequest, NextResponse } from 'next/server'

import {
  createAuthenticatedApplicationSession,
  MentorApplicationConflictError,
  serializeMentorApplication,
} from '@/lib/mentor-applications/application'
import { getVerifiedApplicationUser } from '@/lib/mentor-applications/auth'
import { jsonError } from '@/lib/mentor-applications/http'
import { promoteMentorApplication } from '@/lib/mentor-applications/promotion'
import {
  assertTrustedOrigin,
  getRequestIpHash,
  getRequestUserAgent,
  MentorApplicationSecurityError,
} from '@/lib/mentor-applications/security'
import {
  clearMentorApplicationSessionCookie,
  revokeMentorApplicationSession,
  setMentorApplicationSessionCookie,
} from '@/lib/mentor-applications/session'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request)
    const user = await getVerifiedApplicationUser(request)
    if (!user) {
      return jsonError('A verified SharingMinds account is required', 401)
    }

    const result = await createAuthenticatedApplicationSession({
      userId: user.id,
      email: user.email,
      requestIp: getRequestIpHash(request),
      userAgent: getRequestUserAgent(request),
    })

    if (result.application.status === 'APPROVED') {
      await promoteMentorApplication(result.application.id)
    }

    const application = await serializeMentorApplication(result.application)
    const response = NextResponse.json({ success: true, application })
    setMentorApplicationSessionCookie(response, result.session)
    return response
  } catch (error) {
    if (error instanceof MentorApplicationSecurityError) {
      return jsonError(error.message, 403)
    }
    if (error instanceof MentorApplicationConflictError) {
      return jsonError(error.message, 409)
    }
    console.error('[mentor-applications] Authenticated session creation failed', error)
    return jsonError('Unable to open the mentor application', 500)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    assertTrustedOrigin(request)
    await revokeMentorApplicationSession(request)

    const response = NextResponse.json({ success: true })
    clearMentorApplicationSessionCookie(response)
    return response
  } catch (error) {
    if (error instanceof MentorApplicationSecurityError) {
      return jsonError(error.message, 403)
    }
    console.error('[mentor-applications] Session revocation failed', error)
    return jsonError('Unable to close the mentor application session', 500)
  }
}
