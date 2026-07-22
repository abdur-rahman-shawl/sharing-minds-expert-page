import 'server-only'

import { createHash, timingSafeEqual } from 'node:crypto'

const MINIMUM_INTERNAL_SECRET_LENGTH = 32

function digest(value: string): Buffer {
  return createHash('sha256').update(value, 'utf8').digest()
}

/**
 * Allows the main SharingMinds backend to proxy CLEAN application files when
 * onboarding and platform auth cookies are hosted on different origins. The
 * bearer credential is server-to-server only and must never reach a browser.
 */
export function verifyMentorApplicationInternalAuthorization(
  authorizationHeader: string | null,
): boolean {
  if (!authorizationHeader?.startsWith('Bearer ')) return false

  const expected = process.env.MENTOR_APPLICATION_INTERNAL_API_SECRET
  if (!expected || expected.length < MINIMUM_INTERNAL_SECRET_LENGTH) {
    throw new Error(
      'MENTOR_APPLICATION_INTERNAL_API_SECRET must be configured with at least 32 characters',
    )
  }

  const candidate = authorizationHeader.slice('Bearer '.length)
  return (
    candidate.length > 0 &&
    timingSafeEqual(digest(expected), digest(candidate))
  )
}
