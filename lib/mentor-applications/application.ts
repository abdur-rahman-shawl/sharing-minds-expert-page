import 'server-only'

import { and, eq, inArray, ne, sql } from 'drizzle-orm'

import { db } from '@/lib/db'
import {
  consentEvents,
  mentorApplicationEvents,
  mentorApplicationFiles,
  mentorApplicationRevisions,
  mentorApplications,
  type MentorApplication,
  type MentorApplicationSource,
} from '@/lib/db/schema'
import { legalDocuments } from '@/lib/legal-documents'
import {
  INDUSTRY_OPTIONS,
  optionLabel,
} from '@/lib/mentor-application-options'
import { normalizeMentorSearchValue } from '@/lib/mentor-onboarding'
import { supabaseAdmin } from '@/lib/supabase'
import {
  MENTOR_APPLICATION_SCHEMA_VERSION,
  type MentorApplicationConsentInput,
  type MentorApplicationDraftInput,
  type MentorApplicationPatchInput,
} from '@/lib/validations/mentor-application'

import type { UploadedApplicationFile } from './storage'
import { verifyEmailOtp } from './otp'
import { issueMentorApplicationSession } from './session'
import { normalizeEmail, sha256Hex } from './security'
import { getMentorApplicationFileUrl } from './urls'

type DatabaseTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

export class MentorApplicationConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MentorApplicationConflictError'
  }
}

export type MentorApplicationResponse = {
  id: string
  status: MentorApplication['status']
  email: string
  fullName: string
  phone: string
  countryId: string
  stateId: string
  cityId: string
  professionalHeadline: string
  title: string
  company: string
  websiteUrl: string
  employmentType: string
  experienceBand: string
  industries: string[]
  otherIndustry: string
  expertise: string[]
  otherExpertise: string
  about: string
  challengeSolved: string
  measurableOutcomes: string
  guidanceValueProposition: string
  credibilitySignals: string[]
  linkedinUrl: string
  serviceInterests: string[]
  preferredSessionMode: string
  languages: string[]
  otherLanguage: string
  weeklyAvailabilityBand: string
  profileImageUrl: string | null
  resumeUrl: string | null
  portfolioUrl: string | null
  caseStudyUrl: string | null
  presentationUrl: string | null
  awardsCertificationsUrl: string | null
  verificationNotes: string | null
  submittedAt: string | null
  updatedAt: string
}

async function upsertVerifiedApplication(input: {
  transaction: DatabaseTransaction
  email: string
  source: MentorApplicationSource
  attributionVisitId?: string | null
}): Promise<{ application: MentorApplication; created: boolean }> {
  const normalizedEmail = normalizeEmail(input.email)
  const now = new Date()

  await input.transaction.execute(
    sql`select pg_advisory_xact_lock(hashtextextended(${`mentor-application:${normalizedEmail}`}, 0))`,
  )

  const [existing] = await input.transaction
    .select()
    .from(mentorApplications)
    .where(eq(mentorApplications.normalizedEmail, normalizedEmail))
    .limit(1)

  if (existing) {
    const [application] = await input.transaction
      .update(mentorApplications)
      .set({
        emailVerifiedAt: now,
        updatedAt: now,
      })
      .where(eq(mentorApplications.id, existing.id))
      .returning()

    await input.transaction.insert(mentorApplicationEvents).values({
      applicationId: existing.id,
      eventType: 'EMAIL_VERIFIED',
      metadata: { source: input.source },
    })

    return { application, created: false }
  }

  const [application] = await input.transaction
    .insert(mentorApplications)
    .values({
      email: normalizedEmail,
      normalizedEmail,
      emailVerifiedAt: now,
      source: input.source,
      attributionVisitId: input.attributionVisitId || null,
      attributionCapturedAt: input.attributionVisitId ? now : null,
      lastSavedAt: now,
    })
    .returning()

  await input.transaction.insert(mentorApplicationEvents).values([
    {
      applicationId: application.id,
      eventType: 'CREATED',
      metadata: {
        source: input.source,
        attributionVisitId: input.attributionVisitId || null,
      },
    },
    {
      applicationId: application.id,
      eventType: 'EMAIL_VERIFIED',
      metadata: { source: input.source },
    },
  ])

  return { application, created: true }
}

