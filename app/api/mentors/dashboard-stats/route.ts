import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { sessions } from '@/lib/db/schema/sessions';
import { mentoringRelationships } from '@/lib/db/schema/mentoring-relationships';
import { reviews } from '@/lib/db/schema/reviews';
import { messages } from '@/lib/db/schema/messages';
import { eq, and, gt, desc, count, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const userId = session.user.id;

        // Fetch stats in parallel
        const [
            menteeStats,
            sessionStats,
            earningsStats,
            reviewStats,
            messageStats
        ] = await Promise.all([
            // Mentee Stats
            db.select({
                total: count(),
                active: sql<number>`count(case when ${mentoringRelationships.status} = 'active' then 1 end)`
            })
                .from(mentoringRelationships)
                .where(eq(mentoringRelationships.mentorId, userId)),

            // Session Stats
            db.select({
                total: count(),
                upcoming: sql<number>`count(case when ${sessions.status} = 'scheduled' and ${sessions.scheduledAt} > now() then 1 end)`,
                completed: sql<number>`count(case when ${sessions.status} = 'completed' then 1 end)`,
                thisMonth: sql<number>`count(case when ${sessions.scheduledAt} > date_trunc('month', now()) then 1 end)`,
                lastMonth: sql<number>`count(case when ${sessions.scheduledAt} >= date_trunc('month', now() - interval '1 month') and ${sessions.scheduledAt} < date_trunc('month', now()) then 1 end)`
            })
                .from(sessions)
                .where(eq(sessions.mentorId, userId)),

            // Earnings (Mocked for now as transactions table might not be fully linked)
            // TODO: Replace with real transaction aggregation
            Promise.resolve({ total: 0, monthly: 0 }),

            // Reviews
            db.select({
                count: count(),
                avgRating: sql<number>`avg(${reviews.finalScore})`
            })
                .from(reviews)
                .where(and(
                    eq(reviews.revieweeId, userId),
                    eq(reviews.reviewerRole, 'mentee')
                )),

            // Messages
            db.select({
                total: count(),
                unread: sql<number>`count(case when ${messages.isRead} = false and ${messages.receiverId} = ${userId} then 1 end)`
            })
                .from(messages)
                .where(
                    // This is a simplification. Ideally join with threads.
                    // Assuming we want total messages where user is participant
                    eq(messages.receiverId, userId)
                )
        ]);

        return NextResponse.json({
            activeMentees: Number(menteeStats[0]?.active || 0),
            totalMentees: Number(menteeStats[0]?.total || 0),
            upcomingSessions: Number(sessionStats[0]?.upcoming || 0),
            completedSessions: Number(sessionStats[0]?.completed || 0),
            sessionsThisMonth: Number(sessionStats[0]?.thisMonth || 0),
            sessionsLastMonth: Number(sessionStats[0]?.lastMonth || 0),
            monthlyEarnings: earningsStats.monthly, // Placeholder
            totalEarnings: earningsStats.total,     // Placeholder
            averageRating: Number(reviewStats[0]?.avgRating || 0),
            totalReviews: Number(reviewStats[0]?.count || 0),
            unreadMessages: Number(messageStats[0]?.unread || 0),
            totalMessages: Number(messageStats[0]?.total || 0)
        });

    } catch (error) {
        console.error('[DASHBOARD_STATS_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
