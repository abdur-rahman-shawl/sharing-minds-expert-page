import { describe, expect, it } from 'vitest'

import { resolveExpertRegistrationDraftCookieName } from './constants'

describe('expert registration draft cookie name', () => {
  it('uses a browser-compatible unprefixed cookie on local HTTP', () => {
    expect(
      resolveExpertRegistrationDraftCookieName({ isProduction: false }),
    ).toBe('sharingminds-expert-registration-draft')
  })

  it('uses the secure browser-enforced prefix in production', () => {
    expect(
      resolveExpertRegistrationDraftCookieName({ isProduction: true }),
    ).toBe('__Secure-sharingminds-expert-registration-draft')
  })

  it('honors an explicitly configured cookie name', () => {
    expect(
      resolveExpertRegistrationDraftCookieName({
        configuredName: 'custom-expert-draft',
        isProduction: true,
      }),
    ).toBe('custom-expert-draft')
  })
})
