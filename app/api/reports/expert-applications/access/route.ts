import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import {
  clearExpertReportSessionCookie,
  isExpertReportAuthConfigured,
  setExpertReportSessionCookie,
  verifyExpertReportCredentials,
} from '@/lib/reports/expert-report-access'
import { checkPublicReportRateLimit } from '@/lib/reports/public-report-rate-limit'
import {
  assertTrustedOrigin,
  MentorApplicationSecurityError,
} from '@/lib/mentor-applications/security'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(200),
})

const NO_STORE_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0',
  Pragma: 'no-cache',
  'X-Content-Type-Options': 'nosniff',
}

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request)

    if (!isExpertReportAuthConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Report access is not configured' },
        { status: 503, headers: NO_STORE_HEADERS },
      )
    }

    const rateLimit = checkPublicReportRateLimit(request, Date.now(), {
      namespace: 'expert-report-login',
      maximumRequests: 5,
      windowMilliseconds: 15 * 60 * 1000,
    })
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            ...NO_STORE_HEADERS,
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        },
      )
    }

    const body = await request.json().catch(() => null)
    const parsed = credentialsSchema.safeParse(body)
    if (!parsed.success || !verifyExpertReportCredentials(parsed.data)) {
      return NextResponse.json(
        { success: false, error: 'Email or password is incorrect' },
        { status: 401, headers: NO_STORE_HEADERS },
      )
    }

    const response = NextResponse.json(
      { success: true },
      { headers: NO_STORE_HEADERS },
    )
    setExpertReportSessionCookie(response)
    return response
  } catch (error) {
    if (error instanceof MentorApplicationSecurityError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403, headers: NO_STORE_HEADERS },
      )
    }

    console.error('[expert-report-access] Login failed', error)
    return NextResponse.json(
      { success: false, error: 'Unable to sign in to reports' },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    assertTrustedOrigin(request)
    const response = NextResponse.json(
      { success: true },
      { headers: NO_STORE_HEADERS },
    )
    clearExpertReportSessionCookie(response)
    return response
  } catch (error) {
    if (error instanceof MentorApplicationSecurityError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403, headers: NO_STORE_HEADERS },
      )
    }
    return NextResponse.json(
      { success: false, error: 'Unable to sign out' },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
