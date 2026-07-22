import 'server-only'

import { and, eq, isNull, ne, sql } from 'drizzle-orm'

import { db } from '@/lib/db'
import {
  mentorApplicationEvents,
  mentorApplicationFiles,
  mentorApplications,
  mentors,
  roles,
  userRoles,
  users,
  type MentorApplication,
} from '@/lib/db/schema'
import {
  EXPERTISE_OPTIONS,
  INDUSTRY_OPTIONS,
  LANGUAGE_OPTIONS,
  optionLabel,
} from '@/lib/mentor-application-options'

import { MentorApplicationConflictError } from './application'
import { normalizeEmail } from './security'
import { getMentorApplicationFileUrl } from './urls'

type DatabaseTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

export type PromotionResult =
  | { promoted: true; mentorId: string; alreadyPromoted: boolean }
  | {
      promoted: false
      reason:
        | 'NOT_APPROVED'
        | 'NOT_LINKED'
        | 'LINKED_USER_NOT_FOUND'
        | 'LINKED_USER_EMAIL_NOT_VERIFIED'
        | 'LINKED_USER_INACTIVE'
        | 'LINKED_USER_BLOCKED'
        | 'PROFILE_IMAGE_MISSING'
        | 'RESUME_MISSING'
        | 'EXISTING_MENTOR_REQUIRES_RECONCILIATION'
        | 'MENTOR_ROLE_NOT_CONFIGURED'
      mentorId: null
    }

