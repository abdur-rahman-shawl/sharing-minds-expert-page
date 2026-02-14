'use client'

import { ComingSoonCard } from '@/components/dashboard/coming-soon-card'
import { DollarSign } from 'lucide-react'

export default function EarningsPage() {
    return (
        <ComingSoonCard
            icon={DollarSign}
            title="Earnings"
            description="Track your session earnings, view payout history, and manage withdrawal settings. Full transparency on your mentoring income."
            teaser="Earn from 1-on-1 sessions and group workshops"
        />
    )
}
