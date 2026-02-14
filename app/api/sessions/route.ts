import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import {
    sessions,
    notifications,
    mentors,
    users,
    mentorAvailabilitySchedules,
    mentorWeeklyPatterns,
    mentorAvailabilityExceptions
} from '@/lib/db/schema';
import { eq, and, desc, gte, lte, or } from 'drizzle-orm';
import { z } from 'zod';
import { createBookingSchema, validateBookingTime } from '@/lib/validations/booking';
// import { bookingRateLimit, RateLimitError } from '@/lib/rate-limit'; // Skipping rate limit for now
import { getDay, addMinutes } from 'date-fns';
import { sendBookingConfirmedEmail, sendNewBookingAlertEmail } from '@/lib/emails';

// POST /api/sessions - Create new booking (session)
export async function POST(req: NextRequest) {
    try {
        // Apply rate limiting (Skipped for now)
        // bookingRateLimit.check(req);

        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized - Please log in' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const validatedData = createBookingSchema.parse(body);

        // Additional business logic validation
        const scheduledAt = new Date(validatedData.scheduledAt);
        const timeErrors = validateBookingTime(scheduledAt, validatedData.duration);

        if (timeErrors.length > 0) {
            return NextResponse.json(
                { error: 'Invalid booking time', details: timeErrors },
                { status: 400 }
            );
        }

        // Prevent self-booking
        if (validatedData.mentorId === session.user.id) {
            return NextResponse.json(
                { error: 'You cannot book a session with yourself' },
                { status: 400 }
            );
        }

        // Verify mentor exists and is available
        const [mentor] = await db
            .select()
            .from(mentors)
            .where(eq(mentors.userId, validatedData.mentorId))
            .limit(1);

        if (!mentor || !mentor.isAvailable) {
            return NextResponse.json(
                { error: 'Mentor not found or not available' },
                { status: 404 }
            );
        }

        // Check mentor's availability settings
        const [schedule] = await db
            .select()
            .from(mentorAvailabilitySchedules)
            .where(eq(mentorAvailabilitySchedules.mentorId, mentor.id))
            .limit(1);

        if (!schedule || !schedule.isActive) {
            return NextResponse.json(
                { error: 'Mentor has not set up availability' },
                { status: 400 }
            );
        }

        // Check if booking is within advance booking window
        const now = new Date();
        const minBookingTime = new Date(now.getTime() + schedule.minAdvanceBookingHours * 60 * 60 * 1000);
        const maxBookingTime = new Date(now.getTime() + schedule.maxAdvanceBookingDays * 24 * 60 * 60 * 1000);

        if (scheduledAt < minBookingTime) {
            return NextResponse.json(
                { error: `Bookings must be made at least ${schedule.minAdvanceBookingHours} hours in advance` },
                { status: 400 }
            );
        }

        if (scheduledAt > maxBookingTime) {
            return NextResponse.json(
                { error: `Bookings cannot be made more than ${schedule.maxAdvanceBookingDays} days in advance` },
                { status: 400 }
            );
        }

        // Check weekly patterns
        const dayOfWeek = getDay(scheduledAt);
        const [weeklyPattern] = await db
            .select()
            .from(mentorWeeklyPatterns)
            .where(
                and(
                    eq(mentorWeeklyPatterns.scheduleId, schedule.id),
                    eq(mentorWeeklyPatterns.dayOfWeek, dayOfWeek)
                )
            )
            .limit(1);

        if (!weeklyPattern || !weeklyPattern.isEnabled) {
            return NextResponse.json(
                { error: 'Mentor is not available on this day' },
                { status: 400 }
            );
        }

        // Check if time falls within available time blocks
        const timeBlocks = weeklyPattern.timeBlocks as any[];
        const bookingHour = scheduledAt.getHours();
        const bookingMinute = scheduledAt.getMinutes();
        const bookingTimeStr = `${bookingHour.toString().padStart(2, '0')}:${bookingMinute.toString().padStart(2, '0')}`;

        let isInAvailableBlock = false;
        for (const block of timeBlocks) {
            if (block.type === 'AVAILABLE') {
                const blockStart = block.startTime;
                const blockEnd = block.endTime;

                // Check if booking time falls within this block
                if (bookingTimeStr >= blockStart && bookingTimeStr < blockEnd) {
                    // Also check if the entire session fits within the block
                    const sessionEndTime = addMinutes(scheduledAt, validatedData.duration);
                    const sessionEndHour = sessionEndTime.getHours();
                    const sessionEndMinute = sessionEndTime.getMinutes();
                    const sessionEndStr = `${sessionEndHour.toString().padStart(2, '0')}:${sessionEndMinute.toString().padStart(2, '0')}`;

                    if (sessionEndStr <= blockEnd) {
                        isInAvailableBlock = true;
                        break;
                    }
                }
            }
        }

        if (!isInAvailableBlock) {
            return NextResponse.json(
                { error: 'This time slot is not within mentor\'s available hours' },
                { status: 400 }
            );
        }

        // Check for exceptions (holidays, vacation, etc.)
        const exceptions = await db
            .select()
            .from(mentorAvailabilityExceptions)
            .where(
                and(
                    eq(mentorAvailabilityExceptions.scheduleId, schedule.id),
                    lte(mentorAvailabilityExceptions.startDate, scheduledAt),
                    gte(mentorAvailabilityExceptions.endDate, scheduledAt)
                )
            );

        if (exceptions.length > 0) {
            const blockingException = exceptions.find(exc => exc.type !== 'AVAILABLE'); // Any non-available exception blocks
            if (blockingException) {
                return NextResponse.json(
                    { error: `Mentor is unavailable: ${blockingException.reason || 'Time off'}` },
                    { status: 400 }
                );
            }
        }

        // Check for booking conflicts with sessions
        const bufferTime = schedule.bufferTimeBetweenSessions || 0;
        const newBookingStart = scheduledAt;
        const newBookingEnd = addMinutes(newBookingStart, validatedData.duration);

        const potentialConflicts = await db
            .select({
                scheduledAt: sessions.scheduledAt,
                duration: sessions.duration,
            })
            .from(sessions)
            .where(
                and(
                    eq(sessions.mentorId, validatedData.mentorId),
                    eq(sessions.status, 'scheduled')
                )
            );

        for (const existingBooking of potentialConflicts) {
            const existingBookingStart = new Date(existingBooking.scheduledAt);
            const duration = existingBooking.duration || 0;
            const existingBookingEnd = addMinutes(existingBookingStart, duration);

            const existingStartWithBuffer = new Date(existingBookingStart.getTime() - bufferTime * 60 * 1000);
            const existingEndWithBuffer = new Date(existingBookingEnd.getTime() + bufferTime * 60 * 1000);

            if (newBookingStart < existingEndWithBuffer && newBookingEnd > existingStartWithBuffer) {
                return NextResponse.json(
                    { error: 'This time slot conflicts with another booking' },
                    { status: 409 }
                );
            }
        }

        // Create the booking
        const [newBooking] = await db
            .insert(sessions)
            .values({
                mentorId: validatedData.mentorId,
                menteeId: session.user.id,
                title: validatedData.title,
                description: validatedData.description,
                scheduledAt: new Date(validatedData.scheduledAt),
                duration: validatedData.duration,
                meetingType: validatedData.meetingType,
                location: validatedData.location,
                status: 'scheduled',
                rate: mentor.hourlyRate,
                currency: mentor.currency || 'USD',
            })
            .returning();

        // Create notification for mentor
        await db.insert(notifications).values({
            userId: validatedData.mentorId,
            type: 'BOOKING_REQUEST',
            title: 'New Session Booked!',
            message: `${session.user.name || 'A mentee'} has booked a session with you for ${validatedData.title}`,
            relatedId: newBooking.id,
            relatedType: 'session',
            actionUrl: `/dashboard?section=schedule`, // Using schedule section for mentor to see bookings
            actionText: 'View Schedule',
        });

        // Create notification for mentee
        await db.insert(notifications).values({
            userId: session.user.id,
            type: 'BOOKING_CONFIRMED',
            title: 'Session Booking Confirmed',
            message: `Your session "${validatedData.title}" has been scheduled successfully`,
            relatedId: newBooking.id,
            relatedType: 'session',
            actionUrl: `/dashboard?section=sessions`,
            actionText: 'View Sessions',
        });

        // Send emails
        const bookingEmailData = {
            sessionId: newBooking.id,
            sessionTitle: validatedData.title,
            scheduledAt: scheduledAt,
            duration: validatedData.duration,
            meetingType: validatedData.meetingType as 'video' | 'audio' | 'chat',
        };

        const [mentorUser] = await db.select().from(users).where(eq(users.id, validatedData.mentorId)).limit(1);
        const mentorName = mentorUser?.name || 'Your Mentor';
        const mentorEmail = mentorUser?.email;

        const [menteeUser] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
        const menteeName = menteeUser?.name || 'Mentee';
        const menteeEmail = menteeUser?.email;

        if (menteeEmail) {
            await sendBookingConfirmedEmail(menteeEmail, menteeName, mentorName, bookingEmailData);
        }

        if (mentorEmail) {
            await sendNewBookingAlertEmail(mentorEmail, mentorName, menteeName, bookingEmailData);
        }

        // Stubbing LiveKit Room creation for now
        // In a real implementation we would call LiveKitRoomManager.createRoomForSession(newBooking.id)

        return NextResponse.json({
            success: true,
            booking: newBooking,
            message: 'Session booked successfully!'
        });

    } catch (error) {
        console.error('Booking creation error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input data', details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}

// GET /api/sessions - Get user's sessions
export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized - Please log in' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const role = searchParams.get('role'); // 'mentor' or 'mentee'
        const status = searchParams.get('status');
        // const mentorId = searchParams.get('mentorId'); // Optional filters

        let whereCondition;

        // Default behavior matches logic in source: check sessions where user is mentor or mentee
        // If role is specified, filter by that role specifically
        if (role === 'mentor') {
            whereCondition = eq(sessions.mentorId, session.user.id);
        } else if (role === 'mentee') {
            whereCondition = eq(sessions.menteeId, session.user.id);
        } else {
            // Show all sessions if no role specified (mixed role user)
            whereCondition = or(
                eq(sessions.mentorId, session.user.id),
                eq(sessions.menteeId, session.user.id)
            );
        }

        if (status) {
            whereCondition = and(whereCondition, eq(sessions.status, status));
        }

        const sessionsData = await db
            .select({
                id: sessions.id,
                title: sessions.title,
                description: sessions.description,
                status: sessions.status,
                scheduledAt: sessions.scheduledAt,
                duration: sessions.duration,
                meetingType: sessions.meetingType,
                location: sessions.location,
                meetingUrl: sessions.meetingUrl,
                rate: sessions.rate,
                currency: sessions.currency,
                mentorNotes: sessions.mentorNotes,
                menteeNotes: sessions.menteeNotes,
                createdAt: sessions.createdAt,
                updatedAt: sessions.updatedAt,
                mentorId: sessions.mentorId,
                menteeId: sessions.menteeId,
                mentorName: mentors.fullName,
                mentorAvatar: mentors.profileImageUrl,
                menteeName: users.name,
                menteeAvatar: users.image,
            })
            .from(sessions)
            .leftJoin(mentors, eq(sessions.mentorId, mentors.userId))
            .leftJoin(users, eq(sessions.menteeId, users.id))
            .where(whereCondition)
            .orderBy(desc(sessions.scheduledAt));

        return NextResponse.json({
            success: true,
            sessions: sessionsData
        });

    } catch (error) {
        console.error('Sessions fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }
}