export async function verifyMentorApplicationOtpAndIssueSession(input: {
  challengeId: string
  code: string
  attributionVisitId?: string | null
  requestIp?: string | null
  userAgent?: string | null
  allowCreate?: boolean
}) {
  return verifyEmailOtp({
    challengeId: input.challengeId,
    code: input.code,
    purpose: 'MENTOR_APPLICATION_ACCESS',
    onVerified: async (transaction, verification) => {
      if (input.allowCreate === false) {
        const [existing] = await transaction
          .select({ id: mentorApplications.id })
          .from(mentorApplications)
          .where(
            eq(
              mentorApplications.normalizedEmail,
              verification.normalizedEmail,
            ),
          )
          .limit(1)
        if (!existing) {
          throw new MentorApplicationConflictError(
            'New legacy mentor applications are no longer accepted',
          )
        }
      }
      const { application } = await upsertVerifiedApplication({
        transaction,
        email: verification.normalizedEmail,
        source: 'GUEST',
        attributionVisitId: input.attributionVisitId,
      })
      const session = await issueMentorApplicationSession({
        applicationId: application.id,
        requestIp: input.requestIp,
        userAgent: input.userAgent,
        transaction,
      })
      return { application, session }
    },
  })
}

export async function createAuthenticatedApplicationSession(input: {
  userId: string
  email: string
  attributionVisitId?: string | null
  requestIp?: string | null
  userAgent?: string | null
  allowCreate?: boolean
}) {
  const result = await db.transaction(async transaction => {
    if (input.allowCreate === false) {
      const [existing] = await transaction
        .select({ id: mentorApplications.id })
        .from(mentorApplications)
        .where(
          eq(mentorApplications.normalizedEmail, normalizeEmail(input.email)),
        )
        .limit(1)
      if (!existing) {
        throw new MentorApplicationConflictError(
          'New legacy mentor applications are no longer accepted',
        )
      }
    }

    const { application: initialApplication } = await upsertVerifiedApplication({
      transaction,
      email: input.email,
      source: 'AUTHENTICATED',
      attributionVisitId: input.attributionVisitId,
    })

    if (
      initialApplication.linkedUserId &&
      initialApplication.linkedUserId !== input.userId
    ) {
      await transaction.insert(mentorApplicationEvents).values({
        applicationId: initialApplication.id,
        actorUserId: input.userId,
        eventType: 'LINK_CONFLICT',
        metadata: { reason: 'already-linked' },
      })
      return {
        conflict: 'This application is already linked to another account',
      } as const
    }

    let application = initialApplication
    if (!application.linkedUserId) {
      const [otherApplication] = await transaction
        .select({ id: mentorApplications.id })
        .from(mentorApplications)
        .where(
          and(
            eq(mentorApplications.linkedUserId, input.userId),
            ne(mentorApplications.id, application.id),
          ),
        )
        .limit(1)
      if (otherApplication) {
        await transaction.insert(mentorApplicationEvents).values({
          applicationId: application.id,
          actorUserId: input.userId,
          eventType: 'LINK_CONFLICT',
          metadata: {
            reason: 'user-linked-to-other-application',
            conflictingApplicationId: otherApplication.id,
          },
        })
        return {
          conflict: 'This account is already linked to another mentor application',
        } as const
      }

      const [linked] = await transaction
        .update(mentorApplications)
        .set({ linkedUserId: input.userId, linkedAt: new Date(), updatedAt: new Date() })
        .where(
          and(
            eq(mentorApplications.id, application.id),
            sql`${mentorApplications.linkedUserId} is null`,
          ),
        )
        .returning()
      if (!linked) {
        await transaction.insert(mentorApplicationEvents).values({
          applicationId: application.id,
          actorUserId: input.userId,
          eventType: 'LINK_CONFLICT',
          metadata: { reason: 'concurrent-link' },
        })
        return { conflict: 'Unable to link application' } as const
      }
      application = linked

      await transaction.insert(mentorApplicationEvents).values({
        applicationId: application.id,
        actorUserId: input.userId,
        eventType: 'LINKED',
        metadata: { method: 'verified-authenticated-session' },
      })
    }

    const session = await issueMentorApplicationSession({
      applicationId: application.id,
      requestIp: input.requestIp,
      userAgent: input.userAgent,
      transaction,
    })
    return { application, session }
  })

  // Conflict audit writes must commit before the request surfaces the conflict.
  // Throwing inside the transaction would roll the LINK_CONFLICT event back.
  if ('conflict' in result && result.conflict) {
    throw new MentorApplicationConflictError(result.conflict)
  }

  return result
}

