'use client'

import { ComingSoonCard } from '@/components/dashboard/coming-soon-card'
import { BarChart3 } from 'lucide-react'

export default function AnalyticsPage() {
    return (
        <ComingSoonCard
            icon={BarChart3}
            title="Analytics"
            description="Get data-driven insights into your mentoring performance. Track session trends, mentee progress, engagement metrics, and more."
            teaser="AI-powered insights to optimize your mentoring"
        />
    )
}
