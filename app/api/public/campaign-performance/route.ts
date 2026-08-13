import { NextRequest, NextResponse } from 'next/server'

import { isPublicCampaignStatsEnabled } from '@/lib/campaign-attribution/feature'
import {
  CampaignPerformanceTooLargeError,
  getCampaignPerformanceData,
} from '@/lib/reports/campaign-performance'
import { toExpertApplicationReportRange } from '@/lib/reports/expert-application-report'
import {
  publicCampaignPerformanceRequestSchema,
  toPublicCampaignPerformanceData,
} from '@/lib/reports/public-campaign-performance'
import { checkPublicReportRateLimit } from '@/lib/reports/public-report-rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const NO_STORE_HEADERS = {
  'Cache-Control': 'public, no-store, max-age=0',
  Pragma: 'no-cache',
  'X-Content-Type-Options': 'nosniff',
}

export async function GET(request: NextRequest) {
  if (!isPublicCampaignStatsEnabled()) {
    return NextResponse.json(
      { success: false, error: 'Public campaign stats are currently unavailable' },
      { status: 503, headers: NO_STORE_HEADERS },
    )
  }

  const rateLimit = checkPublicReportRateLimit(request, Date.now(), {
    namespace: 'campaign-stats',
    maximumRequests: 30,
    windowMilliseconds: 10 * 60 * 1000,
  })
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please wait before refreshing again.',
      },
      {
        status: 429,
        headers: {
          ...NO_STORE_HEADERS,
          'Retry-After': String(rateLimit.retryAfterSeconds),
        },
      },
    )
  }

  const parsed = publicCampaignPerformanceRequestSchema.safeParse({
    startAt: request.nextUrl.searchParams.get('startAt') || '',
    endAt: request.nextUrl.searchParams.get('endAt') || '',
    groupBy: request.nextUrl.searchParams.get('groupBy') || 'source',
  })
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsed.error.issues[0]?.message || 'The date range is invalid',
      },
      { status: 400, headers: NO_STORE_HEADERS },
    )
  }

  try {
    const range = toExpertApplicationReportRange(parsed.data)
    const performance = await getCampaignPerformanceData({
      ...range,
      groupBy: parsed.data.groupBy,
    })

    return NextResponse.json(
      {
        success: true,
        data: toPublicCampaignPerformanceData(performance),
      },
      { headers: NO_STORE_HEADERS },
    )
  } catch (error) {
    if (error instanceof CampaignPerformanceTooLargeError) {
      return NextResponse.json(
        {
          success: false,
          error: `${error.message}. Select a narrower date range.`,
        },
        { status: 413, headers: NO_STORE_HEADERS },
      )
    }

    console.error('[public-campaign-performance] Report failed', error)
    return NextResponse.json(
      { success: false, error: 'Campaign stats could not be generated' },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
