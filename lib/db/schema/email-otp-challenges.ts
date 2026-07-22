import { relations, sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { mentorApplications } from './mentor-applications';

export const emailOtpPurposeEnum = pgEnum('email_otp_purpose', [
  'ACCOUNT_EMAIL_VERIFICATION',
  'MENTOR_APPLICATION_ACCESS',
  'MENTOR_APPLICATION_CLAIM',
]);

export const emailOtpChallenges = pgTable(
  'email_otp_challenges',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    normalizedEmail: text('normalized_email').notNull(),
    purpose: emailOtpPurposeEnum('purpose').notNull(),
    applicationId: uuid('application_id').references(() => mentorApplications.id, {
      onDelete: 'cascade',
    }),
    codeDigest: text('code_digest').notNull(),
    digestKeyId: text('digest_key_id').notNull(),
    attemptCount: integer('attempt_count').default(0).notNull(),
    maxAttempts: integer('max_attempts').default(5).notNull(),
    sendCount: integer('send_count').default(1).notNull(),
    lastSentAt: timestamp('last_sent_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    consumedAt: timestamp('consumed_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    requestIp: text('request_ip'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    emailPurposeCreatedIdx: index('email_otp_challenges_email_purpose_created_idx').on(
      table.normalizedEmail,
      table.purpose,
      table.createdAt,
    ),
    applicationIdx: index('email_otp_challenges_application_idx').on(table.applicationId),
    expiresAtIdx: index('email_otp_challenges_expires_at_idx').on(table.expiresAt),
    oneActiveChallenge: uniqueIndex('email_otp_challenges_active_email_purpose_unique')
      .on(table.normalizedEmail, table.purpose)
      .where(sql`${table.consumedAt} is null and ${table.revokedAt} is null`),
    normalizedEmailCanonicalCheck: check(
      'email_otp_challenges_normalized_email_canonical_check',
      sql`${table.normalizedEmail} = lower(btrim(${table.normalizedEmail}))
        and length(${table.normalizedEmail}) between 3 and 254`,
    ),
    attemptCountCheck: check(
      'email_otp_challenges_attempt_count_check',
      sql`${table.attemptCount} >= 0 and ${table.maxAttempts} > 0
        and ${table.attemptCount} <= ${table.maxAttempts}`,
    ),
    sendCountCheck: check(
      'email_otp_challenges_send_count_check',
      sql`${table.sendCount} > 0`,
    ),
    expiryCheck: check(
      'email_otp_challenges_expiry_check',
      sql`${table.expiresAt} > ${table.createdAt}`,
    ),
    terminalStateCheck: check(
      'email_otp_challenges_terminal_state_check',
      sql`not (${table.consumedAt} is not null and ${table.revokedAt} is not null)`,
    ),
    claimApplicationCheck: check(
      'email_otp_challenges_claim_application_check',
      sql`${table.purpose} <> 'MENTOR_APPLICATION_CLAIM'
        or ${table.applicationId} is not null`,
    ),
  }),
);

export const emailOtpChallengesRelations = relations(emailOtpChallenges, ({ one }) => ({
  application: one(mentorApplications, {
    fields: [emailOtpChallenges.applicationId],
    references: [mentorApplications.id],
  }),
}));

export type EmailOtpChallenge = typeof emailOtpChallenges.$inferSelect;
export type NewEmailOtpChallenge = typeof emailOtpChallenges.$inferInsert;
export type EmailOtpPurpose = (typeof emailOtpPurposeEnum.enumValues)[number];