export async function promoteMentorApplication(
  applicationId: string,
  transaction?: DatabaseTransaction,
): Promise<PromotionResult> {
  if (!transaction) {
    return db.transaction(tx => promoteMentorApplication(applicationId, tx))
  }

  await transaction.execute(
    sql`select pg_advisory_xact_lock(hashtextextended(${`mentor-application-promote:${applicationId}`}, 0))`,
  )

  const [application] = await transaction
    .select()
    .from(mentorApplications)
    .where(eq(mentorApplications.id, applicationId))
    .limit(1)

  if (!application) {
    throw new MentorApplicationConflictError('Mentor application was not found')
  }
  if (application.mentorId) {
    return {
      promoted: true,
      mentorId: application.mentorId,
      alreadyPromoted: true,
    }
  }
  if (application.status !== 'APPROVED') {
    return { promoted: false, reason: 'NOT_APPROVED', mentorId: null }
  }
  if (!application.linkedUserId) {
    return { promoted: false, reason: 'NOT_LINKED', mentorId: null }
  }

  await transaction.execute(
    sql`select pg_advisory_xact_lock(hashtextextended(${`mentor-user-promote:${application.linkedUserId}`}, 0))`,
  )

  // Re-read the canonical linked identity inside the promotion transaction.
  // linked_user_id, not a mutable email address, is the authority after claim.
  const [linkedUser] = await transaction
    .select({
      id: users.id,
      emailVerified: users.emailVerified,
      isActive: users.isActive,
      isBlocked: users.isBlocked,
    })
    .from(users)
    .where(eq(users.id, application.linkedUserId))
    .limit(1)
  if (!linkedUser) {
    return { promoted: false, reason: 'LINKED_USER_NOT_FOUND', mentorId: null }
  }
  if (linkedUser.emailVerified !== true) {
    return {
      promoted: false,
      reason: 'LINKED_USER_EMAIL_NOT_VERIFIED',
      mentorId: null,
    }
  }
  if (linkedUser.isActive !== true) {
    return { promoted: false, reason: 'LINKED_USER_INACTIVE', mentorId: null }
  }
  if (linkedUser.isBlocked !== false) {
    return { promoted: false, reason: 'LINKED_USER_BLOCKED', mentorId: null }
  }

  const [existingMentor] = await transaction
    .select({ id: mentors.id })
    .from(mentors)
    .where(eq(mentors.userId, application.linkedUserId))
    .limit(1)
  if (existingMentor) {
    await transaction.insert(mentorApplicationEvents).values({
      applicationId: application.id,
      actorUserId: application.linkedUserId,
      eventType: 'LINK_CONFLICT',
      metadata: { reason: 'existing-mentor-requires-reconciliation' },
    })
    return {
      promoted: false,
      reason: 'EXISTING_MENTOR_REQUIRES_RECONCILIATION',
      mentorId: null,
    }
  }

  const currentFiles = await transaction
    .select({
      id: mentorApplicationFiles.id,
      kind: mentorApplicationFiles.kind,
    })
    .from(mentorApplicationFiles)
    .where(
      and(
        eq(mentorApplicationFiles.applicationId, application.id),
        eq(mentorApplicationFiles.isCurrent, true),
      ),
    )
  const profileImage = currentFiles.find(file => file.kind === 'PROFILE_IMAGE')
  const resume = currentFiles.find(file => file.kind === 'RESUME')
  const isVersionTwoApplication = application.applicationSchemaVersion >= 2
  if (!profileImage) {
    return { promoted: false, reason: 'PROFILE_IMAGE_MISSING', mentorId: null }
  }
  if (isVersionTwoApplication && !resume) {
    return { promoted: false, reason: 'RESUME_MISSING', mentorId: null }
  }

  const [mentorRole] = await transaction
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.name, 'mentor'))
    .limit(1)
  if (!mentorRole) {
    return {
      promoted: false,
      reason: 'MENTOR_ROLE_NOT_CONFIGURED',
      mentorId: null,
    }
  }

  const promotedIndustries = (application.industries || []).map(value =>
    value === 'OTHER' && application.otherIndustry
      ? application.otherIndustry
      : optionLabel(INDUSTRY_OPTIONS, value),
  )
  const promotedExpertise = (application.expertise || []).map(value =>
    value === 'OTHER' && application.otherExpertise
      ? application.otherExpertise
      : optionLabel(EXPERTISE_OPTIONS, value),
  )
  const promotedLanguages = (application.languages || []).map(value =>
    value === 'OTHER' && application.otherLanguage
      ? application.otherLanguage
      : optionLabel(LANGUAGE_OPTIONS, value),
  )

  const [mentor] = await transaction
    .insert(mentors)
    .values({
      userId: application.linkedUserId,
      title: application.title,
      normalizedTitle: application.normalizedTitle,
      company: application.company,
      industry: application.industry,
      industries: promotedIndustries,
      normalizedIndustry: application.normalizedIndustry,
      expertise: JSON.stringify(promotedExpertise),
      experience: isVersionTwoApplication ? null : application.experienceYears,
      experienceBand: application.experienceBand,
      employmentType: application.employmentType,
      hourlyRate: isVersionTwoApplication ? null : application.requestedHourlyRate,
      currency: application.currency,
      availability:
        !isVersionTwoApplication && application.availability
          ? JSON.stringify(application.availability)
          : null,
      weeklyAvailabilityBand: application.weeklyAvailabilityBand,
      preferredSessionMode: application.preferredSessionMode,
      serviceInterests: application.serviceInterests || [],
      languages: promotedLanguages,
      headline: application.professionalHeadline || application.title,
      about: application.about,
      challengeSolved: application.challengeSolved,
      measurableOutcomes: application.measurableOutcomes,
      guidanceValueProposition: application.guidanceValueProposition,
      credibilitySignals: application.credibilitySignals || [],
      hasPriorMentoringExperience: application.hasPriorMentoringExperience,
      linkedinUrl: application.linkedinUrl,
      websiteUrl: application.websiteUrl,
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      city: application.city,
      state: application.state,
      country: application.country,
      // These stable application endpoints mint short-lived private-storage
      // URLs after authorization. Resumes are never converted to public objects.
      profileImageUrl: getMentorApplicationFileUrl(profileImage.id),
      resumeUrl: resume ? getMentorApplicationFileUrl(resume.id) : null,
      isVerified: true,
      verificationStatus: 'VERIFIED',
      verificationNotes: application.applicantVisibleNotes,
      isAvailable: true,
      paymentStatus: 'PENDING',
      isCouponCodeEnabled: false,
      isExpert: false,
      searchMode: 'AI_SEARCH',
      creationSource: 'SELF_REGISTERED',
    })
    .returning({ id: mentors.id })

  await transaction
    .insert(userRoles)
    .values({
      userId: application.linkedUserId,
      roleId: mentorRole.id,
      assignedBy: application.reviewedBy,
    })
    .onConflictDoNothing()

  const now = new Date()
  const [promotedApplication] = await transaction
    .update(mentorApplications)
    .set({ mentorId: mentor.id, promotedAt: now, updatedAt: now })
    .where(
      and(
        eq(mentorApplications.id, application.id),
        isNull(mentorApplications.mentorId),
      ),
    )
    .returning({ id: mentorApplications.id })
  if (!promotedApplication) {
    throw new MentorApplicationConflictError('Application was promoted concurrently')
  }

  await transaction.insert(mentorApplicationEvents).values({
    applicationId: application.id,
    actorUserId: application.reviewedBy,
    eventType: 'PROMOTED',
    fromStatus: application.status,
    toStatus: application.status,
    metadata: { mentorId: mentor.id },
  })

  return { promoted: true, mentorId: mentor.id, alreadyPromoted: false }
}

