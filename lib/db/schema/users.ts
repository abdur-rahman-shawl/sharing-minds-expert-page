import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  name: text('name'),
  image: text('image'),
  googleId: text('google_id').unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  bio: text('bio'),
  timezone: text('timezone').default('UTC'),
  isActive: boolean('is_active').default(true),
  isBlocked: boolean('is_blocked').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
