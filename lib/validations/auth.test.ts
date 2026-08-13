import { describe, expect, it } from 'vitest'

import { passwordValidation, signUpSchema } from './auth'

describe('email account validation', () => {
  it('requires a practical password length with letters and numbers', () => {
    expect(passwordValidation.safeParse('short1').success).toBe(false)
    expect(passwordValidation.safeParse('onlyletters').success).toBe(false)
    expect(passwordValidation.safeParse('12345678').success).toBe(false)
    expect(passwordValidation.safeParse('SecurePassphrase1').success).toBe(true)
    expect(passwordValidation.safeParse(`A1${'x'.repeat(127)}`).success).toBe(false)
  })

  it('requires password confirmation to match', () => {
    const result = signUpSchema.safeParse({
      name: 'Asha Rao',
      email: 'asha@example.com',
      password: 'SecurePassphrase1',
      confirmPassword: 'SecurePassphrase2',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['confirmPassword'])
    }
  })

  it('normalizes email addresses before authentication', () => {
    const result = signUpSchema.safeParse({
      name: 'Asha Rao',
      email: '  ASHA@Example.COM  ',
      password: 'SecurePassphrase1',
      confirmPassword: 'SecurePassphrase1',
    })

    expect(result.success).toBe(true)
    if (result.success) expect(result.data.email).toBe('asha@example.com')
  })
})
