import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { messages } from '@/lib/db/schema/messages';
import { users } from '@/lib/db/schema/users';
import { eq, desc, or, and } from 'drizzle-orm';
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

        const recentMessages = await db
            .select({
                id: messages.id,
                content: messages.content,
                createdAt: messages.createdAt,
                isRead: messages.isRead,
                sender: {
                    id: users.id,
                    name: users.name,
                    image: users.image
                }
            })
            .from(messages)
            .leftJoin(users, eq(messages.senderId, users.id))
            .where(
                and(
                    eq(messages.receiverId, userId),
                    // Only show messages from others
                    // eq(messages.receiverId, userId) matches this implicit logic
                )
            )
            .orderBy(desc(messages.createdAt))
            .limit(limit);

        return NextResponse.json({ messages: recentMessages });

    } catch (error) {
        console.error('[MENTOR_MESSAGES_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
