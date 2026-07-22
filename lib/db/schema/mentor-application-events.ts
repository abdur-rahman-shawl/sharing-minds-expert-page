import { relations, sql } from 'drizzle-orm';
import {
  check,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import {
  mentorApplications,
  mentorApplicationStatusEnum,
} from './mentor-applications';
import { users } from './users';

export const mentorApplicationEventTypeEnum = pgEnum('mentor_application_event_type', [
  'CREATED',
  'EMAIL_VERIFIED',
  'DRAFT_SAVED',
  'FILE_UPLOADED',
  'FILE_SCAN_UPDATED',
  'SUBMITTED',
  'REVIEW_STARTED',
  'CHANGES_REQUESTED',
  'RESUBMITTED',
  'APPROVED',
  'REJECTED',
  'WITHDRAWN',
  'LINKED',
  'LINK_CONFLICT',
  'PROMOTED',
]);

export const mentorApplicationEvents = pgTable(
  'mentor_application_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    applicationId: uuid('application_id')
      .references(() => mentorApplications.id, { onDelete: 'cascade' })
      .notNull(),
    actorUserId: text('actor_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    eventType: mentorApplicationEventTypeEnum('event_type').notNull(),
    fromStatus: mentorApplicationStatusEnum('from_status'),
    toStatus: mentorApplicationStatusEnum('to_status'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    applicationCreatedIdx: index('mentor_application_events_application_created_idx').on(
      table.applicationId,
      table.createdAt,
    ),
    typeCreatedIdx: index('mentor_application_events_type_created_idx').on(
      table.eventType,
      table.createdAt,
    ),
    actorCreatedIdx: index('mentor_application_events_actor_created_idx').on(
      table.actorUserId,
      table.createdAt,
    ),
    metadataJsonCheck: check(
      'mentor_application_events_metadata_json_check',
      sql`jsonb_typeof(${table.metadata}) = 'object'`,
    ),
  }),
);

export const mentorApplicationEventsRelations = relations(
  mentorApplicationEvents,
  ({ one }) => ({
    application: one(mentorApplications, {
      fields: [mentorApplicationEvents.applicationId],
      references: [mentorApplications.id],
    }),
    actor: one(users, {
      fields: [mentorApplicationEvents.actorUserId],
      references: [users.id],
    }),
  }),
);

export type MentorApplicationEvent = typeof mentorApplicationEvents.$inferSelect;
export type NewMentorApplicationEvent = typeof mentorApplicationEvents.$inferInsert;
export type MentorApplicationEventType =
  (typeof mentorApplicationEventTypeEnum.enumValues)[number];
