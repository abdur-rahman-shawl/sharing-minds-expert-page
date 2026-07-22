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
  normalizeMentorSearchValue,
  parseExpertiseList,
} from '@/lib/mentor-onboarding'
import { supabaseAdmin } from '@/lib/supabase'
import type {
  MentorApplicationConsentInput,
  MentorApplicationDraftInput,
  MentorApplicationPatchInput,
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
  title: string
  company: string
  industry: string
  expertise: string
  experience: number | null
  hourlyRate: string
  about: string
  linkedinUrl: string
  availability: MentorApplicationDraftInput['availability'] | ''
  profileImageUrl: string | null
  resumeUrl: string | null
  verificationNotes: string | null
  submittedAt: string | null
  updatedAt: string
}

async function upsertVerifiedApplication(input: {
  transaction: DatabaseTransaction
  email: string
  source: MentorApplicationSource
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
      lastSavedAt: now,
    })
    .returning()

  await input.transaction.insert(mentorApplicationEvents).values([
    {
      applicationId: application.id,
      eventType: 'CREATED',
      metadata: { source: input.source },
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
  requestIp?: string | null
  userAgent?: string | null
}) {
  return verifyEmailOtp({
    challengeId: input.challengeId,
    code: input.code,
    purpose: 'MENTOR_APPLICATION_ACCESS',
    onVerified: async (transaction, verification) => {
      const { application } = await upsertVerifiedApplication({
        transaction,
        email: verification.normalizedEmail,
        source: 'GUEST',
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
  requestIp?: string | null
  userAgent?: string | null
}) {
  const result = await db.transaction(async transaction => {
    const { application: initialApplication } = await upsertVerifiedApplication({
      transaction,
      email: input.email,
      source: 'AUTHENTICATED',
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

  return {
    ...(input.fullName === undefined ? {} : { fullName: input.fullName }),
    ...(normalizedPhone === undefined ? {} : { phone: normalizedPhone }),
    ...(input.countryId === undefined ? {} : { countryId: input.countryId }),
    ...(input.stateId === undefined ? {} : { stateId: input.stateId }),
    ...(input.cityId === undefined ? {} : { cityId: input.cityId }),
    ...(input.title === undefined
      ? {}
      : {
          title: input.title,
          normalizedTitle: normalizeMentorSearchValue(input.title),
        }),
    ...(input.company === undefined ? {} : { company: input.company }),
    ...(input.industry === undefined
      ? {}
      : {
          industry: input.industry,
          normalizedIndustry: normalizeMentorSearchValue(input.industry),
        }),
    ...(input.expertise === undefined
      ? {}
      : { expertise: parseExpertiseList(input.expertise) }),
    ...(input.experience === undefined
      ? {}
      : { experienceYears: input.experience === '' ? null : Number(input.experience) }),
    ...(input.hourlyRate === undefined
      ? {}
      : {
          requestedHourlyRate:
            input.hourlyRate === '' ||
            !Number.isFinite(Number(input.hourlyRate)) ||
            Number(input.hourlyRate) <= 0
              ? null
              : Number(input.hourlyRate).toFixed(2),
        }),
    ...(input.about === undefined ? {} : { about: input.about || null }),
    ...(input.linkedinUrl === undefined ? {} : { linkedinUrl: input.linkedinUrl }),
    ...(input.availability === undefined
      ? {}
      : {
          availability:
            input.availability === ''
              ? null
              : ({ version: 1, cadence: input.availability } as const),
        }),
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
  kind: 'PROFILE_IMAGE' | 'RESUME'
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
      company: updated.company,
      industry: updated.industry,
      expertise: updated.expertise,
      experienceYears: updated.experienceYears,
      requestedHourlyRate: updated.requestedHourlyRate,
      currency: updated.currency,
      availability: updated.availability,
      about: updated.about,
      linkedinUrl: updated.linkedinUrl,
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
  const profileImageUrl = profileFile
    ? getMentorApplicationFileUrl(profileFile.id)
    : null
  const resumeUrl = resumeFile
    ? getMentorApplicationFileUrl(resumeFile.id)
    : null

  return {
    id: application.id,
    status: application.status,
    email: application.email,
    fullName: application.fullName || '',
    phone: application.phone || '',
    countryId: application.countryId || '',
    stateId: application.stateId || '',
    cityId: application.cityId || '',
    title: application.title || '',
    company: application.company || '',
    industry: application.industry || '',
    expertise: application.expertise?.join(', ') || '',
    experience: application.experienceYears,
    hourlyRate: application.requestedHourlyRate || '',
    about: application.about || '',
    linkedinUrl: application.linkedinUrl || '',
    availability: application.availability?.cadence || '',
    profileImageUrl,
    resumeUrl,
    verificationNotes: application.applicantVisibleNotes,
    submittedAt: application.submittedAt?.toISOString() || null,
    updatedAt: application.updatedAt.toISOString(),
  }
}
