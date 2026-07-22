import { describe, expect, it } from 'vitest'

import { getSafeRedirectPath } from './safe-redirect'

describe('getSafeRedirectPath', () => {
  it('preserves internal paths, queries, and fragments', () => {
    expect(getSafeRedirectPath('/verified-experts?step=status#application')).toBe(
      '/verified-experts?step=status#application',
    )
  })

  it.each([
    'https://attacker.example/path',
    '//attacker.example/path',
    'javascript:alert(1)',
    'verified-experts',
    null,
  ])('rejects unsafe redirect candidate %s', candidate => {
    expect(getSafeRedirectPath(candidate)).toBe('/')
  })
})
