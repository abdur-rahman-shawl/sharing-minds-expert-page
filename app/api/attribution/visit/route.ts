import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import {
  captureCampaignVisit,
  setCampaignAttributionCookies,
} from '@/lib/campaign-attribution/server'
import { isCampaignAttributionEnabled } from '@/lib/campaign-attribution/feature'
import {
  assertTrustedOrigin,
  MentorApplicationSecurityError,
} from '@/lib/mentor-applications/security'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const captureVisitSchema = z.object({
  path: z.string().trim().min(1).max(500).startsWith('/'),
  search: z.string().max(2_000).default(''),
  referrer: z.string().max(2_000).default(''),
})

export async function POST(request: NextRequest) {
  if (!isCampaignAttributionEnabled()) {
    return NextResponse.json({ success: true, enabled: false })
  }

  try {
    assertTrustedOrigin(request)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Request body must be valid JSON' },
        { status: 400 },
      )
    }

    const parsed = captureVisitSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Campaign visit payload is invalid' },
        { status: 400 },
      )
    }

    const result = await captureCampaignVisit(request, parsed.data)
    const response = NextResponse.json({
      success: true,
      enabled: true,
      visitId: result.visit.id,
    })
    setCampaignAttributionCookies(response, result)
    return response
  } catch (error) {
    if (error instanceof MentorApplicationSecurityError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 },
      )
    }
    console.error('[campaign-attribution] Visit capture failed', error)
    return NextResponse.json(
      { success: false, error: 'Unable to record this visit' },
      { status: 500 },
    )
  }
}
