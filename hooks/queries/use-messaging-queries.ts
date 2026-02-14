
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import { toast } from 'sonner';

export interface Thread {
    id: string;
    participantIds: string[];
    lastMessageAt: string | null;
    createdAt: string;
    updatedAt: string;
    participants?: Array<{
        id: string;
        name: string | null;
        email: string;
        image: string | null;
    }>;
    lastMessage?: {
        id: string;
        content: string;
        senderId: string;
        createdAt: string;
        readAt: string | null;
    } | null;
    unreadCount?: number;
}

export interface Message {
    id: string;
    threadId: string;
    senderId: string;
    recipientId: string;
    content: string;
    createdAt: string;
    readAt: string | null;
}

export function useThreadsQuery(userId?: string) {
    return useQuery({
        queryKey: queryKeys.messaging.threads(userId || ''),
        queryFn: async (): Promise<Thread[]> => {
            if (!userId) return [];
            const response = await fetch(`/api/messaging/threads`); // API path needs verification, assuming standard
            if (!response.ok) throw new Error('Failed to fetch threads');
            const result = await response.json();
            return result.data;
        },
        enabled: !!userId,
    });
}

export function useMessagesQuery(threadId: string, userId?: string) {
    return useQuery({
        queryKey: queryKeys.messaging.thread(threadId, userId || ''),
        queryFn: async (): Promise<Message[]> => {
            const response = await fetch(`/api/messaging/threads/${threadId}/messages`);
            if (!response.ok) throw new Error('Failed to fetch messages');
            const result = await response.json();
            return result.data;
        },
        enabled: !!threadId,
        refetchInterval: 5000, // Poll for new messages every 5s for now
    });
}

export function useSendMessageMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            threadId,
            content,
        }: {
            threadId: string;
            content: string;
        }) => {
            const response = await fetch(`/api/messaging/threads/${threadId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });
            if (!response.ok) throw new Error('Failed to send message');
            return response.json();
        },
        onSuccess: (_, { threadId }) => {
            // Invalidate specific thread messages and all threads list (to update last message snippet)
            queryClient.invalidateQueries({ queryKey: queryKeys.messaging.all });
        },
        onError: (error) => {
            toast.error('Failed to send message');
            console.error(error);
        },
    });
}
