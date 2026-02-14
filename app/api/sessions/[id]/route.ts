import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { sessions, notifications } from '@/lib/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { z } from 'zod';
import { updateBookingSchema } from '@/lib/validations/booking';

// GET /api/sessions/[id] - Get specific session
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const [booking] = await db
            .select()
            .from(sessions)
            .where(
                and(
                    eq(sessions.id, params.id),
                    or(
                        eq(sessions.mentorId, session.user.id),
                        eq(sessions.menteeId, session.user.id)
                    )
                )
            )
            .limit(1);

        if (!booking) {
            return NextResponse.json(
                { error: 'Session not found or access denied' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            session: booking
        });

    } catch (error) {
        console.error('Session fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch session' },
            { status: 500 }
        );
    }
}

// PUT /api/sessions/[id] - Update session (cancel, complete, etc.)
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const body = await req.json();
        const validatedData = updateBookingSchema.parse(body);

        // Get the existing session
        const [existingBooking] = await db
            .select()
            .from(sessions)
            .where(
                and(
                    eq(sessions.id, params.id),
                    or(
                        eq(sessions.mentorId, session.user.id),
                        eq(sessions.menteeId, session.user.id)
                    )
                )
            )
            .limit(1);

        if (!existingBooking) {
            return NextResponse.json(
                { error: 'Session not found or access denied' },
                { status: 404 }
            );
        }

        const isMentor = existingBooking.mentorId === session.user.id;
        // const isMentee = existingBooking.menteeId === session.user.id;

        // Update the session
        const [updatedBooking] = await db
            .update(sessions)
            .set({
                ...validatedData,
                scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : undefined,
                updatedAt: new Date(),
            })
            .where(eq(sessions.id, params.id))
            .returning();

        // Create notifications for status changes
        if (validatedData.status && validatedData.status !== existingBooking.status) {
            const otherUserId = isMentor ? existingBooking.menteeId : existingBooking.mentorId;
            const userRole = isMentor ? 'mentor' : 'mentee';

            let notificationType: 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'BOOKING_RESCHEDULED' | 'SESSION_COMPLETED';
            let title = '';
            let message = '';

            switch (validatedData.status) {
                case 'cancelled':
                    notificationType = 'BOOKING_CANCELLED';
                    title = 'Session Cancelled';
                    message = `Your session "${existingBooking.title}" has been cancelled by the ${userRole}`;
                    break;
                case 'completed':
                    notificationType = 'SESSION_COMPLETED';
                    title = 'Session Completed';
                    message = `Your session "${existingBooking.title}" has been marked as completed`;
                    break;
                default:
                    notificationType = 'BOOKING_CONFIRMED';
                    title = 'Session Updated';
                    message = `Your session "${existingBooking.title}" has been updated by the ${userRole}`;
            }

            await db.insert(notifications).values({
                userId: otherUserId,
                type: notificationType,
                title,
                message,
                relatedId: existingBooking.id,
                relatedType: 'session',
                actionUrl: `/dashboard?section=${isMentor ? 'sessions' : 'schedule'}`,
                actionText: 'View Details',
            });
        }

        return NextResponse.json({
            success: true,
            session: updatedBooking,
            message: 'Session updated successfully!'
        });

    } catch (error) {
        console.error('Session update error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input data', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update session' },
            { status: 500 }
        );
    }
}

// DELETE /api/sessions/[id] - Cancel/Delete session
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
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

        // Get the existing booking
        const [existingBooking] = await db
            .select()
            .from(sessions)
            .where(
                and(
                    eq(sessions.id, params.id),
                    or(
                        eq(sessions.mentorId, session.user.id),
                        eq(sessions.menteeId, session.user.id)
                    )
                )
            )
            .limit(1);

        if (!existingBooking) {
            return NextResponse.json(
                { error: 'Session not found or access denied' },
                { status: 404 }
            );
        }

        const isMentor = existingBooking.mentorId === session.user.id;

        // Update status to cancelled instead of deleting
        const [cancelledBooking] = await db
            .update(sessions)
            .set({
                status: 'cancelled',
                updatedAt: new Date(),
            })
            .where(eq(sessions.id, params.id))
            .returning();

        // Notify the other party
        const otherUserId = isMentor ? existingBooking.menteeId : existingBooking.mentorId;
        const userRole = isMentor ? 'mentor' : 'mentee';

        await db.insert(notifications).values({
            userId: otherUserId,
            type: 'BOOKING_CANCELLED',
            title: 'Session Cancelled',
            message: `Your session "${existingBooking.title}" has been cancelled by the ${userRole}`,
            relatedId: existingBooking.id,
            relatedType: 'session',
            actionUrl: `/dashboard?section=${isMentor ? 'sessions' : 'schedule'}`,
            actionText: 'View Details',
        });

        return NextResponse.json({
            success: true,
            session: cancelledBooking,
            message: 'Session cancelled successfully!'
        });

    } catch (error) {
        console.error('Session cancellation error:', error);
        return NextResponse.json(
            { error: 'Failed to cancel session' },
            { status: 500 }
        );
    }
}
