import {
  CAMPAIGN_CLICK_ID_MAX_LENGTH,
  CAMPAIGN_VALUE_MAX_LENGTH,
} from './constants'

export type CampaignChannel =
  | 'DIRECT'
  | 'PAID'
  | 'EMAIL'
  | 'SOCIAL'
  | 'ORGANIC'
  | 'REFERRAL'
  | 'OTHER'

export type CampaignAcquisition = {
  channel: CampaignChannel
  source: string
  medium: string
  campaign: string | null
  content: string | null
  term: string | null
  referrerHost: string | null
  clickIdType: string | null
  clickId: string | null
  hasExplicitCampaign: boolean
  isDirect: boolean
}

const CLICK_ID_SOURCES = [
  ['gclid', 'google'],
  ['gbraid', 'google'],
  ['wbraid', 'google'],
  ['fbclid', 'facebook'],
  ['msclkid', 'microsoft_ads'],
  ['li_fat_id', 'linkedin'],
  ['ttclid', 'tiktok'],
] as const

function normalizeCampaignValue(value: string | null, maximumLength: number): string | null {
  if (!value) return null
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .slice(0, maximumLength)
  return normalized || null
}

function normalizeReferrerHost(referrer: string, requestOrigin: string): string | null {
  if (!referrer) return null

  try {
    const parsed = new URL(referrer)
    if (!['http:', 'https:'].includes(parsed.protocol)) return null
    if (parsed.origin === requestOrigin) return null
    return parsed.hostname.toLowerCase().replace(/^www\./, '').slice(0, 253) || null
  } catch {
    return null
  }
}

function channelFromMedium(medium: string | null): CampaignChannel {
  if (!medium) return 'OTHER'
  if (
    ['cpc', 'ppc', 'paid', 'paid_search', 'paid_social', 'display', 'affiliate'].includes(
      medium,
    )
  ) {
    return 'PAID'
  }
  if (['email', 'newsletter'].includes(medium)) return 'EMAIL'
  if (['social', 'organic_social'].includes(medium)) return 'SOCIAL'
  if (['organic', 'seo'].includes(medium)) return 'ORGANIC'
  if (['referral', 'partner'].includes(medium)) return 'REFERRAL'
  return 'OTHER'
}

function acquisitionFromReferrer(host: string): Pick<
  CampaignAcquisition,
  'channel' | 'source' | 'medium'
> {
  if (host === 'google.com' || host.startsWith('google.')) {
    return { channel: 'ORGANIC', source: 'google', medium: 'organic' }
  }
  if (host === 'bing.com' || host.endsWith('.bing.com')) {
    return { channel: 'ORGANIC', source: 'bing', medium: 'organic' }
  }
  if (host === 'duckduckgo.com' || host.endsWith('.duckduckgo.com')) {
    return { channel: 'ORGANIC', source: 'duckduckgo', medium: 'organic' }
  }
  if (host === 'search.yahoo.com') {
    return { channel: 'ORGANIC', source: 'yahoo', medium: 'organic' }
  }

  const socialSources: Array<[RegExp, string]> = [
    [/(^|\.)linkedin\.com$/, 'linkedin'],
    [/(^|\.)facebook\.com$/, 'facebook'],
    [/(^|\.)instagram\.com$/, 'instagram'],
    [/(^|\.)tiktok\.com$/, 'tiktok'],
    [/(^|\.)x\.com$|^t\.co$/, 'x'],
    [/(^|\.)youtube\.com$|^youtu\.be$/, 'youtube'],
  ]
  const social = socialSources.find(([pattern]) => pattern.test(host))
  if (social) {
    return { channel: 'SOCIAL', source: social[1], medium: 'social' }
  }

  return { channel: 'REFERRAL', source: host, medium: 'referral' }
}

export function parseCampaignAcquisition(input: {
  search: string
  referrer: string
  requestOrigin: string
}): CampaignAcquisition {
  const search = input.search.startsWith('?') ? input.search.slice(1) : input.search
  const params = new URLSearchParams(search.slice(0, 2_000))
  let source = normalizeCampaignValue(
    params.get('utm_source'),
    CAMPAIGN_VALUE_MAX_LENGTH,
  )
  let medium = normalizeCampaignValue(
    params.get('utm_medium'),
    CAMPAIGN_VALUE_MAX_LENGTH,
  )
  const campaign = normalizeCampaignValue(
    params.get('utm_campaign'),
    CAMPAIGN_VALUE_MAX_LENGTH,
  )
  const content = normalizeCampaignValue(
    params.get('utm_content'),
    CAMPAIGN_VALUE_MAX_LENGTH,
  )
  const term = normalizeCampaignValue(
    params.get('utm_term'),
    CAMPAIGN_VALUE_MAX_LENGTH,
  )
  const referrerHost = normalizeReferrerHost(input.referrer, input.requestOrigin)

  let clickIdType: string | null = null
  let clickId: string | null = null
  for (const [parameter, inferredSource] of CLICK_ID_SOURCES) {
    const value = params.get(parameter)?.trim().slice(0, CAMPAIGN_CLICK_ID_MAX_LENGTH)
    if (!value) continue
    clickIdType = parameter
    clickId = value
    source ||= inferredSource
    medium ||= 'paid'
    break
  }

  const hasExplicitCampaign = Boolean(
    source || medium || campaign || content || term || clickId,
  )
  if (hasExplicitCampaign) {
    const resolvedSource = source || 'unknown'
    const resolvedMedium = medium || 'unknown'
    return {
      channel: channelFromMedium(resolvedMedium),
      source: resolvedSource,
      medium: resolvedMedium,
      campaign,
      content,
      term,
      referrerHost,
      clickIdType,
      clickId,
      hasExplicitCampaign: true,
      isDirect: false,
    }
  }

  if (referrerHost) {
    const referral = acquisitionFromReferrer(referrerHost)
    return {
      ...referral,
      campaign: null,
      content: null,
      term: null,
      referrerHost,
      clickIdType: null,
      clickId: null,
      hasExplicitCampaign: false,
      isDirect: false,
    }
  }

  return {
    channel: 'DIRECT',
    source: 'direct',
    medium: 'none',
    campaign: null,
    content: null,
    term: null,
    referrerHost: null,
    clickIdType: null,
    clickId: null,
    hasExplicitCampaign: false,
    isDirect: true,
  }
}

export function campaignAcquisitionMatches(
  current: Pick<
    CampaignAcquisition,
    'source' | 'medium' | 'campaign' | 'content' | 'term' | 'clickIdType' | 'clickId'
  >,
  incoming: CampaignAcquisition,
): boolean {
  return (
    current.source === incoming.source &&
    current.medium === incoming.medium &&
    current.campaign === incoming.campaign &&
    current.content === incoming.content &&
    current.term === incoming.term &&
    current.clickIdType === incoming.clickIdType &&
    current.clickId === incoming.clickId
  )
}
