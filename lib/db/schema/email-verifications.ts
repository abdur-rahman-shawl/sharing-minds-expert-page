import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

/**
 * @deprecated Historical plaintext OTP storage. No runtime flow may read or write this table.
 * It remains declared only so the existing database object is not accidentally dropped before
 * the post-rollout retention window and explicit cleanup migration.
 */
export const emailVerifications = pgTable('email_verifications', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull().unique(),
    code: integer('code').notNull(),
    expiresAt: timestamp('expires_at', {withTimezone: true}).notNull(),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull()
});
