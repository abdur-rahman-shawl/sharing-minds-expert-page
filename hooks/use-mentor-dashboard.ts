import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface MentorDashboardStats {
    activeMentees: number;
    totalMentees: number;
    upcomingSessions: number;
    completedSessions: number;
    monthlyEarnings: number;
    totalEarnings: number;
    averageRating: number | null;
    totalReviews: number;
    unreadMessages: number;
    totalMessages: number;
    sessionsThisMonth: number;
    sessionsLastMonth: number;
}

const fetchStats = async (): Promise<MentorDashboardStats> => {
    const response = await fetch('/api/mentors/dashboard-stats');
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
    }
    return response.json();
};

export function useMentorDashboardStats() {
    const queryClient = useQueryClient();

    const { data, error, isLoading } = useQuery({
        queryKey: ['mentor-dashboard-stats'],
        queryFn: fetchStats,
        refetchInterval: 60000, // Refresh every minute
    });

    const mutate = () => queryClient.invalidateQueries({ queryKey: ['mentor-dashboard-stats'] });

    return {
        stats: data,
        isLoading,
        error,
        mutate,
    };
}

export function useMentorRecentSessions(limit: number = 5) {
    return useQuery({
        queryKey: ['mentor-recent-sessions', limit],
        queryFn: async () => {
            const response = await fetch(`/api/mentors/sessions?limit=${limit}`);
            if (!response.ok) throw new Error('Failed to fetch recent sessions');
            return response.json();
        }
    });
}

export function useMentorRecentMessages(limit: number = 5) {
    return useQuery({
        queryKey: ['mentor-recent-messages', limit],
        queryFn: async () => {
            const response = await fetch(`/api/mentors/messages?limit=${limit}`);
            if (!response.ok) throw new Error('Failed to fetch recent messages');
            return response.json();
        }
    });
}

export function useMentorPendingReviews() {
    return useQuery({
        queryKey: ['mentor-pending-reviews'],
        queryFn: async () => {
            const response = await fetch('/api/mentors/reviews/pending');
            if (!response.ok) throw new Error('Failed to fetch pending reviews');
            return response.json();
        }
    });
}
