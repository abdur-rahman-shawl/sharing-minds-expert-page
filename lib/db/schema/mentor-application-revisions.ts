import { relations, sql } from 'drizzle-orm';
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
} from 'drizzle-orm/pg-core';
import {
  mentorApplications,
  mentorApplicationStatusEnum,
} from './mentor-applications';

export const mentorApplicationRevisions = pgTable(
  'mentor_application_revisions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    applicationId: uuid('application_id')
      .references(() => mentorApplications.id, { onDelete: 'cascade' })
      .notNull(),
    revision: integer('revision').notNull(),
    idempotencyKey: text('idempotency_key').notNull(),
    status: mentorApplicationStatusEnum('status').notNull(),
    snapshot: jsonb('snapshot').$type<Record<string, unknown>>().notNull(),
    consentSnapshot: jsonb('consent_snapshot').$type<Record<string, unknown>>().notNull(),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    applicationRevisionUnique: uniqueIndex(
      'mentor_application_revisions_application_revision_unique',
    ).on(table.applicationId, table.revision),
    idempotencyKeyUnique: uniqueIndex(
      'mentor_application_revisions_idempotency_key_unique',
    ).on(table.idempotencyKey),
    applicationSubmittedIdx: index(
      'mentor_application_revisions_application_submitted_idx',
    ).on(table.applicationId, table.submittedAt),
    revisionCheck: check(
      'mentor_application_revisions_revision_check',
      sql`${table.revision} > 0`,
    ),
    snapshotJsonCheck: check(
      'mentor_application_revisions_snapshot_json_check',
      sql`jsonb_typeof(${table.snapshot}) = 'object'`,
    ),
    consentSnapshotJsonCheck: check(
      'mentor_application_revisions_consent_snapshot_json_check',
      sql`jsonb_typeof(${table.consentSnapshot}) = 'object'`,
    ),
    submissionStatusCheck: check(
      'mentor_application_revisions_submission_status_check',
      sql`${table.status} in ('SUBMITTED', 'RESUBMITTED')`,
    ),
  }),
);

export const mentorApplicationRevisionsRelations = relations(
  mentorApplicationRevisions,
  ({ one }) => ({
    application: one(mentorApplications, {
      fields: [mentorApplicationRevisions.applicationId],
      references: [mentorApplications.id],
    }),
  }),
);

export type MentorApplicationRevision = typeof mentorApplicationRevisions.$inferSelect;
export type NewMentorApplicationRevision = typeof mentorApplicationRevisions.$inferInsert;
