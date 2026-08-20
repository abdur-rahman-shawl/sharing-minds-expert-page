import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  EXPERT_REPORT_SESSION_TTL_SECONDS,
  createExpertReportSessionToken,
  isExpertReportAuthConfigured,
  verifyExpertReportCredentials,
  verifyExpertReportSessionToken,
} from './expert-report-access'

const TEST_NOW = Date.UTC(2026, 7, 20, 8, 0, 0)
const TEST_EMAIL = 'reports@example.com'
const TEST_PASSWORD = 'test-report-password'

describe('expert report access', () => {
  beforeEach(() => {
    vi.stubEnv('EXPERT_REPORT_AUTH_EMAIL', TEST_EMAIL)
    vi.stubEnv('EXPERT_REPORT_AUTH_PASSWORD', TEST_PASSWORD)
    vi.stubEnv(
      'BETTER_AUTH_SECRET',
      'test-only-report-signing-secret-that-is-long-enough',
    )
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('accepts only the configured credentials', () => {
    expect(isExpertReportAuthConfigured()).toBe(true)
    expect(
      verifyExpertReportCredentials({
        email: ' REPORTS@EXAMPLE.COM ',
        password: TEST_PASSWORD,
      }),
    ).toBe(true)
    expect(
      verifyExpertReportCredentials({
        email: TEST_EMAIL,
        password: 'incorrect-password',
      }),
    ).toBe(false)
  })

  it('creates a signed token that expires after eight hours', () => {
    const token = createExpertReportSessionToken(TEST_NOW)

    expect(verifyExpertReportSessionToken(token, TEST_NOW)).toBe(true)
    expect(
      verifyExpertReportSessionToken(
        token,
        TEST_NOW + EXPERT_REPORT_SESSION_TTL_SECONDS * 1000 - 1,
      ),
    ).toBe(true)
    expect(
      verifyExpertReportSessionToken(
        token,
        TEST_NOW + EXPERT_REPORT_SESSION_TTL_SECONDS * 1000,
      ),
    ).toBe(false)
  })

  it('rejects tampered and malformed tokens', () => {
    const token = createExpertReportSessionToken(TEST_NOW)
    const tamperedToken = `${token.slice(0, -1)}x`

    expect(verifyExpertReportSessionToken(tamperedToken, TEST_NOW)).toBe(false)
    expect(verifyExpertReportSessionToken('invalid', TEST_NOW)).toBe(false)
    expect(verifyExpertReportSessionToken(null, TEST_NOW)).toBe(false)
  })

  it('fails closed when report authentication is incomplete', () => {
    vi.stubEnv('EXPERT_REPORT_AUTH_PASSWORD', '')

    expect(isExpertReportAuthConfigured()).toBe(false)
    expect(
      verifyExpertReportCredentials({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      }),
    ).toBe(false)
  })
})
