'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { captureCurrentCampaignVisit } from '@/lib/campaign-attribution/client'

export function CampaignAttributionTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    void captureCurrentCampaignVisit()
  }, [pathname, searchParams])

  return null
}
