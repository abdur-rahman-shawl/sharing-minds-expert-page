import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const mentees = pgTable('mentees', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  currentRole: text('current_role'),
  currentCompany: text('current_company'),
  education: text('education'),
  careerGoals: text('career_goals'),
  interests: text('interests'),
  skillsToLearn: text('skills_to_learn'),
  currentSkills: text('current_skills'),
  learningStyle: text('learning_style'),
  preferredMeetingFrequency: text('preferred_meeting_frequency'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const menteesRelations = relations(mentees, ({ one }) => ({
  user: one(users, {
    fields: [mentees.userId],
    references: [users.id],
  }),
}));

export type Mentee = typeof mentees.$inferSelect;
export type NewMentee = typeof mentees.$inferInsert;
