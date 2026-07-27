import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  check,
  decimal,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { mentors } from './mentors';
import { users } from './users';
import { campaignVisits } from './campaign-visits';

export const mentorApplicationStatusEnum = pgEnum('mentor_application_status', [
  'DRAFT',
  'SUBMITTED',
  'IN_REVIEW',
  'CHANGES_REQUESTED',
  'RESUBMITTED',
  'APPROVED',
  'REJECTED',
  'WITHDRAWN',
]);

export const mentorApplicationSourceEnum = pgEnum('mentor_application_source', [
  'GUEST',
  'AUTHENTICATED',
  'MIGRATED',
]);

export interface MentorApplicationAvailability {
  version: number;
  cadence: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'AS_NEEDED';
}

export const mentorApplications = pgTable(
  'mentor_applications',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    // Identity is immutable after email verification. normalizedEmail is always
    // trim + lowercase; provider-specific alias rewriting is intentionally avoided.
    email: text('email').notNull(),
    normalizedEmail: text('normalized_email').notNull(),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }).notNull(),
    linkedUserId: text('linked_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    mentorId: uuid('mentor_id').references(() => mentors.id, {
      onDelete: 'set null',
    }),
    source: mentorApplicationSourceEnum('source').default('GUEST').notNull(),
    status: mentorApplicationStatusEnum('status').default('DRAFT').notNull(),
    attributionVisitId: uuid('attribution_visit_id').references(
      () => campaignVisits.id,
      { onDelete: 'restrict' },
    ),
    attributionCapturedAt: timestamp('attribution_captured_at', {
      withTimezone: true,
    }),

    // Applicant-provided profile snapshot. Fields remain nullable while the
    // application is a draft; submission validation is enforced by the service.
    fullName: text('full_name'),
    phone: text('phone'),
    countryId: text('country_id'),
    country: text('country'),
    stateId: text('state_id'),
    state: text('state'),
    cityId: text('city_id'),
    city: text('city'),
    professionalHeadline: text('professional_headline'),
    title: text('title'),
    normalizedTitle: text('normalized_title'),
    company: text('company'),
    websiteUrl: text('website_url'),
    employmentType: text('employment_type'),
    industry: text('industry'),
    normalizedIndustry: text('normalized_industry'),
    industries: jsonb('industries').$type<string[]>(),
    otherIndustry: text('other_industry'),
    expertise: jsonb('expertise').$type<string[]>(),
    otherExpertise: text('other_expertise'),
    experienceYears: integer('experience_years'),
    experienceBand: text('experience_band'),
    requestedHourlyRate: decimal('requested_hourly_rate', {
      precision: 10,
      scale: 2,
    }),
    currency: text('currency').default('USD').notNull(),
    availability: jsonb('availability').$type<MentorApplicationAvailability>(),
    about: text('about'),
    challengeSolved: text('challenge_solved'),
    measurableOutcomes: text('measurable_outcomes'),
    guidanceValueProposition: text('guidance_value_proposition'),
    credibilitySignals: jsonb('credibility_signals').$type<string[]>(),
    serviceInterests: jsonb('service_interests').$type<string[]>(),
    preferredSessionMode: text('preferred_session_mode'),
    languages: jsonb('languages').$type<string[]>(),
    otherLanguage: text('other_language'),
    weeklyAvailabilityBand: text('weekly_availability_band'),
    hasPriorMentoringExperience: boolean('has_prior_mentoring_experience'),
    hasProfessionalMisconduct: boolean('has_professional_misconduct'),
    misconductExplanation: text('misconduct_explanation'),
    linkedinUrl: text('linkedin_url'),

    applicationSchemaVersion: integer('application_schema_version').default(1).notNull(),
    currentRevision: integer('current_revision').default(0).notNull(),
    submittedAt: timestamp('submitted_at', { withTimezone: true }),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    decidedAt: timestamp('decided_at', { withTimezone: true }),
    linkedAt: timestamp('linked_at', { withTimezone: true }),
    promotedAt: timestamp('promoted_at', { withTimezone: true }),
    applicantVisibleNotes: text('applicant_visible_notes'),
    internalReviewNotes: text('internal_review_notes'),
    reviewedBy: text('reviewed_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    lastSavedAt: timestamp('last_saved_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    normalizedEmailUnique: uniqueIndex('mentor_applications_normalized_email_unique').on(
      table.normalizedEmail,
    ),
    linkedUserUnique: uniqueIndex('mentor_applications_linked_user_unique').on(
      table.linkedUserId,
    ),
    promotedMentorUnique: uniqueIndex('mentor_applications_mentor_unique').on(table.mentorId),
    reviewQueueIdx: index('mentor_applications_review_queue_idx').on(
      table.status,
      table.submittedAt,
    ),
    promotionQueueIdx: index('mentor_applications_promotion_queue_idx').on(
      table.status,
      table.linkedUserId,
      table.promotedAt,
    ),
    attributionVisitIdx: index('mentor_applications_attribution_visit_idx').on(
      table.attributionVisitId,
    ),
    normalizedEmailCanonicalCheck: check(
      'mentor_applications_normalized_email_canonical_check',
      sql`${table.normalizedEmail} = lower(btrim(${table.email}))
        and length(${table.normalizedEmail}) between 3 and 254`,
    ),
    emailNotBlankCheck: check(
      'mentor_applications_email_not_blank_check',
      sql`length(btrim(${table.email})) between 3 and 254`,
    ),
    experienceRangeCheck: check(
      'mentor_applications_experience_range_check',
      sql`${table.experienceYears} is null or ${table.experienceYears} between 0 and 80`,
    ),
    requestedHourlyRateCheck: check(
      'mentor_applications_requested_hourly_rate_check',
      sql`${table.requestedHourlyRate} is null or ${table.requestedHourlyRate} > 0`,
    ),
    schemaVersionCheck: check(
      'mentor_applications_schema_version_check',
      sql`${table.applicationSchemaVersion} > 0`,
    ),
    revisionCheck: check(
      'mentor_applications_revision_check',
      sql`${table.currentRevision} >= 0`,
    ),
    expertiseJsonCheck: check(
      'mentor_applications_expertise_json_check',
      sql`${table.expertise} is null or jsonb_typeof(${table.expertise}) = 'array'`,
    ),
    industriesJsonCheck: check(
      'mentor_applications_industries_json_check',
      sql`${table.industries} is null or jsonb_typeof(${table.industries}) = 'array'`,
    ),
    credibilitySignalsJsonCheck: check(
      'mentor_applications_credibility_signals_json_check',
      sql`${table.credibilitySignals} is null
        or jsonb_typeof(${table.credibilitySignals}) = 'array'`,
    ),
    serviceInterestsJsonCheck: check(
      'mentor_applications_service_interests_json_check',
      sql`${table.serviceInterests} is null
        or jsonb_typeof(${table.serviceInterests}) = 'array'`,
    ),
    languagesJsonCheck: check(
      'mentor_applications_languages_json_check',
      sql`${table.languages} is null or jsonb_typeof(${table.languages}) = 'array'`,
    ),
    availabilityJsonCheck: check(
      'mentor_applications_availability_json_check',
      sql`${table.availability} is null or jsonb_typeof(${table.availability}) = 'object'`,
    ),
    currencyCheck: check(
      'mentor_applications_currency_check',
      sql`${table.currency} ~ '^[A-Z]{3}$'`,
    ),
    linkTimestampCheck: check(
      'mentor_applications_link_timestamp_check',
      sql`${table.linkedUserId} is null or ${table.linkedAt} is not null`,
    ),
    promotionTimestampCheck: check(
      'mentor_applications_promotion_timestamp_check',
      sql`${table.mentorId} is null or ${table.promotedAt} is not null`,
    ),
    attributionTimestampCheck: check(
      'mentor_applications_attribution_timestamp_check',
      sql`${table.attributionVisitId} is null
        or ${table.attributionCapturedAt} is not null`,
    ),
  }),
);

export const mentorApplicationsRelations = relations(mentorApplications, ({ one }) => ({
  linkedUser: one(users, {
    fields: [mentorApplications.linkedUserId],
    references: [users.id],
    relationName: 'mentorApplicationLinkedUser',
  }),
  reviewer: one(users, {
    fields: [mentorApplications.reviewedBy],
    references: [users.id],
    relationName: 'mentorApplicationReviewer',
  }),
  mentor: one(mentors, {
    fields: [mentorApplications.mentorId],
    references: [mentors.id],
  }),
  attributionVisit: one(campaignVisits, {
    fields: [mentorApplications.attributionVisitId],
    references: [campaignVisits.id],
  }),
}));

export type MentorApplication = typeof mentorApplications.$inferSelect;
export type NewMentorApplication = typeof mentorApplications.$inferInsert;
export type MentorApplicationStatus =
  (typeof mentorApplicationStatusEnum.enumValues)[number];
export type MentorApplicationSource =
  (typeof mentorApplicationSourceEnum.enumValues)[number];
