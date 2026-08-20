import type { Metadata } from 'next'

import CampaignStatsDashboard from '@/components/reports/campaign-stats-dashboard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Expert Application Performance - sharingminds',
  description:
    'Compare aggregate campaign visits, expert applications, and conversion KPIs.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function ExpertApplicationReportsPage() {
  return <CampaignStatsDashboard />
}
