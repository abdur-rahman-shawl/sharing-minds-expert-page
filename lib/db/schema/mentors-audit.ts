import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { mentors } from './mentors'
import { users } from './users'

export const mentorsProfileAudit = pgTable('mentors_profile_audit', {
  id: uuid('id').defaultRandom().primaryKey(),
  mentorId: uuid('mentor_id')
    .references(() => mentors.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  previousData: jsonb('previous_data').notNull(),
  updatedData: jsonb('updated_data').notNull(),
  changedAt: timestamp('changed_at', { withTimezone: true }).defaultNow().notNull(),
})

export type MentorsProfileAudit = typeof mentorsProfileAudit.$inferSelect
export type NewMentorsProfileAudit = typeof mentorsProfileAudit.$inferInsert
