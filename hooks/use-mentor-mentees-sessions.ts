import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useMentorMenteeSessions() {
    const queryClient = useQueryClient();


    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ['mentor-mentees'],
        queryFn: async () => {
            const response = await fetch('/api/mentors/mentees-sessions');
            if (!response.ok) {
                throw new Error('Failed to fetch mentees');
            }
            return response.json();
        },
    });

    const mutate = () => refetch();

    return {
        mentees: data?.mentees || [],
        stats: data?.stats,
        isLoading,
        error,
        mutate
    };
}

