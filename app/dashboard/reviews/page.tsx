'use client'

import { ComingSoonCard } from '@/components/dashboard/coming-soon-card'
import { Star } from 'lucide-react'

export default function ReviewsPage() {
    return (
        <ComingSoonCard
            icon={Star}
            title="Reviews"
            description="View reviews from your mentees and track your reputation score. Build your credibility as a top mentor on the platform."
        />
    )
}
