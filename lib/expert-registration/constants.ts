export const LIVE_EXPERT_REGISTRATION_SCHEMA_VERSION = 3

export function resolveExpertRegistrationDraftCookieName(input: {
  configuredName?: string
  isProduction: boolean
}): string {
  const configuredName = input.configuredName?.trim()
  if (configuredName) return configuredName

  // Browsers reject a __Secure- cookie unless the Secure attribute is set.
  // Local HTTP development therefore needs an unprefixed name, while the
  // production default keeps the stronger browser-enforced prefix.
  return input.isProduction
    ? '__Secure-sharingminds-expert-registration-draft'
    : 'sharingminds-expert-registration-draft'
}

export const EXPERT_REGISTRATION_DRAFT_COOKIE =
  resolveExpertRegistrationDraftCookieName({
    configuredName: process.env.EXPERT_REGISTRATION_DRAFT_COOKIE_NAME,
    isProduction: process.env.NODE_ENV === 'production',
  })

export const EXPERT_REGISTRATION_DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000
export const EXPERT_REGISTRATION_DRAFT_COOKIE_PATH = '/'

export const LIVE_EXPERT_REGISTRATION_SOURCE =
  'LIVE_EXPERT_REGISTRATION' as const
