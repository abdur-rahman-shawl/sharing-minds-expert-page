'use client'

import { ComingSoonCard } from '@/components/dashboard/coming-soon-card'
import { CreditCard } from 'lucide-react'

export default function SubscriptionPage() {
    return (
        <ComingSoonCard
            icon={CreditCard}
            title="Subscription"
            description="Manage your mentor subscription plan, billing details, and payment history. Choose the plan that fits your mentoring goals."
            teaser="Founding mentors may receive special early-adopter pricing"
        />
    )
}