function toApplicationValues(
  input: MentorApplicationPatchInput | MentorApplicationDraftInput,
) {
  const patchInput = input as MentorApplicationPatchInput
  const normalizedPhone =
    input.phone === undefined
      ? undefined
      : input.phone === ''
        ? ''
      : patchInput.phoneCountryCode && !input.phone.startsWith('+')
        ? `${patchInput.phoneCountryCode.startsWith('+') ? patchInput.phoneCountryCode : `+${patchInput.phoneCountryCode}`}-${input.phone}`
        : input.phone

  const primaryIndustry =
    input.industries === undefined || input.industries.length === 0
      ? null
      : input.industries[0] === 'OTHER'
        ? input.otherIndustry || 'Other'
        : optionLabel(INDUSTRY_OPTIONS, input.industries[0])

  return {
    applicationSchemaVersion: MENTOR_APPLICATION_SCHEMA_VERSION,
    ...(input.fullName === undefined ? {} : { fullName: input.fullName }),
    ...(normalizedPhone === undefined ? {} : { phone: normalizedPhone }),
    ...(input.countryId === undefined ? {} : { countryId: input.countryId }),
    ...(input.stateId === undefined ? {} : { stateId: input.stateId }),
    ...(input.cityId === undefined ? {} : { cityId: input.cityId }),
    ...(input.professionalHeadline === undefined
      ? {}
      : { professionalHeadline: input.professionalHeadline || null }),
    ...(input.title === undefined
      ? {}
      : {
          title: input.title,
          normalizedTitle: normalizeMentorSearchValue(input.title),
        }),
    ...(input.company === undefined ? {} : { company: input.company }),
    ...(input.websiteUrl === undefined
      ? {}
      : { websiteUrl: input.websiteUrl || null }),
    ...(input.employmentType === undefined
      ? {}
      : { employmentType: input.employmentType || null }),
    ...(input.industries === undefined
      ? {}
      : {
          industries: input.industries,
          industry: primaryIndustry,
          normalizedIndustry: primaryIndustry
            ? normalizeMentorSearchValue(primaryIndustry)
            : null,
        }),
    ...(input.otherIndustry === undefined
      ? {}
      : { otherIndustry: input.otherIndustry || null }),
    ...(input.expertise === undefined
      ? {}
      : { expertise: input.expertise }),
    ...(input.otherExpertise === undefined
      ? {}
      : { otherExpertise: input.otherExpertise || null }),
    ...(input.experienceBand === undefined
      ? {}
      : {
          experienceBand: input.experienceBand || null,
          experienceYears: null,
          requestedHourlyRate: null,
          availability: null,
        }),
    ...(input.about === undefined ? {} : { about: input.about || null }),
    ...(input.challengeSolved === undefined
      ? {}
      : { challengeSolved: input.challengeSolved || null }),
    ...(input.measurableOutcomes === undefined
      ? {}
      : { measurableOutcomes: input.measurableOutcomes || null }),
    ...(input.guidanceValueProposition === undefined
      ? {}
      : { guidanceValueProposition: input.guidanceValueProposition || null }),
    ...(input.credibilitySignals === undefined
      ? {}
      : { credibilitySignals: input.credibilitySignals }),
    ...(input.linkedinUrl === undefined
      ? {}
      : { linkedinUrl: input.linkedinUrl || null }),
    ...(input.serviceInterests === undefined
      ? {}
      : { serviceInterests: input.serviceInterests }),
    ...(input.preferredSessionMode === undefined
      ? {}
      : { preferredSessionMode: input.preferredSessionMode || null }),
    ...(input.languages === undefined ? {} : { languages: input.languages }),
    ...(input.otherLanguage === undefined
      ? {}
      : { otherLanguage: input.otherLanguage || null }),
    ...(input.weeklyAvailabilityBand === undefined
      ? {}
      : { weeklyAvailabilityBand: input.weeklyAvailabilityBand || null }),
  }
}

