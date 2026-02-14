
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { messages, messageThreads } from "@/lib/db/schema";
import { and, asc, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ threadId: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { threadId } = await params;

        const threadMessages = await db.query.messages.findMany({
            where: eq(messages.threadId, threadId),
            orderBy: [asc(messages.createdAt)],
            with: {
                sender: {
                    columns: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });

        return NextResponse.json({ data: threadMessages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ threadId: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { threadId } = await params;
        const body = await request.json();
        const { content } = body;

        // Fetch thread to identify participants
        const thread = await db.query.messageThreads.findFirst({
            where: eq(messageThreads.id, threadId)
        });

        if (!thread) {
            return NextResponse.json({ error: "Thread not found" }, { status: 404 });
        }

        const senderId = session.user.id;
        const receiverId = thread.participant1Id === senderId ? thread.participant2Id : thread.participant1Id;

        // Create message
        const [newMessage] = await db.insert(messages).values({
            threadId,
            senderId,
            receiverId,
            content,
            status: 'sent',
            messageType: 'text'
        }).returning();

        // Update thread metadata
        await db.update(messageThreads)
            .set({
                lastMessageId: newMessage.id,
                lastMessageAt: new Date(),
                lastMessagePreview: content.substring(0, 100),
                totalMessages: sql`${messageThreads.totalMessages} + 1`,
                participant1UnreadCount: thread.participant1Id === receiverId ? sql`${messageThreads.participant1UnreadCount} + 1` : messageThreads.participant1UnreadCount,
                participant2UnreadCount: thread.participant2Id === receiverId ? sql`${messageThreads.participant2UnreadCount} + 1` : messageThreads.participant2UnreadCount,
            })
            .where(eq(messageThreads.id, threadId));

        return NextResponse.json({ data: newMessage });

    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}
