import { relations, sql } from 'drizzle-orm';
import {
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
    title: text('title'),
    normalizedTitle: text('normalized_title'),
    company: text('company'),
    industry: text('industry'),
    normalizedIndustry: text('normalized_industry'),
    expertise: jsonb('expertise').$type<string[]>(),
    experienceYears: integer('experience_years'),
    requestedHourlyRate: decimal('requested_hourly_rate', {
      precision: 10,
      scale: 2,
    }),
    currency: text('currency').default('USD').notNull(),
    availability: jsonb('availability').$type<MentorApplicationAvailability>(),
    about: text('about'),
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
}));

export type MentorApplication = typeof mentorApplications.$inferSelect;
export type NewMentorApplication = typeof mentorApplications.$inferInsert;
export type MentorApplicationStatus =
  (typeof mentorApplicationStatusEnum.enumValues)[number];
export type MentorApplicationSource =
  (typeof mentorApplicationSourceEnum.enumValues)[number];
