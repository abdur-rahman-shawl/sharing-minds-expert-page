import 'server-only'

import { createHash } from 'node:crypto'
import type { NextRequest } from 'next/server'

const WINDOW_MILLISECONDS = 10 * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 10

type RateLimitEntry = {
  count: number
  resetsAt: number
}

declare global {
  // eslint-disable-next-line no-var
  var sharingmindsPublicReportRateLimits: Map<string, RateLimitEntry> | undefined
}

const rateLimits =
  globalThis.sharingmindsPublicReportRateLimits ||
  new Map<string, RateLimitEntry>()

if (process.env.NODE_ENV !== 'production') {
  globalThis.sharingmindsPublicReportRateLimits = rateLimits
}

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const address = forwarded || request.headers.get('x-real-ip') || 'unknown'
  return createHash('sha256').update(address).digest('hex')
}

export function checkPublicReportRateLimit(
  request: NextRequest,
  now = Date.now(),
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  for (const [key, entry] of rateLimits.entries()) {
    if (entry.resetsAt <= now) rateLimits.delete(key)
  }

  const key = clientKey(request)
  const current = rateLimits.get(key)

  if (!current || current.resetsAt <= now) {
    rateLimits.set(key, {
      count: 1,
      resetsAt: now + WINDOW_MILLISECONDS,
    })
    return { allowed: true }
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetsAt - now) / 1000)),
    }
  }

  current.count += 1
  return { allowed: true }
}
