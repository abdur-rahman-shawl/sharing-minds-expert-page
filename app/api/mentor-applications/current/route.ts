import { NextRequest, NextResponse } from 'next/server'

import {
  MentorApplicationConflictError,
  saveMentorApplicationDraft,
  serializeMentorApplication,
} from '@/lib/mentor-applications/application'
import { jsonError, validationError } from '@/lib/mentor-applications/http'
import {
  assertTrustedOrigin,
  MentorApplicationSecurityError,
} from '@/lib/mentor-applications/security'
import {
  clearMentorApplicationSessionCookie,
  getMentorApplicationFromSession,
  MentorApplicationSessionError,
} from '@/lib/mentor-applications/session'
import { patchMentorApplicationSchema } from '@/lib/validations/mentor-application'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const current = await getMentorApplicationFromSession(request)
    const application = await serializeMentorApplication(current)
    return NextResponse.json({ success: true, application })
  } catch (error) {
    if (error instanceof MentorApplicationSecurityError) {
      return jsonError(error.message, 403)
    }
    if (error instanceof MentorApplicationSessionError) {
      const response = NextResponse.json(
        { success: true, application: null },
        { headers: { 'Cache-Control': 'no-store' } },
      )
      clearMentorApplicationSessionCookie(response)
      return response
    }
    console.error('[mentor-applications] Current application lookup failed', error)
    return jsonError('Unable to load the mentor application', 500)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    assertTrustedOrigin(request)
    const current = await getMentorApplicationFromSession(request)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return jsonError('Request body must be valid JSON', 400)
    }

    const parsed = patchMentorApplicationSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const saved = await saveMentorApplicationDraft({
      application: current,
      values: parsed.data,
    })
    const application = await serializeMentorApplication(saved)
    return NextResponse.json({ success: true, application })
  } catch (error) {
    if (error instanceof MentorApplicationSecurityError) {
      return jsonError(error.message, 403)
    }
    if (error instanceof MentorApplicationSessionError) {
      return jsonError(error.message, 401)
    }
    if (error instanceof MentorApplicationConflictError) {
      return jsonError(error.message, 409)
    }
    console.error('[mentor-applications] Draft save failed', error)
    return jsonError('Unable to save the mentor application', 500)
  }
}
