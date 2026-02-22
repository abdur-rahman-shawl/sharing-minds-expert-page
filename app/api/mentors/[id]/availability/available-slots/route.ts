import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
    mentors,
    mentorAvailabilitySchedules,
    mentorWeeklyPatterns,
    mentorAvailabilityExceptions,
} from '@/lib/db/schema';
import type { TimeBlock } from '@/lib/db/schema/mentor-availability';
import { eq } from 'drizzle-orm';
import { applyBlockedTimes } from '@/lib/utils/availability-validation';
import { addDays, addMinutes, format, isAfter, isBefore, startOfDay } from 'date-fns';

export const dynamic = 'force-dynamic';

// ── GET ──

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const url = new URL(request.url);
        const startDateStr = url.searchParams.get('startDate');
        const endDateStr = url.searchParams.get('endDate');

        if (!startDateStr || !endDateStr) {
            return NextResponse.json(
                { success: false, error: 'startDate and endDate are required' },
                { status: 400 }
            );
        }

        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        // Max 90-day range
        const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff > 90) {
            return NextResponse.json(
                { success: false, error: 'Date range cannot exceed 90 days' },
                { status: 400 }
            );
        }

        // Look up mentor
        const [mentor] = await db
            .select({ id: mentors.id })
            .from(mentors)
            .where(eq(mentors.userId, id))
            .limit(1);

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

        if (!schedule || !schedule.isActive) {
            return NextResponse.json({
                success: true,
                slots: [],
                sessionDuration: schedule?.defaultSessionDuration ?? 60,
                timezone: schedule?.timezone ?? 'UTC',
                disabledDays: [],
                total: 0,
            });
        }

        // Fetch weekly patterns
        const patterns = await db
            .select()
            .from(mentorWeeklyPatterns)
            .where(eq(mentorWeeklyPatterns.scheduleId, schedule.id));

        // Fetch exceptions in range
        const exceptions = await db
            .select()
            .from(mentorAvailabilityExceptions)
            .where(eq(mentorAvailabilityExceptions.scheduleId, schedule.id));

        // Build pattern lookup (dayOfWeek → pattern)
        const patternMap = new Map<number, typeof patterns[0]>();
        for (const p of patterns) {
            patternMap.set(p.dayOfWeek, p);
        }

        // Determine disabled days
        const disabledDays: number[] = [];
        for (let d = 0; d <= 6; d++) {
            const pattern = patternMap.get(d);
            if (!pattern || !pattern.isEnabled) {
                disabledDays.push(d);
            }
        }

        // Compute min/max booking window
        const now = new Date();
        const minBookingTime = addMinutes(now, schedule.minAdvanceBookingHours * 60);
        const maxBookingTime = addDays(now, schedule.maxAdvanceBookingDays);

        const sessionDuration = schedule.defaultSessionDuration;
        const bufferTime = schedule.bufferTimeBetweenSessions;

        // TODO: When sessions/bookings table exists, fetch existing bookings here
        // const existingBookings = await db.select().from(sessions)...
        const existingBookings: { startTime: Date; endTime: Date }[] = [];

        // Generate slots
        const slots: { startTime: string; endTime: string; available: boolean }[] = [];

        let currentDay = startOfDay(startDate);
        while (isBefore(currentDay, endDate)) {
            const dayOfWeek = currentDay.getDay(); // 0=Sun … 6=Sat
            const pattern = patternMap.get(dayOfWeek);

            if (!pattern || !pattern.isEnabled) {
                currentDay = addDays(currentDay, 1);
                continue;
            }

            // Check if this day falls within a BLOCKED exception
            const dayStart = currentDay;
            const dayEnd = addDays(currentDay, 1);
            let isDayBlocked = false;

            for (const exc of exceptions) {
                if (
                    exc.type === 'BLOCKED' &&
                    exc.isFullDay &&
                    isBefore(new Date(exc.startDate), dayEnd) &&
                    isAfter(new Date(exc.endDate), dayStart)
                ) {
                    isDayBlocked = true;
                    break;
                }
            }

            if (isDayBlocked) {
                currentDay = addDays(currentDay, 1);
                continue;
            }

            // Parse time blocks
            const timeBlocks = (
                typeof pattern.timeBlocks === 'string'
                    ? JSON.parse(pattern.timeBlocks as string)
                    : pattern.timeBlocks
            ) as TimeBlock[];

            const availableBlocks = timeBlocks.filter((b) => b.type === 'AVAILABLE');
            const blockedBlocks = timeBlocks.filter((b) => b.type !== 'AVAILABLE');

            // Apply blocked times to fragment available blocks
            const effectiveBlocks = applyBlockedTimes(availableBlocks, blockedBlocks);

            // Generate slots at sessionDuration intervals
            for (const block of effectiveBlocks) {
                const [blockStartH, blockStartM] = block.startTime.split(':').map(Number);
                const [blockEndH, blockEndM] = block.endTime.split(':').map(Number);

                let slotStart = new Date(currentDay);
                slotStart.setHours(blockStartH, blockStartM, 0, 0);

                const blockEnd = new Date(currentDay);
                blockEnd.setHours(blockEndH, blockEndM, 0, 0);

                while (addMinutes(slotStart, sessionDuration) <= blockEnd) {
                    const slotEnd = addMinutes(slotStart, sessionDuration);

                    // Check booking window
                    if (isBefore(slotStart, minBookingTime) || isAfter(slotEnd, maxBookingTime)) {
                        slotStart = addMinutes(slotEnd, bufferTime);
                        continue;
                    }

                    // Check against existing bookings (with buffer padding)
                    const slotStartWithBuffer = addMinutes(slotStart, -bufferTime);
                    const slotEndWithBuffer = addMinutes(slotEnd, bufferTime);

                    let hasConflict = false;
                    for (const booking of existingBookings) {
                        if (
                            isBefore(slotStartWithBuffer, booking.endTime) &&
                            isAfter(slotEndWithBuffer, booking.startTime)
                        ) {
                            hasConflict = true;
                            break;
                        }
                    }

                    if (!hasConflict) {
                        slots.push({
                            startTime: slotStart.toISOString(),
                            endTime: slotEnd.toISOString(),
                            available: true,
                        });
                    }

                    slotStart = addMinutes(slotEnd, bufferTime);
                }
            }

            currentDay = addDays(currentDay, 1);
        }

        // Sort by start time
        slots.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

        return NextResponse.json({
            success: true,
            slots,
            sessionDuration,
            timezone: schedule.timezone,
            disabledDays,
            total: slots.length,
        });
    } catch (error) {
        console.error('Error generating available slots:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
