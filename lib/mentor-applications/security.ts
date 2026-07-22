import 'server-only'

import {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from 'node:crypto'

import type { NextRequest } from 'next/server'

import type { EmailOtpPurpose } from './constants'

export class MentorApplicationSecurityError extends Error {
  constructor(message = 'Request could not be authorized') {
    super(message)
    this.name = 'MentorApplicationSecurityError'
  }
}

export function normalizeEmail(email: string): string {
  // Deliberately do not strip plus-addressing or dots. Providers disagree about
  // their meaning, so only transformations guaranteed by our matching policy
  // are applied.
  return email.trim().toLowerCase()
}

let warnedAboutDevelopmentSecretFallback = false

function getOtpSecuritySecret(): string {
  const explicitSecret = process.env.MENTOR_APPLICATION_OTP_SECRET
  const developmentFallback =
    process.env.NODE_ENV === 'production' ? undefined : process.env.BETTER_AUTH_SECRET
  const secret = explicitSecret || developmentFallback

  if (!secret || secret.length < 32) {
    throw new Error(
      'MENTOR_APPLICATION_OTP_SECRET must be configured with at least 32 characters',
    )
  }

  if (!explicitSecret && !warnedAboutDevelopmentSecretFallback) {
    warnedAboutDevelopmentSecretFallback = true
    console.warn(
      '[mentor-applications] Development only: OTP HMAC is using BETTER_AUTH_SECRET; configure MENTOR_APPLICATION_OTP_SECRET before production',
    )
  }

  return secret
}

function getApplicationSessionSecret(): string {
  const explicitSecret = process.env.MENTOR_APPLICATION_SESSION_SECRET
  const developmentFallback =
    process.env.NODE_ENV === 'production' ? undefined : process.env.BETTER_AUTH_SECRET
  const secret = explicitSecret || developmentFallback

  if (!secret || secret.length < 32) {
    throw new Error(
      'MENTOR_APPLICATION_SESSION_SECRET must be configured with at least 32 characters',
    )
  }

  return secret
}

export function generateOtpCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, '0')
}

export function digestOtp(input: {
  challengeId: string
  normalizedEmail: string
  purpose: EmailOtpPurpose
  code: string
}): string {
  return createHmac('sha256', getOtpSecuritySecret())
    .update(
      `${input.challengeId}:${input.normalizedEmail}:${input.purpose}:${input.code}`,
      'utf8',
    )
    .digest('hex')
}

export function verifyOtpDigest(expected: string, actual: string): boolean {
  const expectedBuffer = Buffer.from(expected, 'hex')
  const actualBuffer = Buffer.from(actual, 'hex')

  return (
    expectedBuffer.length === actualBuffer.length &&
    timingSafeEqual(expectedBuffer, actualBuffer)
  )
}

export function createApplicationSessionToken(): {
  rawToken: string
  tokenDigest: string
} {
  const rawToken = randomBytes(32).toString('base64url')
  return {
    rawToken,
    tokenDigest: digestApplicationSessionToken(rawToken),
  }
}

export function digestApplicationSessionToken(rawToken: string): string {
  return createHmac('sha256', getApplicationSessionSecret())
    .update(`mentor-application-session:v1:${rawToken}`, 'utf8')
    .digest('hex')
}

function configuredAllowedOrigins(request: NextRequest): Set<string> {
  const candidates = [
    request.nextUrl.origin,
    process.env.APP_BASE_URL,
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    ...(process.env.MENTOR_APPLICATION_ALLOWED_ORIGINS || '').split(','),
  ]

  const origins = new Set<string>()
  for (const candidate of candidates) {
    if (!candidate?.trim()) continue
    try {
      origins.add(new URL(candidate.trim()).origin)
    } catch {
      // Ignore malformed optional configuration. A valid request origin must
      // still match one of the remaining values.
    }
  }

  return origins
}

export function assertTrustedOrigin(request: NextRequest): void {
  const origin = request.headers.get('origin')
  if (!origin) {
    throw new MentorApplicationSecurityError('Origin header is required')
  }

  let normalizedOrigin: string
  try {
    normalizedOrigin = new URL(origin).origin
  } catch {
    throw new MentorApplicationSecurityError('Origin header is invalid')
  }

  if (!configuredAllowedOrigins(request).has(normalizedOrigin)) {
    throw new MentorApplicationSecurityError('Origin is not allowed')
  }
}

const ALLOWED_TRUSTED_IP_HEADERS = new Set([
  'cf-connecting-ip',
  'fly-client-ip',
  'x-forwarded-for',
  'x-real-ip',
  'x-vercel-forwarded-for',
])

export function getRequestIpHash(request: NextRequest): string | null {
  const headerName = process.env.MENTOR_APPLICATION_TRUSTED_IP_HEADER
    ?.trim()
    .toLowerCase()
  if (!headerName) return null
  if (!ALLOWED_TRUSTED_IP_HEADERS.has(headerName)) {
    throw new Error('MENTOR_APPLICATION_TRUSTED_IP_HEADER is not supported')
  }

  const headerValue = request.headers.get(headerName)
  const ip =
    headerName === 'x-forwarded-for'
      ? headerValue?.split(',')[0]?.trim()
      : headerValue?.trim()
  if (!ip || ip.length > 128) return null

  return createHmac('sha256', getOtpSecuritySecret()).update(ip, 'utf8').digest('hex')
}

export function getRequestUserAgent(request: NextRequest): string | null {
  return request.headers.get('user-agent')?.slice(0, 500) || null
}

export function sha256Hex(value: string | Uint8Array): string {
  return createHash('sha256').update(value).digest('hex')
}

export function createOpaqueUuid(): string {
  const bytes = randomBytes(16)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = bytes.toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
