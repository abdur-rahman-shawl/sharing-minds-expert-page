import { relations, sql } from 'drizzle-orm'
import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { campaignVisits } from './campaign-visits'
import { mentorApplications } from './mentor-applications'
import { mentors } from './mentors'
import {
  mentorRegistrationAuthMethodEnum,
  mentorRegistrationDraftStatusEnum,
} from './mentor-registration-enums'
import { users } from './users'

export const mentorRegistrationDrafts = pgTable(
  'mentor_registration_drafts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    accessTokenDigest: text('access_token_digest').notNull(),
    status: mentorRegistrationDraftStatusEnum('status').default('DRAFT').notNull(),
    schemaVersion: integer('schema_version').default(3).notNull(),
    formPayload: jsonb('form_payload').$type<Record<string, unknown>>().default({}).notNull(),
    consentSnapshot: jsonb('consent_snapshot').$type<Record<string, unknown> | null>(),
    attributionVisitId: uuid('attribution_visit_id').references(
      () => campaignVisits.id,
      { onDelete: 'set null' },
    ),
    attributionCapturedAt: timestamp('attribution_captured_at', {
      withTimezone: true,
    }),
    legacyApplicationId: uuid('legacy_application_id').references(
      () => mentorApplications.id,
      { onDelete: 'set null' },
    ),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    mentorId: uuid('mentor_id').references(() => mentors.id, { onDelete: 'set null' }),
    authMethod: mentorRegistrationAuthMethodEnum('auth_method'),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    authStartedAt: timestamp('auth_started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    accessTokenDigestUnique: uniqueIndex(
      'mentor_registration_drafts_access_token_digest_unique',
    ).on(table.accessTokenDigest),
    mentorUnique: uniqueIndex('mentor_registration_drafts_mentor_unique').on(
      table.mentorId,
    ).where(sql`${table.mentorId} is not null`),
    statusExpiryIdx: index('mentor_registration_drafts_status_expiry_idx').on(
      table.status,
      table.expiresAt,
    ),
    userCreatedIdx: index('mentor_registration_drafts_user_created_idx').on(
      table.userId,
      table.createdAt.desc(),
    ),
    attributionIdx: index('mentor_registration_drafts_attribution_idx').on(
      table.attributionVisitId,
    ).where(sql`${table.attributionVisitId} is not null`),
    schemaVersionCheck: check(
      'mentor_registration_drafts_schema_version_check',
      sql`${table.schemaVersion} > 0`,
    ),
    completionCheck: check(
      'mentor_registration_drafts_completion_check',
      sql`(${table.status} = 'COMPLETED' and ${table.userId} is not null
        and ${table.mentorId} is not null and ${table.completedAt} is not null)
        or ${table.status} <> 'COMPLETED'`,
    ),
    attributionTimestampCheck: check(
      'mentor_registration_drafts_attribution_timestamp_check',
      sql`${table.attributionVisitId} is null
        or ${table.attributionCapturedAt} is not null`,
    ),
  }),
)

export const mentorRegistrationDraftsRelations = relations(
  mentorRegistrationDrafts,
  ({ one }) => ({
    attributionVisit: one(campaignVisits, {
      fields: [mentorRegistrationDrafts.attributionVisitId],
      references: [campaignVisits.id],
    }),
    legacyApplication: one(mentorApplications, {
      fields: [mentorRegistrationDrafts.legacyApplicationId],
      references: [mentorApplications.id],
    }),
    user: one(users, {
      fields: [mentorRegistrationDrafts.userId],
      references: [users.id],
    }),
    mentor: one(mentors, {
      fields: [mentorRegistrationDrafts.mentorId],
      references: [mentors.id],
    }),
  }),
)

export type MentorRegistrationDraft = typeof mentorRegistrationDrafts.$inferSelect
export type NewMentorRegistrationDraft = typeof mentorRegistrationDrafts.$inferInsert
