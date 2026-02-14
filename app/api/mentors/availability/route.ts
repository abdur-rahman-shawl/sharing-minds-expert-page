import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import {
    mentorAvailabilitySchedules,
    mentorWeeklyPatterns,
    mentorAvailabilityExceptions,
    mentorAvailabilityRules,
    mentors
} from '@/lib/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { z } from 'zod';
import { validateTimeBlock, validateWeeklySchedule } from '@/lib/utils/availability-validation';

// Validation schemas
const timeBlockSchema = z.object({
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    type: z.enum(['AVAILABLE', 'BREAK', 'BUFFER', 'BLOCKED']),
    maxBookings: z.number().min(1).optional(),
});

const weeklyPatternSchema = z.object({
    dayOfWeek: z.number().min(0).max(6),
    isEnabled: z.boolean(),
    timeBlocks: z.array(timeBlockSchema),
}).refine(
    (data) => {
        if (!data.isEnabled || data.timeBlocks.length === 0) return true;
        for (let i = 0; i < data.timeBlocks.length; i++) {
            const block = data.timeBlocks[i];
            // Note: Casting to any because of minor type mismatch in imported type vs zod inferred type in strict mode
            // In practice this is fine as the shapes match
            const otherBlocks = data.timeBlocks.filter((_, index) => index !== i);
            const validation = validateTimeBlock(block as any, otherBlocks as any);
            if (!validation.isValid) return false;
        }
        return true;
    },
    {
        message: "Time blocks contain overlapping periods. Each time block must have a unique, non-overlapping time range."
    }
);

