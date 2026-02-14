
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import { toast } from 'sonner';

export interface Session {
    id: string;
    mentorId: string;
    menteeId: string;
    title: string;
    description: string | null;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
    scheduledAt: string;
    startedAt: string | null;
    endedAt: string | null;
    duration: number;
    meetingUrl: string | null;
    meetingType: string | null;
    location: string | null;
    rate: string | null;
    currency: string | null;
    mentorNotes: string | null;
    menteeNotes: string | null;
    cancelledBy: string | null;
    cancellationReason: string | null;
    mentee?: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
    };
}

interface GetSessionsParams {

    status?: string;
    startDate?: string;
    endDate?: string;
}

export function useMentorSessionsQuery(params?: GetSessionsParams) {
    return useQuery({
        queryKey: queryKeys.sessionsList(JSON.stringify(params)), // Using a derived key for now, or simplify
        queryFn: async (): Promise<Session[]> => {
            const searchParams = new URLSearchParams();
            if (params?.status) searchParams.append('status', params.status);
            if (params?.startDate) searchParams.append('startDate', params.startDate);
            if (params?.endDate) searchParams.append('endDate', params.endDate);

            const response = await fetch(`/api/sessions?${searchParams.toString()}`);

            if (!response.ok) {
                throw new Error('Failed to fetch sessions');
            }

            const result = await response.json();
            return result.data;
        },
    });
}

export function useMentorSessionQuery(sessionId: string) {
    return useQuery({
        queryKey: queryKeys.sessionDetail(sessionId),
        queryFn: async (): Promise<Session> => {
            const response = await fetch(`/api/sessions/${sessionId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch session details');
            }

            const result = await response.json();
            return result.data;
        },
        enabled: !!sessionId,
    });
}

export function useUpdateSessionStatusMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            sessionId,
            status,
        }: {
            sessionId: string;
            status: Session['status'];
        }) => {
            const response = await fetch(`/api/sessions/${sessionId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update session status');
            }

            return response.json();
        },
        onSuccess: (_, { sessionId }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.sessions });
            queryClient.invalidateQueries({ queryKey: queryKeys.sessionDetail(sessionId) });
            toast.success('Session status updated');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}

export function useAddSessionNotesMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            sessionId,
            notes,
            type // 'mentor' or 'mentee' notes, usually mentor uses this hook
        }: {
            sessionId: string;
            notes: string;
            type: 'mentor' | 'mentee';
        }) => {
            const body = type === 'mentor' ? { mentorNotes: notes } : { menteeNotes: notes }; // API likely expects flattened patch but let's assume this structure or adjust

            // Actually, typical PATCH /api/sessions/:id handles body fields directly
            const response = await fetch(`/api/sessions/${sessionId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update notes');
            }

            return response.json();
        },
        onSuccess: (_, { sessionId }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.sessionDetail(sessionId) });
            toast.success('Notes saved');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}
