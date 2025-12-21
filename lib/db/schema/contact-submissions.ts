import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core'

export const contactSubmissions = pgTable('contact_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  consent: boolean('consent').notNull().default(false),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  isResolved: boolean('is_resolved').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type ContactSubmission = typeof contactSubmissions.$inferSelect
export type NewContactSubmission = typeof contactSubmissions.$inferInsert
