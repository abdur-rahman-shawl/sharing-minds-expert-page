import { NextRequest, NextResponse } from 'next/server'

import {
  ExpertRegistrationDraftError,
  saveExpertRegistrationDraft,
  serializeExpertRegistrationDraft,
} from '@/lib/expert-registration/drafts'
import { getExpertRegistrationDraftFromRequest } from '@/lib/expert-registration/draft-session'
import { isLiveExpertRegistrationEnabled } from '@/lib/expert-registration/feature'
import {
  assertTrustedOrigin,
  MentorApplicationSecurityError,
} from '@/lib/mentor-applications/security'
import { patchMentorApplicationSchema } from '@/lib/validations/mentor-application'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const NO_STORE_HEADERS = { 'Cache-Control': 'private, no-store, max-age=0' }

export async function GET(request: NextRequest) {
  if (!isLiveExpertRegistrationEnabled()) {
    return NextResponse.json(
      { success: false, error: 'Live expert registration is not enabled' },
      { status: 503, headers: NO_STORE_HEADERS },
    )
  }

  try {
    const draft = await getExpertRegistrationDraftFromRequest(request)
    return NextResponse.json(
      {
        success: true,
        draft: draft ? await serializeExpertRegistrationDraft(draft) : null,
      },
      { headers: NO_STORE_HEADERS },
    )
  } catch (error) {
    console.error('[expert-registration] Unable to restore draft', error)
    return NextResponse.json(
      { success: false, error: 'Unable to restore the expert registration' },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}

export async function PATCH(request: NextRequest) {
  if (!isLiveExpertRegistrationEnabled()) {
    return NextResponse.json(
      { success: false, error: 'Live expert registration is not enabled' },
      { status: 503, headers: NO_STORE_HEADERS },
    )
  }

  try {
    assertTrustedOrigin(request)
    const draft = await getExpertRegistrationDraftFromRequest(request)
    if (!draft) {
      return NextResponse.json(
        { success: false, error: 'Registration draft not found' },
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

    const parsed = patchMentorApplicationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'Draft data is invalid',
          issues: parsed.error.flatten(),
        },
        { status: 422, headers: NO_STORE_HEADERS },
      )
    }

    const updated = await saveExpertRegistrationDraft({
      draft,
      values: parsed.data,
    })
    return NextResponse.json(
      { success: true, draft: await serializeExpertRegistrationDraft(updated) },
      { headers: NO_STORE_HEADERS },
    )
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
    console.error('[expert-registration] Draft autosave failed', error)
    return NextResponse.json(
      { success: false, error: 'Unable to save the expert registration' },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