const availabilityScheduleSchema = z.object({
    timezone: z.string(),
    defaultSessionDuration: z.number().min(15).max(240),
    bufferTimeBetweenSessions: z.number().min(0).max(60),
    minAdvanceBookingHours: z.number().min(0).max(168),
    maxAdvanceBookingDays: z.number().min(1).max(365),
    defaultStartTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).optional(),
    defaultEndTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).optional(),
    isActive: z.boolean(),
    allowInstantBooking: z.boolean(),
    requireConfirmation: z.boolean(),
    weeklyPatterns: z.array(weeklyPatternSchema),
});

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const sessionUserId = session?.user?.id;

        if (!sessionUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [mentor] = await db
            .select()
            .from(mentors)
            .where(eq(mentors.userId, sessionUserId))
            .limit(1);

        if (!mentor) {
            return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });
        }

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
                message: 'No availability schedule found. Please set up your availability.'
            });
        }

        const weeklyPatterns = await db
            .select()
            .from(mentorWeeklyPatterns)
            .where(eq(mentorWeeklyPatterns.scheduleId, schedule.id));

        const startDate = req.nextUrl.searchParams.get('startDate');
        const endDate = req.nextUrl.searchParams.get('endDate');

        const conditions = [eq(mentorAvailabilityExceptions.scheduleId, schedule.id)];

        if (startDate && endDate) {
            conditions.push(
                and(
                    gte(mentorAvailabilityExceptions.startDate, new Date(startDate)),
                    lte(mentorAvailabilityExceptions.endDate, new Date(endDate))
                )! // using ! to assert non-null if needed, or just push the 'and' result
            );
        }

        // Combining conditions with 'and'
        const finalWhere = conditions.length > 1 ? and(...conditions) : conditions[0];

        const exceptions = await db
            .select()
            .from(mentorAvailabilityExceptions)
            .where(finalWhere);

        const rules = await db
            .select()
            .from(mentorAvailabilityRules)
            .where(and(eq(mentorAvailabilityRules.scheduleId, schedule.id), eq(mentorAvailabilityRules.isActive, true)));

        return NextResponse.json({
            success: true,
            schedule,
            weeklyPatterns,
            exceptions,
            rules
        });

    } catch (error) {
        console.error('Get availability error:', error);
        return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const sessionUserId = session?.user?.id;

        if (!sessionUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [mentor] = await db
            .select()
            .from(mentors)
            .where(eq(mentors.userId, sessionUserId))
            .limit(1);

        if (!mentor) {
            return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });
        }

        const body = await req.json();

        let validatedData;
        try {
            validatedData = availabilityScheduleSchema.parse(body);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ error: 'Invalid availability data', details: error.errors }, { status: 400 });
            }
            throw error;
        }

        // Manual cast for compatibility with validator util
        const scheduleValidation = validateWeeklySchedule(validatedData.weeklyPatterns as any);
        if (!scheduleValidation.isValid) {
            return NextResponse.json({
                error: 'Schedule contains time conflicts',
                details: scheduleValidation.errors
            }, { status: 400 });
        }

        await db.transaction(async (tx) => {
            const [existingSchedule] = await tx
                .select()
                .from(mentorAvailabilitySchedules)
                .where(eq(mentorAvailabilitySchedules.mentorId, mentor.id))
                .limit(1);

            let scheduleId: string;

            if (existingSchedule) {
                await tx
                    .update(mentorAvailabilitySchedules)
                    .set({
                        timezone: validatedData.timezone,
                        defaultSessionDuration: validatedData.defaultSessionDuration,
                        bufferTimeBetweenSessions: validatedData.bufferTimeBetweenSessions,
                        minAdvanceBookingHours: validatedData.minAdvanceBookingHours,
                        maxAdvanceBookingDays: validatedData.maxAdvanceBookingDays,
                        defaultStartTime: validatedData.defaultStartTime,
                        defaultEndTime: validatedData.defaultEndTime,
                        isActive: validatedData.isActive,
                        allowInstantBooking: validatedData.allowInstantBooking,
                        requireConfirmation: validatedData.requireConfirmation,
                        updatedAt: new Date(),
                    })
                    .where(eq(mentorAvailabilitySchedules.id, existingSchedule.id));

                scheduleId = existingSchedule.id;

                await tx
                    .delete(mentorWeeklyPatterns)
                    .where(eq(mentorWeeklyPatterns.scheduleId, scheduleId));
            } else {
                const [newSchedule] = await tx
                    .insert(mentorAvailabilitySchedules)
                    .values({
                        mentorId: mentor.id,
                        timezone: validatedData.timezone,
                        defaultSessionDuration: validatedData.defaultSessionDuration,
                        bufferTimeBetweenSessions: validatedData.bufferTimeBetweenSessions,
                        minAdvanceBookingHours: validatedData.minAdvanceBookingHours,
                        maxAdvanceBookingDays: validatedData.maxAdvanceBookingDays,
                        defaultStartTime: validatedData.defaultStartTime,
                        defaultEndTime: validatedData.defaultEndTime,
                        isActive: validatedData.isActive,
                        allowInstantBooking: validatedData.allowInstantBooking,
                        requireConfirmation: validatedData.requireConfirmation,
                    })
                    .returning();

                scheduleId = newSchedule.id;
            }

            if (validatedData.weeklyPatterns.length > 0) {
                await tx
                    .insert(mentorWeeklyPatterns)
                    .values(
                        validatedData.weeklyPatterns.map(pattern => ({
                            scheduleId,
                            dayOfWeek: pattern.dayOfWeek,
                            isEnabled: pattern.isEnabled,
                            timeBlocks: pattern.timeBlocks as any, // Type cast to satisfy jsonb
                        }))
                    );
            }
        });

        return NextResponse.json({ success: true, message: 'Availability updated successfully' });

    } catch (error) {
        console.error('Update availability error:', error);
        return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    // Alias for PUT logic for initial creation if needed, or keeping distinct
    // The PUT logic handles upsert (insert if not exists), so we can reuse logic or call PUT.
    // For cleaner semantics, I will duplicate the transaction part for 'insert only' check if desired,
    // but the source implementation had specific 'POST for create' and 'PUT for update'.
    // Here I implemented PUT as Upsert which is often more robust for UI.
    // Let's forward to PUT or implement strict create.
    return PUT(req);
}
