import 'server-only'

import { and, eq, isNull, sql } from 'drizzle-orm'

import { db } from '@/lib/db'
import {
  betterAuthAccounts,
  consentEvents,
  mentorApplications,
  mentorRegistrationDrafts,
  mentorRegistrationFiles,
  mentors,
  mentorsProfileAudit,
  roles,
  userRoles,
  users,
  type MentorRegistrationAuthMethod,
  type MentorRegistrationDraft,
} from '@/lib/db/schema'
import {
  EXPERTISE_OPTIONS,
  INDUSTRY_OPTIONS,
  LANGUAGE_OPTIONS,
  optionLabel,
} from '@/lib/mentor-application-options'
import { applicationConsentDocuments } from '@/lib/legal-documents'
import { validateApplicationLocation } from '@/lib/mentor-applications/application'
import {
  getRequestIpHash,
  getRequestUserAgent,
  normalizeEmail,
  sha256Hex,
} from '@/lib/mentor-applications/security'
import { normalizeMentorSearchValue } from '@/lib/mentor-onboarding'
import { mentorApplicationDraftFieldsSchema } from '@/lib/validations/mentor-application'

import {
  LIVE_EXPERT_REGISTRATION_SCHEMA_VERSION,
  LIVE_EXPERT_REGISTRATION_SOURCE,
} from './constants'
import { ExpertRegistrationDraftError } from './drafts'
import {
  getExistingMentorFinalizationOutcome,
  type ExpertRegistrationFinalizationOutcome,
} from './lifecycle'
import { getExpertRegistrationFileUrl } from './urls'
import type { AuthenticatedApplicationUser } from '@/lib/mentor-applications/auth'
import type { NextRequest } from 'next/server'

const AUTH_PROVIDER_IDS: Partial<Record<MentorRegistrationAuthMethod, string>> = {
  GOOGLE: 'google',
  LINKEDIN: 'linkedin',
  EMAIL_PASSWORD: 'credential',
}

function consentDocuments(snapshot: Record<string, unknown> | null) {
  if (!snapshot || !Array.isArray(snapshot.documents)) return null
  const documents = snapshot.documents.filter(
    (value): value is Record<string, unknown> =>
      Boolean(value) && typeof value === 'object' && !Array.isArray(value),
  )
  if (documents.length !== applicationConsentDocuments.length) return null

  for (const current of applicationConsentDocuments) {
    const accepted = documents.find(
      document =>
        document.documentId === current.id &&
        document.version === current.version &&
        document.accepted === true &&
        document.contentSha256 === sha256Hex(current.content),
    )
    if (!accepted) return null
  }
  return documents
}

function serializeMentorStatus(mentor: typeof mentors.$inferSelect) {
  return {
    id: mentor.id,
    registeredAt: mentor.registrationSubmittedAt?.toISOString() ||
      mentor.createdAt.toISOString(),
    verificationStatus: mentor.verificationStatus,
    verificationNotes: mentor.verificationNotes,
    fullName: mentor.fullName || '',
    email: mentor.email || '',
    isVerified: mentor.isVerified,
    isExpert: mentor.isExpert,
    paymentStatus: mentor.paymentStatus,
    searchMode: mentor.searchMode,
    creationSource: mentor.creationSource,
  }
}

