import { beforeAll, describe, expect, it } from 'vitest'

import {
  createApplicationSessionToken,
  digestApplicationSessionToken,
  digestOtp,
  generateOtpCode,
  getRequestIpHash,
  normalizeEmail,
  verifyOtpDigest,
} from './security'

beforeAll(() => {
  process.env.MENTOR_APPLICATION_OTP_SECRET = 'otp-test-secret-that-is-at-least-32-characters'
  process.env.MENTOR_APPLICATION_SESSION_SECRET =
    'session-test-secret-that-is-at-least-32-characters'
})

describe('mentor application security primitives', () => {
  it('normalizes only whitespace and casing', () => {
    expect(normalizeEmail('  First.Last+Mentor@Example.COM  ')).toBe(
      'first.last+mentor@example.com',
    )
  })

  it('generates fixed-width numeric OTPs', () => {
    for (let index = 0; index < 25; index += 1) {
      expect(generateOtpCode()).toMatch(/^\d{6}$/)
    }
  })

  it('binds OTP digests to challenge, email, purpose, and code', () => {
    const base = {
      challengeId: '0fdded4e-8081-49d4-a57f-6b9d84ef77b1',
      normalizedEmail: 'mentor@example.com',
      purpose: 'MENTOR_APPLICATION_ACCESS' as const,
      code: '123456',
    }
    const digest = digestOtp(base)

    expect(verifyOtpDigest(digest, digestOtp(base))).toBe(true)
    expect(verifyOtpDigest(digest, digestOtp({ ...base, code: '123457' }))).toBe(false)
    expect(
      verifyOtpDigest(
        digest,
        digestOtp({ ...base, purpose: 'ACCOUNT_EMAIL_VERIFICATION' }),
      ),
    ).toBe(false)
  })

  it('stores only a keyed digest of high-entropy application tokens', () => {
    const session = createApplicationSessionToken()

    expect(session.rawToken).not.toBe(session.tokenDigest)
    expect(session.rawToken.length).toBeGreaterThanOrEqual(40)
    expect(session.tokenDigest).toMatch(/^[0-9a-f]{64}$/)
    expect(digestApplicationSessionToken(session.rawToken)).toBe(session.tokenDigest)
  })

  it('trusts an IP header only when the deployment explicitly selects it', () => {
    const request = {
      headers: new Headers({ 'x-forwarded-for': '203.0.113.8, 10.0.0.1' }),
    } as never

    delete process.env.MENTOR_APPLICATION_TRUSTED_IP_HEADER
    expect(getRequestIpHash(request)).toBeNull()

    process.env.MENTOR_APPLICATION_TRUSTED_IP_HEADER = 'x-forwarded-for'
    expect(getRequestIpHash(request)).toMatch(/^[0-9a-f]{64}$/)
    delete process.env.MENTOR_APPLICATION_TRUSTED_IP_HEADER
  })
})