export async function claimMentorApplicationForVerifiedUser(input: {
  userId: string
}): Promise<{
  application: MentorApplication | null
  linked: boolean
  promotion: PromotionResult | null
}> {
  const result = await db.transaction(async transaction => {
    const [claimingUser] = await transaction
      .select({
        id: users.id,
        email: users.email,
        emailVerified: users.emailVerified,
        isActive: users.isActive,
        isBlocked: users.isBlocked,
      })
      .from(users)
      .where(eq(users.id, input.userId))
      .limit(1)

    if (
      !claimingUser ||
      claimingUser.emailVerified !== true ||
      claimingUser.isActive !== true ||
      claimingUser.isBlocked !== false
    ) {
      throw new MentorApplicationConflictError(
        'A verified, active, unblocked account is required to claim an application',
      )
    }

    const normalizedEmail = normalizeEmail(claimingUser.email)
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`mentor-application-claim:${normalizedEmail}`}, 0))`,
    )

    const [application] = await transaction
      .select()
      .from(mentorApplications)
      .where(eq(mentorApplications.normalizedEmail, normalizedEmail))
      .limit(1)

    if (!application) {
      return {
        conflictMessage: null,
        application: null,
        linked: false,
        promotion: null,
      }
    }
    if (application.linkedUserId && application.linkedUserId !== input.userId) {
      await transaction.insert(mentorApplicationEvents).values({
        applicationId: application.id,
        actorUserId: input.userId,
        eventType: 'LINK_CONFLICT',
        metadata: { reason: 'application-linked-to-another-account' },
      })
      return {
        conflictMessage: 'This application is already linked to another account',
        application: null,
        linked: false,
        promotion: null,
      }
    }

    let linkedApplication = application
    let linked = false
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
            reason: 'account-linked-to-another-application',
            conflictingApplicationId: otherApplication.id,
          },
        })
        return {
          conflictMessage:
            'This account is already linked to another mentor application',
          application: null,
          linked: false,
          promotion: null,
        }
      }

      const now = new Date()
      const [updated] = await transaction
        .update(mentorApplications)
        .set({ linkedUserId: input.userId, linkedAt: now, updatedAt: now })
        .where(
          and(
            eq(mentorApplications.id, application.id),
            isNull(mentorApplications.linkedUserId),
          ),
        )
        .returning()
      if (!updated) {
        await transaction.insert(mentorApplicationEvents).values({
          applicationId: application.id,
          actorUserId: input.userId,
          eventType: 'LINK_CONFLICT',
          metadata: { reason: 'application-link-changed-during-claim' },
        })
        return {
          conflictMessage: 'Application link changed while it was being claimed',
          application: null,
          linked: false,
          promotion: null,
        }
      }
      linkedApplication = updated
      linked = true

      await transaction.insert(mentorApplicationEvents).values({
        applicationId: application.id,
        actorUserId: input.userId,
        eventType: 'LINKED',
        metadata: { method: 'verified-email-exact-match' },
      })
    }

    const promotion = await promoteMentorApplication(application.id, transaction)
    return {
      conflictMessage: null,
      application: linkedApplication,
      linked,
      promotion,
    }
  })

  // Conflict events are committed before surfacing the domain error. Throwing
  // inside the transaction would roll back the very audit record we need.
  if (result.conflictMessage) {
    throw new MentorApplicationConflictError(result.conflictMessage)
  }

  return {
    application: result.application,
    linked: result.linked,
    promotion: result.promotion,
  }
}
