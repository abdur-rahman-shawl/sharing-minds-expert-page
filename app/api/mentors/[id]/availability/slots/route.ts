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
import { addDays, addMinutes, isAfter, isBefore, startOfDay } from 'date-fns';

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
        const requestedTimezone = url.searchParams.get('timezone') || 'UTC';
        const durationParam = url.searchParams.get('duration');

        if (!startDateStr || !endDateStr) {
            return NextResponse.json(
                { success: false, error: 'startDate and endDate are required' },
                { status: 400 }
            );
        }

        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

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
                mentorTimezone: schedule?.timezone ?? 'UTC',
                requestedTimezone,
                sessionDuration: schedule?.defaultSessionDuration ?? 60,
                bufferTime: schedule?.bufferTimeBetweenSessions ?? 15,
            });
        }

        const sessionDuration = durationParam ? parseInt(durationParam, 10) : schedule.defaultSessionDuration;
        const bufferTime = schedule.bufferTimeBetweenSessions;

        // Fetch weekly patterns
        const patterns = await db
            .select()
            .from(mentorWeeklyPatterns)
            .where(eq(mentorWeeklyPatterns.scheduleId, schedule.id));

        // Fetch exceptions
        const exceptions = await db
            .select()
            .from(mentorAvailabilityExceptions)
            .where(eq(mentorAvailabilityExceptions.scheduleId, schedule.id));

        // Build pattern lookup
        const patternMap = new Map<number, typeof patterns[0]>();
        for (const p of patterns) {
            patternMap.set(p.dayOfWeek, p);
        }

        // TODO: When sessions/bookings table exists, fetch existing bookings here
        const existingBookings: { startTime: Date; endTime: Date }[] = [];

        // Generate all slots (available + unavailable)
        const slots: { startTime: string; endTime: string; available: boolean; reason?: string }[] = [];

        let currentDay = startOfDay(startDate);
        while (isBefore(currentDay, endDate)) {
            const dayOfWeek = currentDay.getDay();
            const pattern = patternMap.get(dayOfWeek);

            // Generate slots at 30-minute intervals across the day range
            const dayStart = new Date(currentDay);
            dayStart.setHours(7, 0, 0, 0); // Start from 7 AM
            const dayEnd = new Date(currentDay);
            dayEnd.setHours(22, 0, 0, 0); // End at 10 PM

            if (!pattern || !pattern.isEnabled) {
                // Day is disabled — generate unavailable slots
                let slotStart = new Date(dayStart);
                while (addMinutes(slotStart, 30) <= dayEnd) {
                    const slotEnd = addMinutes(slotStart, 30);
                    slots.push({
                        startTime: slotStart.toISOString(),
                        endTime: slotEnd.toISOString(),
                        available: false,
                        reason: 'Day off',
                    });
                    slotStart = slotEnd;
                }
                currentDay = addDays(currentDay, 1);
                continue;
            }

            // Check for full-day blocked exception
            let isDayBlocked = false;
            for (const exc of exceptions) {
                if (
                    exc.type === 'BLOCKED' &&
                    exc.isFullDay &&
                    isBefore(new Date(exc.startDate), addDays(currentDay, 1)) &&
                    isAfter(new Date(exc.endDate), currentDay)
                ) {
                    isDayBlocked = true;
                    break;
                }
            }

            if (isDayBlocked) {
                let slotStart = new Date(dayStart);
                while (addMinutes(slotStart, 30) <= dayEnd) {
                    const slotEnd = addMinutes(slotStart, 30);
                    slots.push({
                        startTime: slotStart.toISOString(),
                        endTime: slotEnd.toISOString(),
                        available: false,
                        reason: 'Blocked (exception)',
                    });
                    slotStart = slotEnd;
                }
                currentDay = addDays(currentDay, 1);
                continue;
            }

            // Parse time blocks
            const timeBlocks = (
                typeof pattern.timeBlocks === 'string'
                    ? JSON.parse(pattern.timeBlocks as string)
                    : pattern.timeBlocks
            ) as TimeBlock[];

            // Generate 30-min interval slots and check availability
            let slotStart = new Date(dayStart);
            while (addMinutes(slotStart, 30) <= dayEnd) {
                const slotEnd = addMinutes(slotStart, 30);

                const slotHH = slotStart.getHours();
                const slotMM = slotStart.getMinutes();
                const slotTimeStr = `${slotHH.toString().padStart(2, '0')}:${slotMM.toString().padStart(2, '0')}`;
                const slotEndHH = slotEnd.getHours();
                const slotEndMM = slotEnd.getMinutes();
                const slotEndTimeStr = `${slotEndHH.toString().padStart(2, '0')}:${slotEndMM.toString().padStart(2, '0')}`;

                // Check if slot falls within an AVAILABLE block
                let isAvailable = false;
                let reason: string | undefined = 'Unavailable';

                for (const block of timeBlocks) {
                    if (block.type === 'AVAILABLE' && slotTimeStr >= block.startTime && slotEndTimeStr <= block.endTime) {
                        isAvailable = true;
                        reason = undefined;
                        break;
                    }
                    if (block.type === 'BREAK' && slotTimeStr >= block.startTime && slotTimeStr < block.endTime) {
                        reason = 'Break';
                        break;
                    }
                    if (block.type === 'BUFFER' && slotTimeStr >= block.startTime && slotTimeStr < block.endTime) {
                        reason = 'Buffer time';
                        break;
                    }
                    if (block.type === 'BLOCKED' && slotTimeStr >= block.startTime && slotTimeStr < block.endTime) {
                        reason = 'Blocked';
                        break;
                    }
                }

                // Check against existing bookings
                if (isAvailable) {
                    for (const booking of existingBookings) {
                        if (
                            isBefore(slotStart, booking.endTime) &&
                            isAfter(slotEnd, booking.startTime)
                        ) {
                            isAvailable = false;
                            reason = 'Already booked';
                            break;
                        }
                    }
                }

                slots.push({
                    startTime: slotStart.toISOString(),
                    endTime: slotEnd.toISOString(),
                    available: isAvailable,
                    ...(reason && { reason }),
                });

                slotStart = slotEnd;
            }

            currentDay = addDays(currentDay, 1);
        }

        return NextResponse.json({
            success: true,
            slots,
            mentorTimezone: schedule.timezone,
            requestedTimezone,
            sessionDuration,
            bufferTime,
        });
    } catch (error) {
        console.error('Error generating slots:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