export async function saveMentorApplicationDraft(input: {
  application: MentorApplication
  values: MentorApplicationPatchInput
}): Promise<MentorApplication> {
  if (!['DRAFT', 'CHANGES_REQUESTED'].includes(input.application.status)) {
    throw new MentorApplicationConflictError(
      'This application cannot be edited in its current state',
    )
  }

  const now = new Date()
  const [updated] = await db
    .update(mentorApplications)
    .set({ ...toApplicationValues(input.values), lastSavedAt: now, updatedAt: now })
    .where(
      and(
        eq(mentorApplications.id, input.application.id),
        inArray(mentorApplications.status, ['DRAFT', 'CHANGES_REQUESTED']),
      ),
    )
    .returning()

  if (!updated) {
    throw new MentorApplicationConflictError(
      'This application changed while it was being saved',
    )
  }

  await db.insert(mentorApplicationEvents).values({
    applicationId: updated.id,
    eventType: 'DRAFT_SAVED',
    metadata: { fields: Object.keys(input.values) },
  })
  return updated
}

export async function validateApplicationLocation(input: {
  countryId: string
  stateId: string
  cityId: string
}): Promise<{ country: string; state: string; city: string }> {
  const [countryResult, stateResult, cityResult] = await Promise.all([
    supabaseAdmin.from('countries').select('id, name').eq('id', input.countryId).single(),
    supabaseAdmin
      .from('states')
      .select('id, name')
      .eq('id', input.stateId)
      .eq('country_id', input.countryId)
      .single(),
    supabaseAdmin
      .from('cities')
      .select('id, name')
      .eq('id', input.cityId)
      .eq('state_id', input.stateId)
      .single(),
  ])

  if (
    countryResult.error ||
    stateResult.error ||
    cityResult.error ||
    !countryResult.data?.name ||
    !stateResult.data?.name ||
    !cityResult.data?.name
  ) {
    throw new MentorApplicationConflictError(
      'Please select a valid country, state, and city',
    )
  }

  return {
    country: countryResult.data.name,
    state: stateResult.data.name,
    city: cityResult.data.name,
  }
}

export type PendingApplicationFile = UploadedApplicationFile & {
  kind:
    | 'PROFILE_IMAGE'
    | 'RESUME'
    | 'PORTFOLIO'
    | 'CASE_STUDY'
    | 'PRESENTATION'
    | 'AWARDS_CERTIFICATIONS'
}

