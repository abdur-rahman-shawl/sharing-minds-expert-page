import 'server-only'

import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import type { NextRequest, NextResponse } from 'next/server'

export const EXPERT_REPORT_SESSION_COOKIE =
  'sharingminds-expert-report-session'
export const EXPERT_REPORT_SESSION_TTL_SECONDS = 8 * 60 * 60

type ExpertReportAuthConfig = {
  email: string
  password: string
  sessionSecret: string
}

function configuration(): ExpertReportAuthConfig | null {
  const email = process.env.EXPERT_REPORT_AUTH_EMAIL?.trim().toLowerCase()
  const password = process.env.EXPERT_REPORT_AUTH_PASSWORD || ''
  const sessionSecret = process.env.BETTER_AUTH_SECRET || ''

  if (
    !email ||
    !email.includes('@') ||
    password.length < 12 ||
    sessionSecret.length < 32
  ) {
    return null
  }

  return { email, password, sessionSecret }
}

function digest(value: string): Buffer {
  return createHash('sha256').update(value, 'utf8').digest()
}

function safeEqual(expected: string, actual: string): boolean {
  return timingSafeEqual(digest(expected), digest(actual))
}

function sessionSignature(expiresAt: number, secret: string): string {
  return createHmac('sha256', secret)
    .update(`expert-report-session:v1:${expiresAt}`, 'utf8')
    .digest('base64url')
}

export function isExpertReportAuthConfigured(): boolean {
  return Boolean(configuration())
}

export function verifyExpertReportCredentials(input: {
  email: string
  password: string
}): boolean {
  const config = configuration()
  if (!config) return false

  return (
    safeEqual(config.email, input.email.trim().toLowerCase()) &&
    safeEqual(config.password, input.password)
  )
}

export function createExpertReportSessionToken(now = Date.now()): string {
  const config = configuration()
  if (!config) throw new Error('Expert report authentication is not configured')

  const expiresAt = now + EXPERT_REPORT_SESSION_TTL_SECONDS * 1000
  return `v1.${expiresAt}.${sessionSignature(expiresAt, config.sessionSecret)}`
}

export function verifyExpertReportSessionToken(
  token: string | null | undefined,
  now = Date.now(),
): boolean {
  const config = configuration()
  if (!config || !token) return false

  const [version, expiresAtValue, candidateSignature, ...extra] = token.split('.')
  if (
    version !== 'v1' ||
    extra.length > 0 ||
    !/^\d{13}$/.test(expiresAtValue || '') ||
    !candidateSignature
  ) {
    return false
  }

  const expiresAt = Number(expiresAtValue)
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) return false

  return safeEqual(
    sessionSignature(expiresAt, config.sessionSecret),
    candidateSignature,
  )
}

export function hasExpertReportAccess(request: NextRequest): boolean {
  return verifyExpertReportSessionToken(
    request.cookies.get(EXPERT_REPORT_SESSION_COOKIE)?.value,
  )
}

export function setExpertReportSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: EXPERT_REPORT_SESSION_COOKIE,
    value: createExpertReportSessionToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: EXPERT_REPORT_SESSION_TTL_SECONDS,
  })
}

export function clearExpertReportSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: EXPERT_REPORT_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
}
