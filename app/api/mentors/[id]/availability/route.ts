import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import {
    mentors,
    mentorAvailabilitySchedules,
    mentorWeeklyPatterns,
    mentorAvailabilityExceptions,
    mentorAvailabilityRules,
} from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { validateTimeBlock, validateWeeklySchedule } from '@/lib/utils/availability-validation';

export const dynamic = 'force-dynamic';

// ── Zod Schemas ──

const timeBlockSchema = z.object({
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    type: z.enum(['AVAILABLE', 'BREAK', 'BUFFER', 'BLOCKED']),
    maxBookings: z.number().min(1).optional(),
});

const weeklyPatternSchema = z
    .object({
        dayOfWeek: z.number().min(0).max(6),
        isEnabled: z.boolean(),
        timeBlocks: z.array(timeBlockSchema),
    })
    .refine(
        (data) => {
            if (!data.isEnabled || data.timeBlocks.length === 0) return true;
            for (let i = 0; i < data.timeBlocks.length; i++) {
                const block = data.timeBlocks[i];
                const otherBlocks = data.timeBlocks.filter((_, index) => index !== i);
                const validation = validateTimeBlock(block, otherBlocks);
                if (!validation.isValid) return false;
            }
            return true;
        },
        { message: 'Time blocks contain overlapping periods.' }
    );

const availabilityScheduleSchema = z.object({
    timezone: z.string(),
    defaultSessionDuration: z.number().min(15).max(240),
    bufferTimeBetweenSessions: z.number().min(0).max(60),
    minAdvanceBookingHours: z.number().min(0).max(168),
    maxAdvanceBookingDays: z.number().min(1).max(365),
    defaultStartTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .optional(),
    defaultEndTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .optional(),
    isActive: z.boolean(),
    allowInstantBooking: z.boolean(),
    requireConfirmation: z.boolean(),
    weeklyPatterns: z.array(weeklyPatternSchema),
});

// ── Helper: look up mentor by userId ──

async function getMentorByUserId(userId: string) {
    const [mentor] = await db
        .select({ id: mentors.id, userId: mentors.userId })
        .from(mentors)
        .where(eq(mentors.userId, userId))
        .limit(1);
    return mentor ?? null;
}

