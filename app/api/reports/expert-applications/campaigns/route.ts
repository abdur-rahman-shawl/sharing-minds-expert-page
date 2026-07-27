import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { getApplicationAdmin } from '@/lib/mentor-applications/auth'
import {
  assertTrustedOrigin,
  MentorApplicationSecurityError,
} from '@/lib/mentor-applications/security'
import {
  CampaignPerformanceTooLargeError,
  getCampaignPerformanceData,
} from '@/lib/reports/campaign-performance'
import {
  expertApplicationReportRequestSchema,
  toExpertApplicationReportRange,
} from '@/lib/reports/expert-application-report'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const campaignPerformanceRequestSchema = expertApplicationReportRequestSchema.and(
  z.object({
    groupBy: z.enum(['source', 'campaign', 'content']).default('campaign'),
  }),
)

const NO_STORE_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0',
  Pragma: 'no-cache',
  'X-Content-Type-Options': 'nosniff',
}
export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request)
    const admin = await getApplicationAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Administrator access is required' },
        { status: 403, headers: NO_STORE_HEADERS },
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Request body must be valid JSON' },
        { status: 400, headers: NO_STORE_HEADERS },
      )
    }

    const parsed = campaignPerformanceRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'The report request is invalid',
        },
        { status: 400, headers: NO_STORE_HEADERS },
      )
    }

    const range = toExpertApplicationReportRange(parsed.data)
    const data = await getCampaignPerformanceData({
      ...range,
      groupBy: parsed.data.groupBy,
    })
    return NextResponse.json(
      { success: true, data },
      { headers: NO_STORE_HEADERS },
    )
  } catch (error) {
    if (error instanceof MentorApplicationSecurityError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403, headers: NO_STORE_HEADERS },
      )
    }
    if (error instanceof CampaignPerformanceTooLargeError) {
      return NextResponse.json(
        {
          success: false,
          error: `${error.message}. Select a narrower date range.`,
        },
        { status: 413, headers: NO_STORE_HEADERS },
      )
    }
    console.error('[campaign-performance] Report failed', error)
    return NextResponse.json(
      { success: false, error: 'Campaign insights could not be generated' },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
