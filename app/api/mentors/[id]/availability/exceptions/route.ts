import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import {
    mentors,
    mentorAvailabilitySchedules,
    mentorAvailabilityExceptions,
} from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// ── Zod Schemas ──

const exceptionSchema = z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    type: z.enum(['AVAILABLE', 'BREAK', 'BUFFER', 'BLOCKED']).default('BLOCKED'),
    reason: z.string().optional(),
    isFullDay: z.boolean().default(true),
    timeBlocks: z
        .array(
            z.object({
                startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
                endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
                type: z.enum(['AVAILABLE', 'BREAK', 'BUFFER', 'BLOCKED']),
            })
        )
        .optional(),
});

const deleteSchema = z.object({
    exceptionIds: z.array(z.string().uuid()),
});

// ── Helper ──

async function getMentorAndSchedule(userId: string) {
    const [mentor] = await db
        .select({ id: mentors.id, userId: mentors.userId })
        .from(mentors)
        .where(eq(mentors.userId, userId))
        .limit(1);

    if (!mentor) return { mentor: null, schedule: null };

    const [schedule] = await db
        .select()
        .from(mentorAvailabilitySchedules)
        .where(eq(mentorAvailabilitySchedules.mentorId, mentor.id))
        .limit(1);

    return { mentor, schedule: schedule ?? null };
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

        const { mentor, schedule } = await getMentorAndSchedule(id);
        if (!mentor) {
            return NextResponse.json(
                { success: false, error: 'Mentor not found' },
                { status: 404 }
            );
        }
        if (!schedule) {
            return NextResponse.json({ success: true, exceptions: [] });
        }

        // Optional date-range filter
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

        return NextResponse.json({ success: true, exceptions });
    } catch (error) {
        console.error('Error fetching exceptions:', error);
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

        const { mentor, schedule } = await getMentorAndSchedule(id);
        if (!mentor) {
            return NextResponse.json(
                { success: false, error: 'Mentor not found' },
                { status: 404 }
            );
        }
        if (!schedule) {
            return NextResponse.json(
                { success: false, error: 'No availability schedule found. Create one first.' },
                { status: 400 }
            );
        }

        // Parse & validate body
        const body = await request.json();
        const parsed = exceptionSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const data = parsed.data;
        const newStart = new Date(data.startDate);
        const newEnd = new Date(data.endDate);

        // Validate date order
        if (newEnd <= newStart) {
            return NextResponse.json(
                { success: false, error: 'End date must be after start date' },
                { status: 400 }
            );
        }

        // Check for overlapping exceptions
        const existingExceptions = await db
            .select()
            .from(mentorAvailabilityExceptions)
            .where(eq(mentorAvailabilityExceptions.scheduleId, schedule.id));

        for (const existing of existingExceptions) {
            const existStart = new Date(existing.startDate);
            const existEnd = new Date(existing.endDate);

            if (newStart < existEnd && newEnd > existStart) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Overlaps with existing exception "${existing.reason || existing.type}" (${existStart.toISOString().split('T')[0]} – ${existEnd.toISOString().split('T')[0]})`,
                    },
                    { status: 409 }
                );
            }
        }

        // Insert exception
        const [exception] = await db
            .insert(mentorAvailabilityExceptions)
            .values({
                scheduleId: schedule.id,
                startDate: newStart,
                endDate: newEnd,
                type: data.type,
                reason: data.reason,
                isFullDay: data.isFullDay,
                timeBlocks: data.timeBlocks ? JSON.stringify(data.timeBlocks) : null,
            })
            .returning();

        return NextResponse.json({ success: true, exception });
    } catch (error) {
        console.error('Error creating exception:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// ── DELETE ──

export async function DELETE(
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

        const { mentor, schedule } = await getMentorAndSchedule(id);
        if (!mentor) {
            return NextResponse.json(
                { success: false, error: 'Mentor not found' },
                { status: 404 }
            );
        }
        if (!schedule) {
            return NextResponse.json(
                { success: false, error: 'No availability schedule found' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const parsed = deleteSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        // Delete only exceptions belonging to this schedule
        const deleted = await db
            .delete(mentorAvailabilityExceptions)
            .where(
                and(
                    eq(mentorAvailabilityExceptions.scheduleId, schedule.id),
                    inArray(mentorAvailabilityExceptions.id, parsed.data.exceptionIds)
                )
            )
            .returning();

        return NextResponse.json({
            success: true,
            deletedCount: deleted.length,
        });
    } catch (error) {
        console.error('Error deleting exceptions:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
