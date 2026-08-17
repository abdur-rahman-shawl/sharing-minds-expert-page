import 'server-only'

import { and, eq, inArray, sql } from 'drizzle-orm'
import type { NextRequest } from 'next/server'

import { getCurrentAttributionVisitId } from '@/lib/campaign-attribution/server'
import { db } from '@/lib/db'
import {
  mentorRegistrationDrafts,
  mentorRegistrationFiles,
  type MentorRegistrationDraft,
  type MentorRegistrationFile,
} from '@/lib/db/schema'
import { withTransientDatabaseRetry } from '@/lib/db/retry'
import type { MentorApplicationPatchInput } from '@/lib/validations/mentor-application'

import { LIVE_EXPERT_REGISTRATION_SCHEMA_VERSION } from './constants'
import {
  createExpertRegistrationDraftToken,
  newDraftExpiration,
} from './draft-session'
import { getExpertRegistrationFileUrl } from './urls'

export class ExpertRegistrationDraftError extends Error {
  constructor(message: string, public readonly status = 409) {
    super(message)
    this.name = 'ExpertRegistrationDraftError'
  }
}

export async function createExpertRegistrationDraft(request: NextRequest) {
  const now = new Date()
  const token = createExpertRegistrationDraftToken()
  let attributionVisitId: string | null = null
  try {
    attributionVisitId = await getCurrentAttributionVisitId(request)
  } catch (error) {
    console.error('[expert-registration] Unable to capture draft attribution', error)
  }

  const [draft] = await db
    .insert(mentorRegistrationDrafts)
    .values({
      accessTokenDigest: token.tokenDigest,
      schemaVersion: LIVE_EXPERT_REGISTRATION_SCHEMA_VERSION,
      formPayload: {},
      attributionVisitId,
      attributionCapturedAt: attributionVisitId ? now : null,
      expiresAt: newDraftExpiration(now),
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return { draft, rawToken: token.rawToken }
}

export async function saveExpertRegistrationDraft(input: {
  draft: MentorRegistrationDraft
  values: MentorApplicationPatchInput
}): Promise<MentorRegistrationDraft> {
  if (!['DRAFT', 'READY_FOR_AUTH'].includes(input.draft.status)) {
    throw new ExpertRegistrationDraftError(
      'This registration can no longer be edited',
    )
  }

  const updated = await db.transaction(async tx => {
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`expert-registration-draft:${input.draft.id}`}, 0))`,
    )

    const [current] = await tx
      .select()
      .from(mentorRegistrationDrafts)
      .where(eq(mentorRegistrationDrafts.id, input.draft.id))
      .limit(1)

    if (!current || !['DRAFT', 'READY_FOR_AUTH'].includes(current.status)) {
      throw new ExpertRegistrationDraftError(
        'This registration can no longer be edited',
      )
    }

    const now = new Date()
    const [saved] = await tx
      .update(mentorRegistrationDrafts)
      .set({
        formPayload: {
          ...(current.formPayload || {}),
          ...input.values,
        },
        consentSnapshot: null,
        status: 'DRAFT',
        updatedAt: now,
      })
      .where(
        and(
          eq(mentorRegistrationDrafts.id, input.draft.id),
          inArray(mentorRegistrationDrafts.status, ['DRAFT', 'READY_FOR_AUTH']),
        ),
      )
      .returning()

    return saved
  })

  if (!updated) {
    throw new ExpertRegistrationDraftError(
      'This registration changed while it was being saved',
    )
  }
  return updated
}

export async function getCurrentExpertRegistrationFiles(
  draftId: string,
): Promise<MentorRegistrationFile[]> {
  return withTransientDatabaseRetry(() =>
    db
      .select()
      .from(mentorRegistrationFiles)
      .where(
        and(
          eq(mentorRegistrationFiles.registrationDraftId, draftId),
          eq(mentorRegistrationFiles.isCurrent, true),
        ),
      ),
  )
}

export async function serializeExpertRegistrationDraft(
  draft: MentorRegistrationDraft,
) {
  const payload = (draft.formPayload || {}) as Record<string, unknown>
  const files = await getCurrentExpertRegistrationFiles(draft.id)
  const file = (kind: MentorRegistrationFile['kind']) =>
    files.find(candidate => candidate.kind === kind)

  return {
    id: draft.id,
    status: 'DRAFT' as const,
    registrationDraftStatus: draft.status,
    email: '',
    ...payload,
    profileImageUrl: file('PROFILE_IMAGE')
      ? getExpertRegistrationFileUrl(file('PROFILE_IMAGE')!.id)
      : null,
    resumeUrl: file('RESUME')
      ? getExpertRegistrationFileUrl(file('RESUME')!.id)
      : null,
    portfolioUrl: file('PORTFOLIO')
      ? getExpertRegistrationFileUrl(file('PORTFOLIO')!.id)
      : null,
    caseStudyUrl: file('CASE_STUDY')
      ? getExpertRegistrationFileUrl(file('CASE_STUDY')!.id)
      : null,
    presentationUrl: file('PRESENTATION')
      ? getExpertRegistrationFileUrl(file('PRESENTATION')!.id)
      : null,
    awardsCertificationsUrl: file('AWARDS_CERTIFICATIONS')
      ? getExpertRegistrationFileUrl(file('AWARDS_CERTIFICATIONS')!.id)
      : null,
    submittedAt: draft.completedAt?.toISOString() || null,
    updatedAt: draft.updatedAt.toISOString(),
  }
}
