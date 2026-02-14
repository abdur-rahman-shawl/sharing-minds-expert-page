import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { sessions } from '@/lib/db/schema/sessions';
import { users } from '@/lib/db/schema/users';
import { eq, desc, and, gte } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '5');

        const userId = session.user.id;

        const recentSessions = await db
            .select({
                id: sessions.id,
                startTime: sessions.scheduledAt,
                endTime: sessions.endedAt,
                status: sessions.status,
                meetingUrl: sessions.meetingUrl,
                mentee: {
                    id: users.id,
                    name: users.name,
                    image: users.image,
                    email: users.email
                }
            })
            .from(sessions)
            .leftJoin(users, eq(sessions.menteeId, users.id))
            .where(eq(sessions.mentorId, userId))
            .orderBy(desc(sessions.scheduledAt))
            .limit(limit);

        return NextResponse.json({ sessions: recentSessions });

    } catch (error) {
        console.error('[MENTOR_SESSIONS_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
