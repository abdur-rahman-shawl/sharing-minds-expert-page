'use client'

import { ComingSoonCard } from '@/components/dashboard/coming-soon-card'
import { FolderOpen } from 'lucide-react'

export default function ContentPage() {
    return (
        <ComingSoonCard
            icon={FolderOpen}
            title="My Content"
            description="Upload and manage learning materials for your mentees. Share documents, videos, guides, and curated resources to enhance your sessions."
            teaser="Create a library of resources your mentees can access anytime"
        />
    )
}
