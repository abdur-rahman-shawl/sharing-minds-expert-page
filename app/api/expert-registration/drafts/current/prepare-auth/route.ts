import { randomUUID } from 'node:crypto'

import { and, eq, inArray, sql } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'
import {
  mentorRegistrationDrafts,
  mentorRegistrationFiles,
  type MentorRegistrationFileKind,
} from '@/lib/db/schema'
import { isTransientDatabaseError } from '@/lib/db/retry'
import {
  ExpertRegistrationDraftError,
  serializeExpertRegistrationDraft,
} from '@/lib/expert-registration/drafts'
import { getExpertRegistrationDraftFromRequest } from '@/lib/expert-registration/draft-session'
import { isLiveExpertRegistrationEnabled } from '@/lib/expert-registration/feature'
import { legalDocuments } from '@/lib/legal-documents'
import { validateApplicationLocation } from '@/lib/mentor-applications/application'
import {
  MENTOR_APPLICATION_MULTIPART_MAX_BYTES,
} from '@/lib/mentor-applications/constants'
import {
  assertTrustedOrigin,
  MentorApplicationSecurityError,
  sha256Hex,
} from '@/lib/mentor-applications/security'
import {
  ApplicationFileValidationError,
  deleteApplicationFiles,
  uploadApplicationFile,
  type UploadedApplicationFile,
} from '@/lib/mentor-applications/storage'
import {
  mentorApplicationConsentsSchema,
  mentorApplicationDraftFieldsSchema,
} from '@/lib/validations/mentor-application'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

const NO_STORE_HEADERS = { 'Cache-Control': 'private, no-store, max-age=0' }

type PreparedUpload = UploadedApplicationFile & {
  kind: MentorRegistrationFileKind
}

