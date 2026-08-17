import { describe, expect, it, vi } from 'vitest'

import {
  EMAIL_SUBMISSION_AUTH_ERROR,
  EXISTING_EMAIL_SIGN_UP_ERROR_CODE,
  authenticateEmailSubmission,
} from './email-submission-auth'

describe('expert registration email authentication', () => {
  it('uses the newly created email identity without an additional authentication call', async () => {
    const authenticateExistingEmail = vi.fn()

    await expect(
      authenticateEmailSubmission({
        signUpWithEmail: async () => ({}),
        authenticateExistingEmail,
      }),
    ).resolves.toEqual({ authenticated: true, method: 'NEW_SIGN_UP' })
    expect(authenticateExistingEmail).not.toHaveBeenCalled()
  })

  it('authenticates transparently when the email identity already exists', async () => {
    await expect(
      authenticateEmailSubmission({
        signUpWithEmail: async () => ({
          error: { code: EXISTING_EMAIL_SIGN_UP_ERROR_CODE },
        }),
        authenticateExistingEmail: async () => ({}),
      }),
    ).resolves.toEqual({ authenticated: true, method: 'EXISTING_PASSWORD' })
  })

  it('returns the same non-enumerating result for a rejected existing password', async () => {
    await expect(
      authenticateEmailSubmission({
        signUpWithEmail: async () => ({
          error: { code: EXISTING_EMAIL_SIGN_UP_ERROR_CODE },
        }),
        authenticateExistingEmail: async () => ({
          error: { code: 'INVALID_EMAIL_OR_PASSWORD' },
        }),
      }),
    ).resolves.toEqual({ authenticated: false })
  })

  it('does not attempt authentication for unrelated registration failures', async () => {
    const authenticateExistingEmail = vi.fn()

    await expect(
      authenticateEmailSubmission({
        signUpWithEmail: async () => ({ error: { code: 'TOO_MANY_REQUESTS' } }),
        authenticateExistingEmail,
      }),
    ).resolves.toEqual({ authenticated: false })
    expect(authenticateExistingEmail).not.toHaveBeenCalled()
  })

  it('keeps the public error free of account-existence language', () => {
    expect(EMAIL_SUBMISSION_AUTH_ERROR).not.toMatch(/account|already exists|sign in/i)
  })
})
