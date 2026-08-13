import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'

import { checkPublicReportRateLimit } from './public-report-rate-limit'

describe('public report rate limiting', () => {
  it('applies an isolated policy and permits requests again after reset', () => {
    const request = new NextRequest('https://example.com/api/public/stats', {
      headers: { 'x-forwarded-for': '203.0.113.247' },
    })
    const policy = {
      namespace: 'campaign-stats-test',
      maximumRequests: 2,
      windowMilliseconds: 1_000,
    }

    expect(checkPublicReportRateLimit(request, 10_000, policy)).toEqual({
      allowed: true,
    })
    expect(checkPublicReportRateLimit(request, 10_100, policy)).toEqual({
      allowed: true,
    })
    expect(checkPublicReportRateLimit(request, 10_200, policy)).toEqual({
      allowed: false,
      retryAfterSeconds: 1,
    })
    expect(checkPublicReportRateLimit(request, 11_001, policy)).toEqual({
      allowed: true,
    })
  })
})
