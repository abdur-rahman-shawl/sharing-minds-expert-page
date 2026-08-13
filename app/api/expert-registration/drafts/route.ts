import { NextRequest, NextResponse } from 'next/server'

import {
  createExpertRegistrationDraft,
  serializeExpertRegistrationDraft,
} from '@/lib/expert-registration/drafts'
import {
  getExpertRegistrationDraftFromRequest,
  setExpertRegistrationDraftCookie,
} from '@/lib/expert-registration/draft-session'
import { isLiveExpertRegistrationEnabled } from '@/lib/expert-registration/feature'
import { isRestorableExpertRegistrationDraft } from '@/lib/expert-registration/lifecycle'
import {
  assertTrustedOrigin,
  MentorApplicationSecurityError,
} from '@/lib/mentor-applications/security'
import { checkPublicReportRateLimit } from '@/lib/reports/public-report-rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
    const current = await getExpertRegistrationDraftFromRequest(request)
    if (current && isRestorableExpertRegistrationDraft(current.status)) {
      return NextResponse.json(
        {
          success: true,
          draft: await serializeExpertRegistrationDraft(current),
          resumed: true,
        },
        { headers: NO_STORE_HEADERS },
      )
    }

    const rateLimit = checkPublicReportRateLimit(request, Date.now(), {
      namespace: 'expert-registration-draft-create',
      maximumRequests: 20,
      windowMilliseconds: 10 * 60 * 1000,
    })
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many registration attempts. Please wait.' },
        {
          status: 429,
          headers: {
            ...NO_STORE_HEADERS,
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        },
      )
    }

    const created = await createExpertRegistrationDraft(request)
    const response = NextResponse.json(
      {
        success: true,
        draft: await serializeExpertRegistrationDraft(created.draft),
        resumed: false,
      },
      { status: 201, headers: NO_STORE_HEADERS },
    )
    setExpertRegistrationDraftCookie(response, {
      rawToken: created.rawToken,
      expiresAt: created.draft.expiresAt,
    })
    return response
  } catch (error) {
    if (error instanceof MentorApplicationSecurityError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403, headers: NO_STORE_HEADERS },
      )
    }
    console.error('[expert-registration] Unable to create draft', error)
    return NextResponse.json(
      { success: false, error: 'Unable to start the expert registration' },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
