import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { mentors, sessions, reviews } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        const sessionUserId = session?.user?.id;

        if (!sessionUserId) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Get mentor ID
        const [mentor] = await db
            .select({ id: mentors.id, currency: mentors.currency, hourlyRate: mentors.hourlyRate })
            .from(mentors)
            .where(eq(mentors.userId, sessionUserId))
            .limit(1);

        if (!mentor) {
            return NextResponse.json({ success: false, error: 'Mentor profile not found' }, { status: 404 });
        }

        // 1. Total Sessions (Completed)
        const [totalSessionsResult] = await db
            .select({ count: sql<number>`count(*)` })
            .from(sessions)
            .where(and(eq(sessions.mentorId, sessionUserId), eq(sessions.status, 'completed')));

        // 2. Total Mentees (Unique completed sessions)
        const [totalMenteesResult] = await db
            .select({ count: sql<number>`count(distinct ${sessions.menteeId})` })
            .from(sessions)
            .where(and(eq(sessions.mentorId, sessionUserId), eq(sessions.status, 'completed')));

        // 3. Average Rating
        const [avgRatingResult] = await db
            .select({ avg: sql<string>`avg(${reviews.finalScore})` })
            .from(reviews)
            // Reviewer is Mentee (role=user?), Reviewee is Mentor
            // Schema: revieweeId is the person being reviewed.
            .where(eq(reviews.revieweeId, sessionUserId));

        // 4. Total Earnings (Sum of rate for completed sessions)
        // Note: real earnings might be more complex (refunds, platform fees)
        // This is a rough estimate based on session rates.
        const [earningsResult] = await db
            .select({ total: sql<string>`sum(${sessions.rate})` })
            .from(sessions)
            .where(and(eq(sessions.mentorId, sessionUserId), eq(sessions.status, 'completed')));

        const stats = {
            totalSessions: Number(totalSessionsResult?.count || 0),
            totalMentees: Number(totalMenteesResult?.count || 0),
            averageRating: Number(parseFloat(avgRatingResult?.avg || '0').toFixed(1)), // 4.5
            totalEarnings: Number(parseFloat(earningsResult?.total || '0').toFixed(2)),
            currency: mentor.currency || 'USD'
        };

        return NextResponse.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch dashboard stats' },
            { status: 500 }
        );
    }
}
