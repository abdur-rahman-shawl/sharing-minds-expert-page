import { describe, expect, it } from 'vitest'

import {
  campaignAcquisitionMatches,
  parseCampaignAcquisition,
} from './params'

describe('campaign attribution parameters', () => {
  it('normalizes standard UTM values and preserves the campaign dimensions', () => {
    const result = parseCampaignAcquisition({
      search:
        '?utm_source=LinkedIn&utm_medium=Paid%20Social&utm_campaign=Founding%20Experts%20Q3&utm_content=Founder%20Video%2001&utm_term=Leadership',
      referrer: 'https://www.linkedin.com/feed/',
      requestOrigin: 'https://experts.sharingminds.com',
    })

    expect(result).toMatchObject({
      channel: 'PAID',
      source: 'linkedin',
      medium: 'paid_social',
      campaign: 'founding_experts_q3',
      content: 'founder_video_01',
      term: 'leadership',
      referrerHost: 'linkedin.com',
      hasExplicitCampaign: true,
      isDirect: false,
    })
  })

  it('infers paid sources from supported click identifiers', () => {
    const result = parseCampaignAcquisition({
      search: '?gclid=opaque-google-click',
      referrer: '',
      requestOrigin: 'https://experts.sharingminds.com',
    })

    expect(result).toMatchObject({
      channel: 'PAID',
      source: 'google',
      medium: 'paid',
      clickIdType: 'gclid',
      clickId: 'opaque-google-click',
    })
  })

  it('classifies external referrals and same-origin navigation correctly', () => {
    expect(
      parseCampaignAcquisition({
        search: '',
        referrer: 'https://partner.example/path?private=value',
        requestOrigin: 'https://experts.sharingminds.com',
      }),
    ).toMatchObject({
      channel: 'REFERRAL',
      source: 'partner.example',
      medium: 'referral',
      referrerHost: 'partner.example',
    })

    expect(
      parseCampaignAcquisition({
        search: '',
        referrer: 'https://experts.sharingminds.com/',
        requestOrigin: 'https://experts.sharingminds.com',
      }),
    ).toMatchObject({
      channel: 'DIRECT',
      source: 'direct',
      medium: 'none',
      referrerHost: null,
    })
  })

  it('recognizes untagged search and social referrers', () => {
    expect(
      parseCampaignAcquisition({
        search: '',
        referrer: 'https://www.google.co.in/search?q=expert+mentor',
        requestOrigin: 'https://experts.sharingminds.com',
      }),
    ).toMatchObject({
      channel: 'ORGANIC',
      source: 'google',
      medium: 'organic',
    })

    expect(
      parseCampaignAcquisition({
        search: '',
        referrer: 'https://www.linkedin.com/feed/',
        requestOrigin: 'https://experts.sharingminds.com',
      }),
    ).toMatchObject({
      channel: 'SOCIAL',
      source: 'linkedin',
      medium: 'social',
    })
  })

  it('compares every campaign dimension before reusing an active visit', () => {
    const first = parseCampaignAcquisition({
      search:
        '?utm_source=linkedin&utm_medium=paid_social&utm_campaign=experts&utm_content=video_a',
      referrer: '',
      requestOrigin: 'https://experts.sharingminds.com',
    })
    const second = parseCampaignAcquisition({
      search:
        '?utm_source=linkedin&utm_medium=paid_social&utm_campaign=experts&utm_content=video_b',
      referrer: '',
      requestOrigin: 'https://experts.sharingminds.com',
    })

    expect(campaignAcquisitionMatches(first, first)).toBe(true)
    expect(campaignAcquisitionMatches(first, second)).toBe(false)
  })
})
