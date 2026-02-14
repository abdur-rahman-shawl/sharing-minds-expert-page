
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query'; // Ideally add 'reviews' to queryKeys in lib/react-query.ts

export interface Review {
    id: string;
    sessionId: string;
    reviewerId: string;
    revieweeId: string;
    finalScore: string;
    feedback: string | null;
    createdAt: string;
    reviewer?: {
        id: string;
        name: string | null;
        image: string | null;
    };
    session?: {
        title: string;
        scheduledAt: string;
    };
}

export function useMentorReviewsQuery() {
    return useQuery({
        queryKey: ['reviews', 'list'] as const, // Using inline key if not in shared lib yet
        queryFn: async (): Promise<Review[]> => {
            const response = await fetch(`/api/reviews`);

            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }

            const result = await response.json();
            return result.data;
        },
    });
}
