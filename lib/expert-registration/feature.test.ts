import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  isLegacyMentorApplicationAccessEnabled,
  isLegacyMentorApplicationAutoClaimEnabled,
  isLegacyMentorApplicationIntakeEnabled,
  isLiveExpertRegistrationEnabled,
} from './feature'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('expert registration cutover flags', () => {
  it('keeps v3 and legacy auto-claim off unless explicitly enabled', () => {
    vi.stubEnv('EXPERT_REGISTRATION_V3_ENABLED', '')
    vi.stubEnv('LEGACY_MENTOR_APPLICATION_AUTO_CLAIM_ENABLED', '')

    expect(isLiveExpertRegistrationEnabled()).toBe(false)
    expect(isLegacyMentorApplicationAutoClaimEnabled()).toBe(false)
  })

  it('allows intake and access to be cut over independently', () => {
    vi.stubEnv('LEGACY_MENTOR_APPLICATION_INTAKE_ENABLED', 'false')
    vi.stubEnv('LEGACY_MENTOR_APPLICATION_ACCESS_ENABLED', 'true')

    expect(isLegacyMentorApplicationIntakeEnabled()).toBe(false)
    expect(isLegacyMentorApplicationAccessEnabled()).toBe(true)
  })
})