function stringValue(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

function jsonValue(formData: FormData, name: string): unknown {
  try {
    return JSON.parse(stringValue(formData, name))
  } catch {
    return null
  }
}

function nonEmptyFile(value: FormDataEntryValue | null): File | null {
  return typeof File !== 'undefined' && value instanceof File && value.size > 0
    ? value
    : null
}

export async function POST(request: NextRequest) {
  const uploadedFiles: PreparedUpload[] = []
  let filesCommitted = false

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
    if (!['DRAFT', 'READY_FOR_AUTH'].includes(draft.status)) {
      throw new ExpertRegistrationDraftError(
        'This registration can no longer be prepared for sign in',
      )
    }

    const contentLength = Number(request.headers.get('content-length') || '0')
    if (
      Number.isFinite(contentLength) &&
      contentLength > MENTOR_APPLICATION_MULTIPART_MAX_BYTES + 1024 * 1024
    ) {
      return NextResponse.json(
        { success: false, error: 'The registration upload exceeds the request limit' },
        { status: 413, headers: NO_STORE_HEADERS },
      )
    }

    const formData = await request.formData()
    const parsedApplication = mentorApplicationDraftFieldsSchema.safeParse({
      fullName: stringValue(formData, 'fullName'),
      phone: stringValue(formData, 'phone'),
      countryId: stringValue(formData, 'countryId'),
      stateId: stringValue(formData, 'stateId'),
      cityId: stringValue(formData, 'cityId'),
      professionalHeadline: stringValue(formData, 'professionalHeadline'),
      title: stringValue(formData, 'title'),
      company: stringValue(formData, 'company'),
      websiteUrl: stringValue(formData, 'websiteUrl'),
      employmentType: stringValue(formData, 'employmentType'),
      experienceBand: stringValue(formData, 'experienceBand'),
      industries: jsonValue(formData, 'industries'),
      otherIndustry: stringValue(formData, 'otherIndustry'),
      expertise: jsonValue(formData, 'expertise'),
      otherExpertise: stringValue(formData, 'otherExpertise'),
      about: stringValue(formData, 'about'),
      challengeSolved: stringValue(formData, 'challengeSolved'),
      measurableOutcomes: stringValue(formData, 'measurableOutcomes'),
      guidanceValueProposition: stringValue(formData, 'guidanceValueProposition'),
      credibilitySignals: jsonValue(formData, 'credibilitySignals'),
      linkedinUrl: stringValue(formData, 'linkedinUrl'),
      serviceInterests: jsonValue(formData, 'serviceInterests'),
      preferredSessionMode: stringValue(formData, 'preferredSessionMode'),
      languages: jsonValue(formData, 'languages'),
      otherLanguage: stringValue(formData, 'otherLanguage'),
      weeklyAvailabilityBand: stringValue(formData, 'weeklyAvailabilityBand'),
    })
    if (!parsedApplication.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            parsedApplication.error.issues[0]?.message ||
            'Registration details are invalid',
          issues: parsedApplication.error.flatten(),
        },
        { status: 422, headers: NO_STORE_HEADERS },
      )
    }

    const parsedConsents = mentorApplicationConsentsSchema.safeParse(
      jsonValue(formData, 'consents'),
    )
    if (!parsedConsents.success) {
      return NextResponse.json(
        { success: false, error: 'Accept every current policy and declaration' },
        { status: 422, headers: NO_STORE_HEADERS },
      )
    }

    await validateApplicationLocation(parsedApplication.data)

    const declaredFiles = Array.from(formData.values()).filter(
      (value): value is File =>
        typeof File !== 'undefined' && value instanceof File && value.size > 0,
    )
    const totalFileBytes = declaredFiles.reduce((total, file) => total + file.size, 0)
    if (totalFileBytes > MENTOR_APPLICATION_MULTIPART_MAX_BYTES) {
      return NextResponse.json(
        { success: false, error: 'The registration upload exceeds the 31MB limit' },
        { status: 413, headers: NO_STORE_HEADERS },
      )
    }

    const uploadDefinitions: Array<{
      field: string
      kind: MentorRegistrationFileKind
    }> = [
      { field: 'profilePicture', kind: 'PROFILE_IMAGE' },
      { field: 'resume', kind: 'RESUME' },
      { field: 'portfolio', kind: 'PORTFOLIO' },
      { field: 'caseStudy', kind: 'CASE_STUDY' },
      { field: 'presentation', kind: 'PRESENTATION' },
      { field: 'awardsCertifications', kind: 'AWARDS_CERTIFICATIONS' },
    ]

    for (const definition of uploadDefinitions) {
      const file = nonEmptyFile(formData.get(definition.field))
      if (!file) continue
      uploadedFiles.push({
        kind: definition.kind,
        ...(await uploadApplicationFile({
          applicationId: `live-registration/${draft.id}`,
          kind: definition.kind,
          file,
        })),
      })
    }

    const legalSnapshot = parsedConsents.data.map(consent => {
      const document = legalDocuments.find(item => item.id === consent.documentId)!
      return {
        documentId: document.id,
        label: document.label,
        version: document.version,
        contentSha256: sha256Hex(document.content),
        accepted: true,
      }
    })

    const oldFiles = await db.transaction(async transaction => {
      await transaction.execute(
        sql`select pg_advisory_xact_lock(hashtextextended(${`expert-registration-draft:${draft.id}`}, 0))`,
      )

      const [current] = await transaction
        .select()
        .from(mentorRegistrationDrafts)
        .where(eq(mentorRegistrationDrafts.id, draft.id))
        .limit(1)
      if (!current || !['DRAFT', 'READY_FOR_AUTH'].includes(current.status)) {
        throw new ExpertRegistrationDraftError(
          'This registration changed while it was being prepared',
        )
      }

      const replacedKinds = uploadedFiles.map(file => file.kind)
      const previous = replacedKinds.length
        ? await transaction
            .select()
            .from(mentorRegistrationFiles)
            .where(
              and(
                eq(mentorRegistrationFiles.registrationDraftId, draft.id),
                eq(mentorRegistrationFiles.isCurrent, true),
                inArray(mentorRegistrationFiles.kind, replacedKinds),
              ),
            )
        : []

      if (previous.length) {
        await transaction
          .update(mentorRegistrationFiles)
          .set({ isCurrent: false, supersededAt: new Date(), updatedAt: new Date() })
          .where(inArray(mentorRegistrationFiles.id, previous.map(file => file.id)))
      }

      if (uploadedFiles.length) {
        await transaction.insert(mentorRegistrationFiles).values(
          uploadedFiles.map(file => ({
            id: randomUUID(),
            registrationDraftId: draft.id,
            kind: file.kind,
            storageBucket: file.storageBucket,
            storagePath: file.storagePath,
            originalFileName: file.originalFileName,
            mediaType: file.mediaType,
            sizeBytes: file.sizeBytes,
            checksumSha256: file.checksumSha256,
          })),
        )
      }

      const currentFiles = await transaction
        .select({ kind: mentorRegistrationFiles.kind })
        .from(mentorRegistrationFiles)
        .where(
          and(
            eq(mentorRegistrationFiles.registrationDraftId, draft.id),
            eq(mentorRegistrationFiles.isCurrent, true),
          ),
        )
      const kinds = new Set(currentFiles.map(file => file.kind))
      if (!kinds.has('PROFILE_IMAGE')) {
        throw new ExpertRegistrationDraftError('Profile photo is required', 422)
      }
      if (!kinds.has('RESUME')) {
        throw new ExpertRegistrationDraftError('Resume is required', 422)
      }

      const [updated] = await transaction
        .update(mentorRegistrationDrafts)
        .set({
          formPayload: parsedApplication.data,
          consentSnapshot: { documents: legalSnapshot },
          status: 'READY_FOR_AUTH',
          authStartedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(mentorRegistrationDrafts.id, draft.id))
        .returning()
      return { previous, updated }
    })
    filesCommitted = true

    if (oldFiles.previous.length) {
      await deleteApplicationFiles(oldFiles.previous)
    }

    return NextResponse.json(
      {
        success: true,
        draft: await serializeExpertRegistrationDraft(oldFiles.updated),
      },
      { headers: NO_STORE_HEADERS },
    )
  } catch (error) {
    if (!filesCommitted && uploadedFiles.length) {
      await deleteApplicationFiles(uploadedFiles)
    }
    if (error instanceof MentorApplicationSecurityError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403, headers: NO_STORE_HEADERS },
      )
    }
    if (error instanceof ApplicationFileValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 422, headers: NO_STORE_HEADERS },
      )
    }
    if (error instanceof ExpertRegistrationDraftError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status, headers: NO_STORE_HEADERS },
      )
    }
    if (isTransientDatabaseError(error)) {
      console.warn('[expert-registration] Registration storage is temporarily unavailable')
      return NextResponse.json(
        {
          success: false,
          error:
            'Secure registration storage is temporarily unavailable. Your form remains open; please try again.',
        },
        {
          status: 503,
          headers: { ...NO_STORE_HEADERS, 'Retry-After': '2' },
        },
      )
    }
    console.error('[expert-registration] Unable to prepare registration', error)
    return NextResponse.json(
      { success: false, error: 'Unable to prepare the registration for sign in' },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
