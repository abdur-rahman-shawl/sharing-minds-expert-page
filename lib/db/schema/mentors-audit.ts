import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { mentors } from './mentors';

export const mentorsProfileAudit = pgTable('mentors_profile_audit', {
    id: uuid('id').defaultRandom().primaryKey(),
    mentorId: uuid('mentor_id').references(() => mentors.id, { onDelete: 'cascade' }).notNull(),
    previousData: jsonb('previous_data'),
    updatedData: jsonb('updated_data'),
    changedBy: text('changed_by').notNull(),
    changedAt: timestamp('changed_at').defaultNow().notNull(),
});

export type MentorsProfileAudit = typeof mentorsProfileAudit.$inferSelect;
export type NewMentorsProfileAudit = typeof mentorsProfileAudit.$inferInsert;
