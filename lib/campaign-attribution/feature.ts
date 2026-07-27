export function isCampaignAttributionEnabled(): boolean {
  return process.env.CAMPAIGN_ATTRIBUTION_ENABLED === 'true'
}
