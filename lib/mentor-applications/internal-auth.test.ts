import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { verifyMentorApplicationInternalAuthorization } from './internal-auth'

const internalSecret = 'internal-api-test-secret-that-is-at-least-32-characters'

describe('mentor application internal authorization', () => {
  beforeEach(() => {
    process.env.MENTOR_APPLICATION_INTERNAL_API_SECRET = internalSecret
  })

  afterEach(() => {
    delete process.env.MENTOR_APPLICATION_INTERNAL_API_SECRET
  })

  it('accepts only the exact server-to-server bearer credential', () => {
    expect(
      verifyMentorApplicationInternalAuthorization(`Bearer ${internalSecret}`),
    ).toBe(true)
    expect(
      verifyMentorApplicationInternalAuthorization('Bearer incorrect-secret'),
    ).toBe(false)
    expect(verifyMentorApplicationInternalAuthorization(null)).toBe(false)
  })

  it('fails closed when a bearer credential is used without server configuration', () => {
    delete process.env.MENTOR_APPLICATION_INTERNAL_API_SECRET

    expect(() =>
      verifyMentorApplicationInternalAuthorization(`Bearer ${internalSecret}`),
    ).toThrow(/MENTOR_APPLICATION_INTERNAL_API_SECRET/)
  })
})
