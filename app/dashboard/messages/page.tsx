'use client'

import { ComingSoonCard } from '@/components/dashboard/coming-soon-card'
import { MessageSquare } from 'lucide-react'

export default function MessagesPage() {
    return (
        <ComingSoonCard
            icon={MessageSquare}
            title="Messages"
            description="Communicate directly with your mentees and platform administrators. Real-time messaging with notifications."
            teaser="Founding mentors get priority support from admins"
        />
    )
}
