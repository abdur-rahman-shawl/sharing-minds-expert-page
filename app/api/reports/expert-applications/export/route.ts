import { NextRequest, NextResponse } from 'next/server'

import {
  buildExpertApplicationReportFilename,
  buildExpertApplicationWorkbook,
  expertApplicationReportRequestSchema,
  ExpertApplicationReportTooLargeError,
  getExpertApplicationReportData,
  toExpertApplicationReportRange,
} from '@/lib/reports/expert-application-report'
import { checkPublicReportRateLimit } from '@/lib/reports/public-report-rate-limit'
import {
  assertTrustedOrigin,
  MentorApplicationSecurityError,
} from '@/lib/mentor-applications/security'
import { getApplicationAdmin } from '@/lib/mentor-applications/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

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

    const rateLimit = checkPublicReportRateLimit(request)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many report downloads. Please wait before trying again.',
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

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Request body must be valid JSON' },
        { status: 400, headers: NO_STORE_HEADERS },
      )
    }

    const parsed = expertApplicationReportRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'The report range is invalid',
          issues: parsed.error.flatten(),
        },
        { status: 400, headers: NO_STORE_HEADERS },
      )
    }

    const range = toExpertApplicationReportRange(parsed.data)
    const report = await getExpertApplicationReportData(range)
    const workbook = await buildExpertApplicationWorkbook(report)
    const filename = buildExpertApplicationReportFilename(range)
    const responseBody = new ArrayBuffer(workbook.byteLength)
    new Uint8Array(responseBody).set(workbook)

    console.info('[expert-application-report] Generated admin report', {
      adminId: admin.id,
      startAt: range.startAt.toISOString(),
      endAt: range.endAt.toISOString(),
      rows: report.rows.length,
    })

    return new NextResponse(responseBody, {
      status: 200,
      headers: {
        ...NO_STORE_HEADERS,
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Report-Row-Count': String(report.rows.length),
      },
    })
  } catch (error) {
    if (error instanceof MentorApplicationSecurityError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403, headers: NO_STORE_HEADERS },
      )
    }

    if (error instanceof ExpertApplicationReportTooLargeError) {
      return NextResponse.json(
        {
          success: false,
          error: `${error.message}. Select a narrower date range and try again.`,
        },
        { status: 413, headers: NO_STORE_HEADERS },
      )
    }

    console.error('[expert-application-report] Export failed', error)
    return NextResponse.json(
      {
        success: false,
        error: 'The report could not be generated. Please try again.',
      },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
