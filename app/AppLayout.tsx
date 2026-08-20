'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { Footer } from '@/components/footer'
import { LandingHeader } from '@/components/landing-header'
import { CampaignAttributionTracker } from '@/components/providers/campaign-attribution-tracker'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isAuthPage = pathname.startsWith('/auth')
  const isDashboardPage = pathname.startsWith('/dashboard')
  const isExpertReportDownload = pathname.startsWith(
    '/reports/expert-applications/download',
  )
  const hideChrome = isAuthPage || isDashboardPage || isExpertReportDownload

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <CampaignAttributionTracker />
      </Suspense>
      {!hideChrome && <LandingHeader />}
      <main className="flex-1">{children}</main>
      {!hideChrome && <Footer />}
    </div>
  )
}
