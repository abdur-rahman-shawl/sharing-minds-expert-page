
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageThreads, users } from "@/lib/db/schema";
import { and, desc, eq, or } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Fetch threads where user is participant and not deleted/archived
        // For simplicity, we fetch all active threads
        const threads = await db.query.messageThreads.findMany({
            where: and(
                or(
                    eq(messageThreads.participant1Id, userId),
                    eq(messageThreads.participant2Id, userId)
                ),
                eq(messageThreads.status, "active")
            ),
            with: {
                participant1: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                participant2: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
            orderBy: [desc(messageThreads.lastMessageAt)],
        });

        // Format threads for frontend
        const formattedThreads = threads.map((thread) => {
            const isP1 = thread.participant1Id === userId;
            // Filter out self from participants list if needed, or include both
            // The hook expects participants array.

            const otherParticipant = isP1 ? thread.participant2 : thread.participant1;

            return {
                id: thread.id,
                participantIds: [thread.participant1Id, thread.participant2Id],
                lastMessageAt: thread.lastMessageAt?.toISOString() || null,
                createdAt: thread.createdAt.toISOString(),
                updatedAt: thread.updatedAt.toISOString(),
                participants: [otherParticipant], // Only return the other person for display
                lastMessage: {
                    id: thread.lastMessageId || '',
                    content: thread.lastMessagePreview || '',
                    senderId: '', // Ideally we store senderId of last message in thread metadata or joined query, but for preview text is enough
                    createdAt: thread.lastMessageAt?.toISOString() || '',
                    readAt: null
                },
                unreadCount: isP1 ? thread.participant1UnreadCount : thread.participant2UnreadCount,
            };
        });

        return NextResponse.json({ data: formattedThreads });
    } catch (error) {
        console.error("Error fetching threads:", error);
        return NextResponse.json(
            { error: "Failed to fetch threads" },
            { status: 500 }
        );
    }
}