export async function finalizeExpertRegistration(input: {
  request: NextRequest
  draft: MentorRegistrationDraft
  user: AuthenticatedApplicationUser
  authMethod: MentorRegistrationAuthMethod
}) {
  const parsedPayload = mentorApplicationDraftFieldsSchema.safeParse(
    input.draft.formPayload,
  )
  if (!parsedPayload.success) {
    throw new ExpertRegistrationDraftError(
      parsedPayload.error.issues[0]?.message ||
        'The registration details are incomplete',
      422,
    )
  }
  const acceptedConsents = consentDocuments(input.draft.consentSnapshot)
  if (!acceptedConsents) {
    throw new ExpertRegistrationDraftError(
      'The current policies and declaration must be accepted again',
      422,
    )
  }

  const location = await validateApplicationLocation(parsedPayload.data)
  const expectedProvider = AUTH_PROVIDER_IDS[input.authMethod]
  if (expectedProvider) {
    const [account] = await db
      .select({ id: betterAuthAccounts.id })
      .from(betterAuthAccounts)
      .where(
        and(
          eq(betterAuthAccounts.userId, input.user.id),
          eq(betterAuthAccounts.providerId, expectedProvider),
        ),
      )
      .limit(1)
    if (!account) {
      throw new ExpertRegistrationDraftError(
        'The selected sign-in method could not be confirmed',
        403,
      )
    }
  }

  const result = await db.transaction(async transaction => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`expert-registration-draft:${input.draft.id}`}, 0))`,
    )
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`expert-registration-user:${input.user.id}`}, 0))`,
    )

    const [draft] = await transaction
      .select()
      .from(mentorRegistrationDrafts)
      .where(eq(mentorRegistrationDrafts.id, input.draft.id))
      .limit(1)
    if (!draft || draft.expiresAt <= new Date()) {
      throw new ExpertRegistrationDraftError(
        'This registration draft has expired. Please start again.',
        410,
      )
    }

    if (draft.status === 'COMPLETED' && draft.mentorId) {
      if (draft.userId !== input.user.id) {
        throw new ExpertRegistrationDraftError(
          'This registration belongs to another account',
          403,
        )
      }
      const [completedMentor] = await transaction
        .select()
        .from(mentors)
        .where(eq(mentors.id, draft.mentorId))
        .limit(1)
      if (!completedMentor) {
        throw new ExpertRegistrationDraftError(
          'The completed mentor registration requires reconciliation',
        )
      }
      return {
        mentor: completedMentor,
        outcome: 'REPLAYED' as ExpertRegistrationFinalizationOutcome,
      }
    }

    if (draft.updatedAt.getTime() !== input.draft.updatedAt.getTime()) {
      throw new ExpertRegistrationDraftError(
        'Your registration changed while sign in was completing. Please submit it again.',
        409,
      )
    }

    if (!['READY_FOR_AUTH', 'AUTHENTICATED', 'FINALIZING'].includes(draft.status)) {
      throw new ExpertRegistrationDraftError(
        'Complete the form before signing in',
        422,
      )
    }
    if (draft.userId && draft.userId !== input.user.id) {
      throw new ExpertRegistrationDraftError(
        'This registration is already connected to another account',
        403,
      )
    }

    const [existingMentor] = await transaction
      .select()
      .from(mentors)
      .where(eq(mentors.userId, input.user.id))
      .limit(1)
    if (existingMentor) {
      const existingMentorOutcome = getExistingMentorFinalizationOutcome({
        existingRegistrationDraftId: existingMentor.registrationDraftId,
        currentDraftId: draft.id,
      })
      if (existingMentorOutcome === 'REPLAYED') {
        const now = new Date()
        await transaction
          .update(mentorRegistrationDrafts)
          .set({
            status: 'COMPLETED',
            userId: input.user.id,
            mentorId: existingMentor.id,
            authMethod: input.authMethod,
            completedAt: draft.completedAt || now,
            updatedAt: now,
          })
          .where(eq(mentorRegistrationDrafts.id, draft.id))
        return {
          mentor: existingMentor,
          outcome: 'REPLAYED' as ExpertRegistrationFinalizationOutcome,
        }
      }
      return {
        mentor: existingMentor,
        outcome: existingMentorOutcome,
      }
    }

    const currentFiles = await transaction
      .select()
      .from(mentorRegistrationFiles)
      .where(
        and(
          eq(mentorRegistrationFiles.registrationDraftId, draft.id),
          eq(mentorRegistrationFiles.isCurrent, true),
        ),
      )
    const profileImage = currentFiles.find(file => file.kind === 'PROFILE_IMAGE')
    const resume = currentFiles.find(file => file.kind === 'RESUME')
    if (!profileImage || !resume) {
      throw new ExpertRegistrationDraftError(
        'Profile photo and resume are required',
        422,
      )
    }

    const [mentorRole] = await transaction
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.name, 'mentor'))
      .limit(1)
    if (!mentorRole) {
      throw new ExpertRegistrationDraftError(
        'The mentor role is not configured',
        503,
      )
    }

    const normalizedEmail = normalizeEmail(input.user.email)
    const [legacyApplication] = await transaction
      .select({ id: mentorApplications.id })
      .from(mentorApplications)
      .where(eq(mentorApplications.normalizedEmail, normalizedEmail))
      .limit(1)

    const values = parsedPayload.data
    const industries = values.industries.map(value =>
      value === 'OTHER' && values.otherIndustry
        ? values.otherIndustry
        : optionLabel(INDUSTRY_OPTIONS, value),
    )
    const expertise = values.expertise.map(value =>
      value === 'OTHER' && values.otherExpertise
        ? values.otherExpertise
        : optionLabel(EXPERTISE_OPTIONS, value),
    )
    const languages = values.languages.map(value =>
      value === 'OTHER' && values.otherLanguage
        ? values.otherLanguage
        : optionLabel(LANGUAGE_OPTIONS, value),
    )
    const primaryIndustry = industries[0] || null
    const now = new Date()

    const [mentor] = await transaction
      .insert(mentors)
      .values({
        userId: input.user.id,
        title: values.title,
        normalizedTitle: normalizeMentorSearchValue(values.title),
        company: values.company,
        industry: primaryIndustry,
        industries,
        normalizedIndustry: primaryIndustry
          ? normalizeMentorSearchValue(primaryIndustry)
          : null,
        expertise: JSON.stringify(expertise),
        experience: null,
        experienceBand: values.experienceBand,
        employmentType: values.employmentType,
        hourlyRate: null,
        currency: 'USD',
        availability: null,
        weeklyAvailabilityBand: values.weeklyAvailabilityBand,
        preferredSessionMode: values.preferredSessionMode,
        serviceInterests: values.serviceInterests,
        languages,
        headline: values.professionalHeadline,
        about: values.about,
        challengeSolved: values.challengeSolved,
        measurableOutcomes: values.measurableOutcomes,
        guidanceValueProposition: values.guidanceValueProposition,
        credibilitySignals: values.credibilitySignals,
        linkedinUrl: values.linkedinUrl,
        websiteUrl: values.websiteUrl || null,
        fullName: values.fullName,
        email: input.user.email,
        phone: values.phone,
        countryId: values.countryId,
        country: location.country,
        stateId: values.stateId,
        state: location.state,
        cityId: values.cityId,
        city: location.city,
        otherIndustry: values.otherIndustry || null,
        otherExpertise: values.otherExpertise || null,
        otherLanguage: values.otherLanguage || null,
        profileImageUrl: getExpertRegistrationFileUrl(profileImage.id),
        resumeUrl: getExpertRegistrationFileUrl(resume.id),
        registrationSource: LIVE_EXPERT_REGISTRATION_SOURCE,
        registrationAuthMethod: input.authMethod,
        registrationSchemaVersion: LIVE_EXPERT_REGISTRATION_SCHEMA_VERSION,
        registrationDraftId: draft.id,
        registrationSubmittedAt: now,
        attributionVisitId: draft.attributionVisitId,
        attributionCapturedAt: draft.attributionVisitId
          ? draft.attributionCapturedAt || now
          : null,
        isVerified: false,
        verificationStatus: 'IN_PROGRESS',
        isAvailable: true,
        paymentStatus: 'PENDING',
        isCouponCodeEnabled: false,
        isExpert: false,
        searchMode: 'AI_SEARCH',
        creationSource: 'SELF_REGISTERED',
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    await transaction
      .insert(userRoles)
      .values({
        userId: input.user.id,
        roleId: mentorRole.id,
        assignedBy: input.user.id,
      })
      .onConflictDoNothing()

    await transaction
      .update(users)
      .set({ phone: values.phone, updatedAt: now })
      .where(and(eq(users.id, input.user.id), isNull(users.phone)))

    await transaction
      .update(mentorRegistrationFiles)
      .set({ mentorId: mentor.id, updatedAt: now })
      .where(
        and(
          eq(mentorRegistrationFiles.registrationDraftId, draft.id),
          eq(mentorRegistrationFiles.isCurrent, true),
        ),
      )

    await transaction.insert(consentEvents).values(
      acceptedConsents.map(consent => ({
        mentorId: mentor.id,
        userId: input.user.id,
        userEmail: input.user.email,
        userRole: 'mentor_applicant',
        consentType: String(consent.documentId),
        consentVersion: String(consent.version),
        action: 'granted' as const,
        source: 'ui' as const,
        ipAddress: getRequestIpHash(input.request),
        userAgent: getRequestUserAgent(input.request),
        context: {
          registrationSource: LIVE_EXPERT_REGISTRATION_SOURCE,
          registrationSchemaVersion: LIVE_EXPERT_REGISTRATION_SCHEMA_VERSION,
          registrationDraftId: draft.id,
          documentLabel: consent.label,
          documentContentSha256: consent.contentSha256,
        },
      })),
    )

    await transaction.insert(mentorsProfileAudit).values({
      mentorId: mentor.id,
      userId: input.user.id,
      previousData: {},
      updatedData: {
        action: 'LIVE_EXPERT_REGISTRATION_CREATED',
        registrationDraftId: draft.id,
        registrationSource: LIVE_EXPERT_REGISTRATION_SOURCE,
        registrationSchemaVersion: LIVE_EXPERT_REGISTRATION_SCHEMA_VERSION,
      },
      changedAt: now,
    })

    await transaction
      .update(mentorRegistrationDrafts)
      .set({
        status: 'COMPLETED',
        userId: input.user.id,
        mentorId: mentor.id,
        authMethod: input.authMethod,
        legacyApplicationId: legacyApplication?.id || null,
        completedAt: now,
        updatedAt: now,
      })
      .where(eq(mentorRegistrationDrafts.id, draft.id))

    return {
      mentor,
      outcome: 'CREATED' as ExpertRegistrationFinalizationOutcome,
    }
  })

  return {
    mentor: serializeMentorStatus(result.mentor),
    outcome: result.outcome,
  }
}
