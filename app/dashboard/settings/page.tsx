'use client'

import { ComingSoonCard } from '@/components/dashboard/coming-soon-card'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
    return (
        <ComingSoonCard
            icon={Settings}
            title="Settings"
            description="Configure your notification preferences, privacy settings, session policies, and account details."
            teaser="Customize your mentor experience exactly how you want it"
        />
    )
}
