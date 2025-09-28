import { pgTable, text, timestamp, boolean, integer, decimal, pgEnum, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const verificationStatusEnum = pgEnum('verification_status', [
  'YET_TO_APPLY',
  'IN_PROGRESS',
  'VERIFIED',
  'REJECTED',
  'REVERIFICATION',
]);

export const mentors = pgTable('mentors', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  title: text('title'),
  company: text('company'),
  industry: text('industry'),
  expertise: text('expertise'),
  experience: integer('experience_years'),
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }),
  currency: text('currency').default('USD'),
  availability: text('availability'),
  maxMentees: integer('max_mentees').default(10),
  headline: text('headline'),
  about: text('about'),
  linkedinUrl: text('linkedin_url'),
  githubUrl: text('github_url'),
  websiteUrl: text('website_url'),
  fullName: text('full_name'),
  email: text('email'),
  phone: text('phone'),
  city: text('city'),
  state: text('state'),
  country: text('country'),
  profileImageUrl: text('profile_image_url'),
  resumeUrl: text('resume_url'),
  verificationStatus: verificationStatusEnum('verification_status').default('YET_TO_APPLY').notNull(),
  verificationNotes: text('verification_notes'),
  isAvailable: boolean('is_available').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const mentorsRelations = relations(mentors, ({ one }) => ({
  user: one(users, {
    fields: [mentors.userId],
    references: [users.id],
  }),
}));

export type Mentor = typeof mentors.$inferSelect;
export type NewMentor = typeof mentors.$inferInsert;
export type VerificationStatus = typeof verificationStatusEnum.enumValues[number];
