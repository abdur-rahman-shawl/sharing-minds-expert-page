import { randomUUID } from 'node:crypto'

import { and, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { db } from '@/lib/db'
import { mentorApplicationRevisions } from '@/lib/db/schema'
import {
  MentorApplicationConflictError,
  serializeMentorApplication,
  submitMentorApplication,
  validateApplicationLocation,
  type PendingApplicationFile,
} from '@/lib/mentor-applications/application'
import { sendMentorApplicationReceivedEmail } from '@/lib/mentor-applications/email'
import {
  isUniqueViolation,
  jsonError,
  validationError,
} from '@/lib/mentor-applications/http'
import {
  assertTrustedOrigin,
  getRequestIpHash,
  getRequestUserAgent,
  MentorApplicationSecurityError,
} from '@/lib/mentor-applications/security'
import {
  getMentorApplicationFromSession,
  MentorApplicationSessionError,
} from '@/lib/mentor-applications/session'
import {
  ApplicationFileValidationError,
  deleteApplicationFiles,
  uploadApplicationFile,
} from '@/lib/mentor-applications/storage'
import {
  mentorApplicationConsentsSchema,
  mentorApplicationDraftFieldsSchema,
} from '@/lib/validations/mentor-application'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const idempotencyKeySchema = z.string().uuid()
const MAX_DECLARED_MULTIPART_BYTES = 11 * 1024 * 1024

function stringValue(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

function nonEmptyFile(value: FormDataEntryValue | null): File | null {
  return typeof File !== 'undefined' && value instanceof File && value.size > 0
    ? value
    : null
}

export async function POST(request: NextRequest) {
  const uploadedFiles: PendingApplicationFile[] = []
  let filesCommitted = false

  try {
    assertTrustedOrigin(request)
    const current = await getMentorApplicationFromSession(request)

    const declaredContentLength = Number(request.headers.get('content-length'))
    if (
      Number.isFinite(declaredContentLength) &&
      declaredContentLength > MAX_DECLARED_MULTIPART_BYTES
    ) {
      return jsonError('The application upload exceeds the 11MB request limit', 413)
    }

    const formData = await request.formData()

    const submittedKey =
      request.headers.get('idempotency-key') || stringValue(formData, 'idempotencyKey')
    const idempotencyKey = submittedKey || randomUUID()
    const parsedIdempotencyKey = idempotencyKeySchema.safeParse(idempotencyKey)
    if (!parsedIdempotencyKey.success) {
      return jsonError('Idempotency-Key must be a UUID', 400)
    }

    const [existingRevision] = await db
      .select({ applicationId: mentorApplicationRevisions.applicationId })
      .from(mentorApplicationRevisions)
      .where(eq(mentorApplicationRevisions.idempotencyKey, idempotencyKey))
      .limit(1)
    if (existingRevision) {
      if (existingRevision.applicationId !== current.id) {
        return jsonError('Idempotency-Key is already in use', 409)
      }
      return NextResponse.json({
        success: true,
        application: await serializeMentorApplication(current),
        replayed: true,
      })
    }

    const parsedApplication = mentorApplicationDraftFieldsSchema.safeParse({
      fullName: stringValue(formData, 'fullName'),
      phone: stringValue(formData, 'phone'),
      countryId: stringValue(formData, 'countryId'),
      stateId: stringValue(formData, 'stateId'),
      cityId: stringValue(formData, 'cityId'),
      title: stringValue(formData, 'title'),
      company: stringValue(formData, 'company'),
      industry: stringValue(formData, 'industry'),
      expertise: stringValue(formData, 'expertise'),
      experience: stringValue(formData, 'experience'),
      hourlyRate: stringValue(formData, 'hourlyRate'),
      about: stringValue(formData, 'about'),
      linkedinUrl: stringValue(formData, 'linkedinUrl'),
      availability: stringValue(formData, 'availability'),
    })
    if (!parsedApplication.success) return validationError(parsedApplication.error)

    let consentPayload: unknown
    try {
      consentPayload = JSON.parse(stringValue(formData, 'consents'))
    } catch {
      return jsonError('Current legal consents are required', 422)
    }
    const parsedConsents = mentorApplicationConsentsSchema.safeParse(consentPayload)
    if (!parsedConsents.success) return validationError(parsedConsents.error)

    const location = await validateApplicationLocation(parsedApplication.data)
    const profileImage = nonEmptyFile(formData.get('profilePicture'))
    const resume = nonEmptyFile(formData.get('resume'))

    if (profileImage) {
      uploadedFiles.push({
        kind: 'PROFILE_IMAGE',
        ...(await uploadApplicationFile({
          applicationId: current.id,
          kind: 'PROFILE_IMAGE',
          file: profileImage,
        })),
      })
    }
    if (resume) {
      uploadedFiles.push({
        kind: 'RESUME',
        ...(await uploadApplicationFile({
          applicationId: current.id,
          kind: 'RESUME',
          file: resume,
        })),
      })
    }

    const result = await submitMentorApplication({
      application: current,
      values: parsedApplication.data,
      location,
      files: uploadedFiles,
      consents: parsedConsents.data,
      idempotencyKey,
      requestIp: getRequestIpHash(request),
      userAgent: getRequestUserAgent(request),
    })
    filesCommitted = !result.replayed

    if (result.replayed) {
      await deleteApplicationFiles(uploadedFiles)
    }

    if (!result.replayed) {
      try {
        await sendMentorApplicationReceivedEmail({
          email: result.application.email,
          fullName: result.application.fullName || 'Mentor',
        })
      } catch (error) {
        console.error('[mentor-applications] Confirmation email failed', error)
      }
    }

    return NextResponse.json(
      {
        success: true,
        application: await serializeMentorApplication(result.application),
        replayed: result.replayed,
      },
      { status: result.replayed ? 200 : 201 },
    )
  } catch (error) {
    if (!filesCommitted) await deleteApplicationFiles(uploadedFiles)

    if (error instanceof MentorApplicationSecurityError) {
      return jsonError(error.message, 403)
    }
    if (error instanceof MentorApplicationSessionError) {
      return jsonError(error.message, 401)
    }
    if (error instanceof ApplicationFileValidationError) {
      return jsonError(error.message, 422)
    }
    if (error instanceof MentorApplicationConflictError) {
      return jsonError(error.message, 409)
    }
    if (isUniqueViolation(error)) {
      return jsonError('The application submission conflicts with an existing request', 409)
    }
    console.error('[mentor-applications] Application submission failed', error)
    return jsonError('Unable to submit the mentor application', 500)
  }
}
