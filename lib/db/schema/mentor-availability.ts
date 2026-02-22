import {
    pgTable,
    pgEnum,
    uuid,
    text,
    integer,
    boolean,
    timestamp,
    jsonb,
    time,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { mentors } from './mentors';

// ── Enums ──

export const recurrencePatternEnum = pgEnum('recurrence_pattern', [
    'WEEKLY',
    'BIWEEKLY',
    'MONTHLY',
    'CUSTOM',
]);

export const availabilityTypeEnum = pgEnum('availability_type', [
    'AVAILABLE',
    'BREAK',
    'BUFFER',
    'BLOCKED',
]);

// ── Tables ──

export const mentorAvailabilitySchedules = pgTable('mentor_availability_schedules', {
    id: uuid('id').primaryKey().defaultRandom(),
    mentorId: uuid('mentor_id')
        .references(() => mentors.id, { onDelete: 'cascade' })
        .notNull()
        .unique(),

    // Global settings
    timezone: text('timezone').notNull().default('UTC'),
    defaultSessionDuration: integer('default_session_duration').notNull().default(60),
    bufferTimeBetweenSessions: integer('buffer_time').notNull().default(15),

    // Booking constraints
    minAdvanceBookingHours: integer('min_advance_booking_hours').notNull().default(24),
    maxAdvanceBookingDays: integer('max_advance_booking_days').notNull().default(90),

    // Business hours defaults
    defaultStartTime: time('default_start_time').default('09:00:00'),
    defaultEndTime: time('default_end_time').default('17:00:00'),

    // Flags
    isActive: boolean('is_active').notNull().default(true),
    allowInstantBooking: boolean('allow_instant_booking').notNull().default(true),
    requireConfirmation: boolean('require_confirmation').notNull().default(false),

    // Metadata
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const mentorWeeklyPatterns = pgTable('mentor_weekly_patterns', {
    id: uuid('id').primaryKey().defaultRandom(),
    scheduleId: uuid('schedule_id')
        .references(() => mentorAvailabilitySchedules.id, { onDelete: 'cascade' })
        .notNull(),

    dayOfWeek: integer('day_of_week').notNull(), // 0=Sun … 6=Sat
    isEnabled: boolean('is_enabled').notNull().default(true),

    timeBlocks: jsonb('time_blocks').notNull().default('[]'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const mentorAvailabilityExceptions = pgTable('mentor_availability_exceptions', {
    id: uuid('id').primaryKey().defaultRandom(),
    scheduleId: uuid('schedule_id')
        .references(() => mentorAvailabilitySchedules.id, { onDelete: 'cascade' })
        .notNull(),

    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),

    type: availabilityTypeEnum('type').notNull().default('BLOCKED'),
    reason: text('reason'),
    isFullDay: boolean('is_full_day').notNull().default(true),

    timeBlocks: jsonb('time_blocks'), // Same structure as weekly patterns; null if full day

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const availabilityTemplates = pgTable('availability_templates', {
    id: uuid('id').primaryKey().defaultRandom(),
    mentorId: uuid('mentor_id')
        .references(() => mentors.id, { onDelete: 'cascade' }), // nullable for global templates

    name: text('name').notNull(),
    description: text('description'),
    isGlobal: boolean('is_global').notNull().default(false),

    configuration: jsonb('configuration').notNull(),

    usageCount: integer('usage_count').notNull().default(0),
    lastUsedAt: timestamp('last_used_at'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const mentorAvailabilityRules = pgTable('mentor_availability_rules', {
    id: uuid('id').primaryKey().defaultRandom(),
    scheduleId: uuid('schedule_id')
        .references(() => mentorAvailabilitySchedules.id, { onDelete: 'cascade' })
        .notNull(),

    name: text('name').notNull(),
    description: text('description'),

    conditions: jsonb('conditions').notNull(),
    actions: jsonb('actions').notNull(),

    priority: integer('priority').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Relations ──

export const mentorAvailabilitySchedulesRelations = relations(
    mentorAvailabilitySchedules,
    ({ one, many }) => ({
        mentor: one(mentors, {
            fields: [mentorAvailabilitySchedules.mentorId],
            references: [mentors.id],
        }),
        weeklyPatterns: many(mentorWeeklyPatterns),
        exceptions: many(mentorAvailabilityExceptions),
        rules: many(mentorAvailabilityRules),
    })
);

export const mentorWeeklyPatternsRelations = relations(
    mentorWeeklyPatterns,
    ({ one }) => ({
        schedule: one(mentorAvailabilitySchedules, {
            fields: [mentorWeeklyPatterns.scheduleId],
            references: [mentorAvailabilitySchedules.id],
        }),
    })
);

export const mentorAvailabilityExceptionsRelations = relations(
    mentorAvailabilityExceptions,
    ({ one }) => ({
        schedule: one(mentorAvailabilitySchedules, {
            fields: [mentorAvailabilityExceptions.scheduleId],
            references: [mentorAvailabilitySchedules.id],
        }),
    })
);

export const availabilityTemplatesRelations = relations(
    availabilityTemplates,
    ({ one }) => ({
        mentor: one(mentors, {
            fields: [availabilityTemplates.mentorId],
            references: [mentors.id],
        }),
    })
);

export const mentorAvailabilityRulesRelations = relations(
    mentorAvailabilityRules,
    ({ one }) => ({
        schedule: one(mentorAvailabilitySchedules, {
            fields: [mentorAvailabilityRules.scheduleId],
            references: [mentorAvailabilitySchedules.id],
        }),
    })
);

// ── Type Exports ──

export type MentorAvailabilitySchedule = typeof mentorAvailabilitySchedules.$inferSelect;
export type NewMentorAvailabilitySchedule = typeof mentorAvailabilitySchedules.$inferInsert;
export type MentorWeeklyPattern = typeof mentorWeeklyPatterns.$inferSelect;
export type NewMentorWeeklyPattern = typeof mentorWeeklyPatterns.$inferInsert;
export type MentorAvailabilityException = typeof mentorAvailabilityExceptions.$inferSelect;
export type NewMentorAvailabilityException = typeof mentorAvailabilityExceptions.$inferInsert;
export type AvailabilityTemplate = typeof availabilityTemplates.$inferSelect;
export type NewAvailabilityTemplate = typeof availabilityTemplates.$inferInsert;
export type MentorAvailabilityRule = typeof mentorAvailabilityRules.$inferSelect;
export type NewMentorAvailabilityRule = typeof mentorAvailabilityRules.$inferInsert;

export interface TimeBlock {
    startTime: string; // "HH:MM"
    endTime: string;   // "HH:MM"
    type: 'AVAILABLE' | 'BREAK' | 'BUFFER' | 'BLOCKED';
    maxBookings?: number;
}

export interface TemplateConfiguration {
    timezone: string;
    defaultSessionDuration: number;
    bufferTime: number;
    minAdvanceBookingHours?: number;
    maxAdvanceBookingDays?: number;
    allowInstantBooking?: boolean;
    requireConfirmation?: boolean;
    weeklyPatterns: {
        dayOfWeek: number;
        isEnabled: boolean;
        timeBlocks: TimeBlock[];
    }[];
}