// ── GET ──

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Look up mentor
        const mentor = await getMentorByUserId(id);
        if (!mentor) {
            return NextResponse.json(
                { success: false, error: 'Mentor not found' },
                { status: 404 }
            );
        }

        // Fetch schedule
        const [schedule] = await db
            .select()
            .from(mentorAvailabilitySchedules)
            .where(eq(mentorAvailabilitySchedules.mentorId, mentor.id))
            .limit(1);

        if (!schedule) {
            return NextResponse.json({
                success: true,
                schedule: null,
                weeklyPatterns: [],
                exceptions: [],
                rules: [],
            });
        }

        // Fetch related data
        const patterns = await db
            .select()
            .from(mentorWeeklyPatterns)
            .where(eq(mentorWeeklyPatterns.scheduleId, schedule.id));

        // Optional date-range filter for exceptions
        const url = new URL(request.url);
        const startDate = url.searchParams.get('startDate');
        const endDate = url.searchParams.get('endDate');

        let exceptions;
        if (startDate && endDate) {
            const { gte, lte } = await import('drizzle-orm');
            exceptions = await db
                .select()
                .from(mentorAvailabilityExceptions)
                .where(
                    and(
                        eq(mentorAvailabilityExceptions.scheduleId, schedule.id),
                        gte(mentorAvailabilityExceptions.startDate, new Date(startDate)),
                        lte(mentorAvailabilityExceptions.endDate, new Date(endDate))
                    )
                );
        } else {
            exceptions = await db
                .select()
                .from(mentorAvailabilityExceptions)
                .where(eq(mentorAvailabilityExceptions.scheduleId, schedule.id));
        }

        const rules = await db
            .select()
            .from(mentorAvailabilityRules)
            .where(
                and(
                    eq(mentorAvailabilityRules.scheduleId, schedule.id),
                    eq(mentorAvailabilityRules.isActive, true)
                )
            );

        return NextResponse.json({
            success: true,
            schedule,
            weeklyPatterns: patterns,
            exceptions,
            rules,
        });
    } catch (error) {
        console.error('Error fetching availability:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// ── POST ──

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.user?.id || session.user.id !== id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const mentor = await getMentorByUserId(id);
        if (!mentor) {
            return NextResponse.json(
                { success: false, error: 'Mentor not found' },
                { status: 404 }
            );
        }

        // Check if schedule already exists
        const [existing] = await db
            .select({ id: mentorAvailabilitySchedules.id })
            .from(mentorAvailabilitySchedules)
            .where(eq(mentorAvailabilitySchedules.mentorId, mentor.id))
            .limit(1);

        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Availability schedule already exists. Use PUT to update.' },
                { status: 409 }
            );
        }

        // Parse & validate body
        const body = await request.json();
        const parsed = availabilityScheduleSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const data = parsed.data;

        // Validate weekly schedule
        const scheduleValidation = validateWeeklySchedule(data.weeklyPatterns);
        if (!scheduleValidation.isValid) {
            return NextResponse.json(
                { success: false, error: 'Schedule validation failed', details: scheduleValidation.errors },
                { status: 400 }
            );
        }

        // Transaction: insert schedule + weekly patterns
        const { weeklyPatterns: patterns, ...scheduleData } = data;

        const [newSchedule] = await db
            .insert(mentorAvailabilitySchedules)
            .values({
                mentorId: mentor.id,
                timezone: scheduleData.timezone,
                defaultSessionDuration: scheduleData.defaultSessionDuration,
                bufferTimeBetweenSessions: scheduleData.bufferTimeBetweenSessions,
                minAdvanceBookingHours: scheduleData.minAdvanceBookingHours,
                maxAdvanceBookingDays: scheduleData.maxAdvanceBookingDays,
                defaultStartTime: scheduleData.defaultStartTime,
                defaultEndTime: scheduleData.defaultEndTime,
                isActive: scheduleData.isActive,
                allowInstantBooking: scheduleData.allowInstantBooking,
                requireConfirmation: scheduleData.requireConfirmation,
            })
            .returning();

        if (patterns.length > 0) {
            await db.insert(mentorWeeklyPatterns).values(
                patterns.map((p) => ({
                    scheduleId: newSchedule.id,
                    dayOfWeek: p.dayOfWeek,
                    isEnabled: p.isEnabled,
                    timeBlocks: JSON.stringify(p.timeBlocks),
                }))
            );
        }

        return NextResponse.json({
            success: true,
            schedule: newSchedule,
            message: 'Availability schedule created successfully',
        });
    } catch (error) {
        console.error('Error creating availability:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// ── PUT ──

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.user?.id || session.user.id !== id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const mentor = await getMentorByUserId(id);
        if (!mentor) {
            return NextResponse.json(
                { success: false, error: 'Mentor not found' },
                { status: 404 }
            );
        }

        // Parse & validate body
        const body = await request.json();
        const parsed = availabilityScheduleSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const data = parsed.data;

        // Validate weekly schedule
        const scheduleValidation = validateWeeklySchedule(data.weeklyPatterns);
        if (!scheduleValidation.isValid) {
            return NextResponse.json(
                { success: false, error: 'Schedule validation failed', details: scheduleValidation.errors },
                { status: 400 }
            );
        }

        const { weeklyPatterns: patterns, ...scheduleData } = data;

        // Check for existing schedule
        const [existingSchedule] = await db
            .select({ id: mentorAvailabilitySchedules.id })
            .from(mentorAvailabilitySchedules)
            .where(eq(mentorAvailabilitySchedules.mentorId, mentor.id))
            .limit(1);

        let scheduleId: string;

        if (existingSchedule) {
            // Update existing
            await db
                .update(mentorAvailabilitySchedules)
                .set({
                    timezone: scheduleData.timezone,
                    defaultSessionDuration: scheduleData.defaultSessionDuration,
                    bufferTimeBetweenSessions: scheduleData.bufferTimeBetweenSessions,
                    minAdvanceBookingHours: scheduleData.minAdvanceBookingHours,
                    maxAdvanceBookingDays: scheduleData.maxAdvanceBookingDays,
                    defaultStartTime: scheduleData.defaultStartTime,
                    defaultEndTime: scheduleData.defaultEndTime,
                    isActive: scheduleData.isActive,
                    allowInstantBooking: scheduleData.allowInstantBooking,
                    requireConfirmation: scheduleData.requireConfirmation,
                    updatedAt: new Date(),
                })
                .where(eq(mentorAvailabilitySchedules.id, existingSchedule.id));

            scheduleId = existingSchedule.id;

            // Delete old patterns and re-insert
            await db
                .delete(mentorWeeklyPatterns)
                .where(eq(mentorWeeklyPatterns.scheduleId, scheduleId));
        } else {
            // Create new schedule
            const [newSchedule] = await db
                .insert(mentorAvailabilitySchedules)
                .values({
                    mentorId: mentor.id,
                    timezone: scheduleData.timezone,
                    defaultSessionDuration: scheduleData.defaultSessionDuration,
                    bufferTimeBetweenSessions: scheduleData.bufferTimeBetweenSessions,
                    minAdvanceBookingHours: scheduleData.minAdvanceBookingHours,
                    maxAdvanceBookingDays: scheduleData.maxAdvanceBookingDays,
                    defaultStartTime: scheduleData.defaultStartTime,
                    defaultEndTime: scheduleData.defaultEndTime,
                    isActive: scheduleData.isActive,
                    allowInstantBooking: scheduleData.allowInstantBooking,
                    requireConfirmation: scheduleData.requireConfirmation,
                })
                .returning();

            scheduleId = newSchedule.id;
        }

        // Insert new weekly patterns
        if (patterns.length > 0) {
            await db.insert(mentorWeeklyPatterns).values(
                patterns.map((p) => ({
                    scheduleId,
                    dayOfWeek: p.dayOfWeek,
                    isEnabled: p.isEnabled,
                    timeBlocks: JSON.stringify(p.timeBlocks),
                }))
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Availability updated successfully',
        });
    } catch (error) {
        console.error('Error updating availability:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
