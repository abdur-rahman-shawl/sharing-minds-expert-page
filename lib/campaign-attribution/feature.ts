export function isCampaignAttributionEnabled(): boolean {
  return process.env.CAMPAIGN_ATTRIBUTION_ENABLED === 'true'
}

export function isPublicCampaignStatsEnabled(): boolean {
  return (
    isCampaignAttributionEnabled() &&
    process.env.PUBLIC_CAMPAIGN_STATS_ENABLED === 'true'
  )
}
