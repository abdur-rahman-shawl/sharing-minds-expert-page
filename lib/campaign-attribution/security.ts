import 'server-only'

import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

let warnedAboutDevelopmentSecretFallback = false

function getCampaignAttributionSecret(): string {
  const explicitSecret = process.env.CAMPAIGN_ATTRIBUTION_SECRET
  const developmentFallback =
    process.env.NODE_ENV === 'production' ? undefined : process.env.BETTER_AUTH_SECRET
  const secret = explicitSecret || developmentFallback

  if (!secret || secret.length < 32) {
    throw new Error(
      'CAMPAIGN_ATTRIBUTION_SECRET must be configured with at least 32 characters',
    )
  }

  if (!explicitSecret && !warnedAboutDevelopmentSecretFallback) {
    warnedAboutDevelopmentSecretFallback = true
    console.warn(
      '[campaign-attribution] Development only: signed cookies are using BETTER_AUTH_SECRET',
    )
  }

  return secret
}
function signatureFor(value: string): string {
  return createHmac('sha256', getCampaignAttributionSecret())
    .update(`sharingminds-campaign-attribution:v1:${value}`, 'utf8')
    .digest('base64url')
}

export function createCampaignIdentifier(): string {
  return randomUUID()
}

export function signCampaignIdentifier(value: string): string {
  return `${value}.${signatureFor(value)}`
}

export function readSignedCampaignIdentifier(value: string | undefined): string | null {
  if (!value || value.length > 128) return null
  const separator = value.indexOf('.')
  if (separator <= 0) return null

  const identifier = value.slice(0, separator)
  const signature = value.slice(separator + 1)
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    identifier,
  )) {
    return null
  }

  const expected = Buffer.from(signatureFor(identifier))
  const actual = Buffer.from(signature)
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null
  }
  return identifier
}
