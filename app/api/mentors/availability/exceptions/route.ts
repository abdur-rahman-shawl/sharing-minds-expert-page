import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import {
    mentorAvailabilitySchedules,
    mentorAvailabilityExceptions,
    mentors
} from '@/lib/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { z } from 'zod';

const exceptionSchema = z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    type: z.enum(['AVAILABLE', 'BREAK', 'BUFFER', 'BLOCKED']).default('BLOCKED'),
    reason: z.string().optional(),
    isFullDay: z.boolean().default(true),
    timeBlocks: z.array(z.object({
        startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        type: z.enum(['AVAILABLE', 'BREAK', 'BUFFER', 'BLOCKED']),
    })).optional(),
});

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const sessionUserId = session?.user?.id;

        if (!sessionUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const startDate = req.nextUrl.searchParams.get('startDate');
        const endDate = req.nextUrl.searchParams.get('endDate');

        const [mentor] = await db.select().from(mentors).where(eq(mentors.userId, sessionUserId)).limit(1);
        if (!mentor) return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });

        const [schedule] = await db.select().from(mentorAvailabilitySchedules).where(eq(mentorAvailabilitySchedules.mentorId, mentor.id)).limit(1);

        if (!schedule) {
            return NextResponse.json({ success: true, exceptions: [], message: 'No availability schedule found' });
        }

        const conditions = [eq(mentorAvailabilityExceptions.scheduleId, schedule.id)];

        if (startDate && endDate) {
            conditions.push(
                and(
                    gte(mentorAvailabilityExceptions.startDate, new Date(startDate)),
                    lte(mentorAvailabilityExceptions.endDate, new Date(endDate))
                )!
            );
        }

        const finalWhere = conditions.length > 1 ? and(...conditions) : conditions[0];

        const exceptions = await db
            .select()
            .from(mentorAvailabilityExceptions)
            .where(finalWhere);
        return NextResponse.json({ success: true, exceptions });

    } catch (error) {
        console.error('Get exceptions error:', error);
        return NextResponse.json({ error: 'Failed to fetch availability exceptions' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const sessionUserId = session?.user?.id;

        if (!sessionUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const [mentor] = await db.select().from(mentors).where(eq(mentors.userId, sessionUserId)).limit(1);
        if (!mentor) return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });

        const [schedule] = await db.select().from(mentorAvailabilitySchedules).where(eq(mentorAvailabilitySchedules.mentorId, mentor.id)).limit(1);
        if (!schedule) {
            return NextResponse.json({ error: 'No availability schedule found. Please set up your availability first.' }, { status: 404 });
        }

        const body = await req.json();
        const validatedData = exceptionSchema.parse(body);

        const startDate = new Date(validatedData.startDate);
        const endDate = new Date(validatedData.endDate);

        if (startDate > endDate) {
            return NextResponse.json({ error: 'Start date must be before or equal to end date' }, { status: 400 });
        }

        const overlappingExceptions = await db
            .select()
            .from(mentorAvailabilityExceptions)
            .where(
                and(
                    eq(mentorAvailabilityExceptions.scheduleId, schedule.id),
                    lte(mentorAvailabilityExceptions.startDate, endDate),
                    gte(mentorAvailabilityExceptions.endDate, startDate)
                )
            );

        if (overlappingExceptions.length > 0) {
            return NextResponse.json({ error: 'This exception overlaps with an existing exception' }, { status: 409 });
        }

        const [newException] = await db
            .insert(mentorAvailabilityExceptions)
            .values({
                scheduleId: schedule.id,
                startDate,
                endDate,
                type: validatedData.type,
                reason: validatedData.reason,
                isFullDay: validatedData.isFullDay,
                timeBlocks: validatedData.timeBlocks as any,
            })
            .returning();

        return NextResponse.json({ success: true, exception: newException, message: 'Availability exception created successfully' });

    } catch (error) {
        console.error('Create exception error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create availability exception' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const sessionUserId = session?.user?.id;

        if (!sessionUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const [mentor] = await db.select().from(mentors).where(eq(mentors.userId, sessionUserId)).limit(1);
        if (!mentor) return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });

        const [schedule] = await db.select().from(mentorAvailabilitySchedules).where(eq(mentorAvailabilitySchedules.mentorId, mentor.id)).limit(1);
        if (!schedule) return NextResponse.json({ error: 'No availability schedule found' }, { status: 404 });

        const body = await req.json();
        const { exceptionIds } = z.object({ exceptionIds: z.array(z.string().uuid()) }).parse(body);

        if (exceptionIds.length === 0) return NextResponse.json({ error: 'No exception IDs provided' }, { status: 400 });

        let deletedCount = 0;
        await db.transaction(async (tx) => {
            for (const exceptionId of exceptionIds) {
                const result = await tx.delete(mentorAvailabilityExceptions).where(and(eq(mentorAvailabilityExceptions.id, exceptionId), eq(mentorAvailabilityExceptions.scheduleId, schedule.id)));
                if (result) deletedCount++; // counting logic might vary depending on ORM return
            }
        });

        return NextResponse.json({ success: true, message: `${deletedCount} exception(s) deleted successfully` });

    } catch (error) {
        console.error('Delete exceptions error:', error);
        return NextResponse.json({ error: 'Failed to delete exceptions' }, { status: 500 });
    }
}