export async function submitMentorApplication(input: {
  application: MentorApplication
  values: MentorApplicationDraftInput
  location: { country: string; state: string; city: string }
  files: PendingApplicationFile[]
  consents: MentorApplicationConsentInput[]
  requestIp?: string | null
  userAgent?: string | null
  idempotencyKey: string
}): Promise<{ application: MentorApplication; replayed: boolean }> {
  const now = new Date()

  return db.transaction(async transaction => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`mentor-application-submit:${input.application.id}`}, 0))`,
    )

    const [existingRevision] = await transaction
      .select({ applicationId: mentorApplicationRevisions.applicationId })
      .from(mentorApplicationRevisions)
      .where(eq(mentorApplicationRevisions.idempotencyKey, input.idempotencyKey))
      .limit(1)

    if (existingRevision) {
      if (existingRevision.applicationId !== input.application.id) {
        throw new MentorApplicationConflictError('Idempotency key is already in use')
      }
      const [existingApplication] = await transaction
        .select()
        .from(mentorApplications)
        .where(eq(mentorApplications.id, existingRevision.applicationId))
        .limit(1)
      if (!existingApplication) {
        throw new MentorApplicationConflictError('Application could not be restored')
      }
      return { application: existingApplication, replayed: true }
    }

    const [current] = await transaction
      .select()
      .from(mentorApplications)
      .where(eq(mentorApplications.id, input.application.id))
      .limit(1)

    if (!current || !['DRAFT', 'CHANGES_REQUESTED'].includes(current.status)) {
      throw new MentorApplicationConflictError(
        'This application cannot be submitted in its current state',
      )
    }

    const currentFiles = await transaction
      .select()
      .from(mentorApplicationFiles)
      .where(
        and(
          eq(mentorApplicationFiles.applicationId, current.id),
          eq(mentorApplicationFiles.isCurrent, true),
        ),
      )
    const hasProfileImage =
      input.files.some(file => file.kind === 'PROFILE_IMAGE') ||
      currentFiles.some(file => file.kind === 'PROFILE_IMAGE')
    if (!hasProfileImage) {
      throw new MentorApplicationConflictError('A profile image is required')
    }
    const hasResume =
      input.files.some(file => file.kind === 'RESUME') ||
      currentFiles.some(file => file.kind === 'RESUME')
    if (!hasResume) {
      throw new MentorApplicationConflictError('A resume is required')
    }

    const insertedFileIds: Record<string, string> = {}
    for (const file of input.files) {
      await transaction
        .update(mentorApplicationFiles)
        .set({ isCurrent: false, updatedAt: now })
        .where(
          and(
            eq(mentorApplicationFiles.applicationId, current.id),
            eq(mentorApplicationFiles.kind, file.kind),
            eq(mentorApplicationFiles.isCurrent, true),
          ),
        )

      const [insertedFile] = await transaction
        .insert(mentorApplicationFiles)
        .values({
          applicationId: current.id,
          kind: file.kind,
          storageBucket: file.storageBucket,
          storagePath: file.storagePath,
          originalFileName: file.originalFileName,
          mediaType: file.mediaType,
          sizeBytes: file.sizeBytes,
          checksumSha256: file.checksumSha256,
        })
        .returning({ id: mentorApplicationFiles.id })
      insertedFileIds[file.kind] = insertedFile.id

      await transaction.insert(mentorApplicationEvents).values({
        applicationId: current.id,
        eventType: 'FILE_UPLOADED',
        metadata: { kind: file.kind, fileId: insertedFile.id },
      })
    }

    const status = current.status === 'CHANGES_REQUESTED' ? 'RESUBMITTED' : 'SUBMITTED'
    const revision = current.currentRevision + 1
    const [updated] = await transaction
      .update(mentorApplications)
      .set({
        ...toApplicationValues(input.values),
        ...input.location,
        status,
        currentRevision: revision,
        submittedAt: now,
        lastSavedAt: now,
        updatedAt: now,
      })
      .where(
        and(
          eq(mentorApplications.id, current.id),
          eq(mentorApplications.currentRevision, current.currentRevision),
          inArray(mentorApplications.status, ['DRAFT', 'CHANGES_REQUESTED']),
        ),
      )
      .returning()

    if (!updated) {
      throw new MentorApplicationConflictError(
        'This application changed while it was being submitted',
      )
    }

    const legalSnapshot = input.consents.map(consent => {
      const document = legalDocuments.find(item => item.id === consent.documentId)!
      return {
        documentId: document.id,
        version: document.version,
        label: document.label,
        contentSha256: sha256Hex(document.content),
        accepted: true,
        acceptedAt: now.toISOString(),
      }
    })
    const snapshot = {
      applicationSchemaVersion: updated.applicationSchemaVersion,
      email: updated.email,
      fullName: updated.fullName,
      phone: updated.phone,
      location: {
        countryId: updated.countryId,
        country: updated.country,
        stateId: updated.stateId,
        state: updated.state,
        cityId: updated.cityId,
        city: updated.city,
      },
      title: updated.title,
      professionalHeadline: updated.professionalHeadline,
      company: updated.company,
      websiteUrl: updated.websiteUrl,
      employmentType: updated.employmentType,
      industry: updated.industry,
      industries: updated.industries,
      otherIndustry: updated.otherIndustry,
      expertise: updated.expertise,
      otherExpertise: updated.otherExpertise,
      experienceYears: updated.experienceYears,
      experienceBand: updated.experienceBand,
      requestedHourlyRate: updated.requestedHourlyRate,
      currency: updated.currency,
      availability: updated.availability,
      about: updated.about,
      challengeSolved: updated.challengeSolved,
      measurableOutcomes: updated.measurableOutcomes,
      guidanceValueProposition: updated.guidanceValueProposition,
      credibilitySignals: updated.credibilitySignals,
      linkedinUrl: updated.linkedinUrl,
      serviceInterests: updated.serviceInterests,
      preferredSessionMode: updated.preferredSessionMode,
      languages: updated.languages,
      otherLanguage: updated.otherLanguage,
      weeklyAvailabilityBand: updated.weeklyAvailabilityBand,
      files: {
        current: currentFiles.map(file => ({ id: file.id, kind: file.kind })),
        uploaded: insertedFileIds,
      },
    }

    await transaction.insert(mentorApplicationRevisions).values({
      applicationId: updated.id,
      revision,
      idempotencyKey: input.idempotencyKey,
      status,
      snapshot,
      consentSnapshot: { documents: legalSnapshot },
      submittedAt: now,
    })

    await transaction.insert(consentEvents).values(
      legalSnapshot.map(consent => ({
        mentorApplicationId: updated.id,
        userId: updated.linkedUserId,
        userEmail: updated.email,
        userRole: 'mentor_applicant',
        consentType: consent.documentId,
        consentVersion: consent.version,
        action: 'granted' as const,
        source: 'ui' as const,
        ipAddress: input.requestIp || null,
        userAgent: input.userAgent || null,
        context: {
          applicationRevision: revision,
          documentLabel: consent.label,
          documentContentSha256: consent.contentSha256,
          ipAddressHashed: Boolean(input.requestIp),
        },
      })),
    )

    await transaction.insert(mentorApplicationEvents).values({
      applicationId: updated.id,
      eventType: status === 'RESUBMITTED' ? 'RESUBMITTED' : 'SUBMITTED',
      fromStatus: current.status,
      toStatus: status,
      metadata: { revision },
    })

    return { application: updated, replayed: false }
  })
}

export async function serializeMentorApplication(
  application: MentorApplication,
): Promise<MentorApplicationResponse> {
  const files = await db
    .select()
    .from(mentorApplicationFiles)
    .where(
      and(
        eq(mentorApplicationFiles.applicationId, application.id),
        eq(mentorApplicationFiles.isCurrent, true),
      ),
    )

  const profileFile = files.find(file => file.kind === 'PROFILE_IMAGE')
  const resumeFile = files.find(file => file.kind === 'RESUME')
  const portfolioFile = files.find(file => file.kind === 'PORTFOLIO')
  const caseStudyFile = files.find(file => file.kind === 'CASE_STUDY')
  const presentationFile = files.find(file => file.kind === 'PRESENTATION')
  const awardsFile = files.find(file => file.kind === 'AWARDS_CERTIFICATIONS')
  const profileImageUrl = profileFile
    ? getMentorApplicationFileUrl(profileFile.id)
    : null
  const resumeUrl = resumeFile
    ? getMentorApplicationFileUrl(resumeFile.id)
    : null
  const fileUrl = (file: (typeof files)[number] | undefined) =>
    file ? getMentorApplicationFileUrl(file.id) : null

  return {
    id: application.id,
    status: application.status,
    email: application.email,
    fullName: application.fullName || '',
    phone: application.phone || '',
    countryId: application.countryId || '',
    stateId: application.stateId || '',
    cityId: application.cityId || '',
    professionalHeadline: application.professionalHeadline || '',
    title: application.title || '',
    company: application.company || '',
    websiteUrl: application.websiteUrl || '',
    employmentType: application.employmentType || '',
    experienceBand: application.experienceBand || '',
    industries: application.industries || [],
    otherIndustry: application.otherIndustry || '',
    expertise: application.expertise || [],
    otherExpertise: application.otherExpertise || '',
    about: application.about || '',
    challengeSolved: application.challengeSolved || '',
    measurableOutcomes: application.measurableOutcomes || '',
    guidanceValueProposition: application.guidanceValueProposition || '',
    credibilitySignals: application.credibilitySignals || [],
    linkedinUrl: application.linkedinUrl || '',
    serviceInterests: application.serviceInterests || [],
    preferredSessionMode: application.preferredSessionMode || '',
    languages: application.languages || [],
    otherLanguage: application.otherLanguage || '',
    weeklyAvailabilityBand: application.weeklyAvailabilityBand || '',
    profileImageUrl,
    resumeUrl,
    portfolioUrl: fileUrl(portfolioFile),
    caseStudyUrl: fileUrl(caseStudyFile),
    presentationUrl: fileUrl(presentationFile),
    awardsCertificationsUrl: fileUrl(awardsFile),
    verificationNotes: application.applicantVisibleNotes,
    submittedAt: application.submittedAt?.toISOString() || null,
    updatedAt: application.updatedAt.toISOString(),
  }
}
