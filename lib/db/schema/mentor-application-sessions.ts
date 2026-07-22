import { relations, sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { mentorApplications } from './mentor-applications';

export const mentorApplicationSessions = pgTable(
  'mentor_application_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    applicationId: uuid('application_id')
      .references(() => mentorApplications.id, { onDelete: 'cascade' })
      .notNull(),
    tokenDigest: text('token_digest').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }).defaultNow().notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    requestIp: text('request_ip'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    tokenDigestUnique: uniqueIndex('mentor_application_sessions_token_digest_unique').on(
      table.tokenDigest,
    ),
    applicationExpiresIdx: index('mentor_application_sessions_application_expires_idx').on(
      table.applicationId,
      table.expiresAt,
    ),
    expiresAtIdx: index('mentor_application_sessions_expires_at_idx').on(table.expiresAt),
    expiryCheck: check(
      'mentor_application_sessions_expiry_check',
      sql`${table.expiresAt} > ${table.createdAt}`,
    ),
  }),
);

export const mentorApplicationSessionsRelations = relations(
  mentorApplicationSessions,
  ({ one }) => ({
    application: one(mentorApplications, {
      fields: [mentorApplicationSessions.applicationId],
      references: [mentorApplications.id],
    }),
  }),
);

export type MentorApplicationSession = typeof mentorApplicationSessions.$inferSelect;
export type NewMentorApplicationSession = typeof mentorApplicationSessions.$inferInsert;
