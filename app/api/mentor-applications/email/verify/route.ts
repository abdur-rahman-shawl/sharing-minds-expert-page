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

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
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

    const result = await verifyMentorApplicationOtpAndIssueSession({
      ...parsed.data,
      requestIp: getRequestIpHash(request),
      userAgent: getRequestUserAgent(request),
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
