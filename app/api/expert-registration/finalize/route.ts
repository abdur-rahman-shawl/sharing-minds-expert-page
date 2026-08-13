import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import {
  ExpertRegistrationDraftError,
} from '@/lib/expert-registration/drafts'
import {
  clearExpertRegistrationDraftCookie,
  getExpertRegistrationDraftFromRequest,
} from '@/lib/expert-registration/draft-session'
import { isLiveExpertRegistrationEnabled } from '@/lib/expert-registration/feature'
import { finalizeExpertRegistration } from '@/lib/expert-registration/finalize'
import {
  shouldClearExpertRegistrationDraftAfterFinalization,
} from '@/lib/expert-registration/lifecycle'
import { sendMentorApplicationReceivedEmail } from '@/lib/mentor-applications/email'
import { getAuthenticatedApplicationUser } from '@/lib/mentor-applications/auth'
import {
  assertTrustedOrigin,
  MentorApplicationSecurityError,
} from '@/lib/mentor-applications/security'
import { checkPublicReportRateLimit } from '@/lib/reports/public-report-rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

const finalizeSchema = z.object({
  authMethod: z.enum([
    'GOOGLE',
    'LINKEDIN',
    'EMAIL_PASSWORD',
    'EXISTING_SESSION',
  ]),
})

const NO_STORE_HEADERS = { 'Cache-Control': 'private, no-store, max-age=0' }

export async function POST(request: NextRequest) {
  if (!isLiveExpertRegistrationEnabled()) {
    return NextResponse.json(
      { success: false, error: 'Live expert registration is not enabled' },
      { status: 503, headers: NO_STORE_HEADERS },
    )
  }

  try {
    assertTrustedOrigin(request)
    const rateLimit = checkPublicReportRateLimit(request, Date.now(), {
      namespace: 'expert-registration-finalize',
      maximumRequests: 20,
      windowMilliseconds: 10 * 60 * 1000,
    })
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many submission attempts. Please wait.' },
        {
          status: 429,
          headers: {
            ...NO_STORE_HEADERS,
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        },
      )
    }

    const [draft, user] = await Promise.all([
      getExpertRegistrationDraftFromRequest(request),
      getAuthenticatedApplicationUser(request),
    ])
    if (!draft) {
      return NextResponse.json(
        { success: false, error: 'Registration draft not found' },
        { status: 401, headers: NO_STORE_HEADERS },
      )
    }
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Sign in is required to submit the registration' },
        { status: 401, headers: NO_STORE_HEADERS },
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Request body must be valid JSON' },
        { status: 400, headers: NO_STORE_HEADERS },
      )
    }
    const parsed = finalizeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'A valid sign-in method is required' },
        { status: 422, headers: NO_STORE_HEADERS },
      )
    }

    const result = await finalizeExpertRegistration({
      request,
      draft,
      user,
      authMethod: parsed.data.authMethod,
    })

    if (result.outcome === 'CREATED') {
      try {
        await sendMentorApplicationReceivedEmail({
          email: result.mentor.email,
          fullName: result.mentor.fullName || 'Expert',
          accountBacked: true,
        })
      } catch (error) {
        console.error('[expert-registration] Confirmation email failed', error)
      }
    }

    const response = NextResponse.json(
      { success: true, mentor: result.mentor, outcome: result.outcome },
      {
        status: result.outcome === 'CREATED' ? 201 : 200,
        headers: NO_STORE_HEADERS,
      },
    )
    if (shouldClearExpertRegistrationDraftAfterFinalization(result.outcome)) {
      clearExpertRegistrationDraftCookie(response)
    }
    return response
  } catch (error) {
    if (error instanceof MentorApplicationSecurityError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403, headers: NO_STORE_HEADERS },
      )
    }
    if (error instanceof ExpertRegistrationDraftError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status, headers: NO_STORE_HEADERS },
      )
    }
    console.error('[expert-registration] Finalization failed', error)
    return NextResponse.json(
      { success: false, error: 'Unable to complete the expert registration' },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
