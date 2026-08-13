export function isLiveExpertRegistrationEnabled(): boolean {
  return process.env.EXPERT_REGISTRATION_V3_ENABLED === 'true'
}

export function isLegacyMentorApplicationIntakeEnabled(): boolean {
  return process.env.LEGACY_MENTOR_APPLICATION_INTAKE_ENABLED !== 'false'
}

export function isLegacyMentorApplicationAccessEnabled(): boolean {
  return process.env.LEGACY_MENTOR_APPLICATION_ACCESS_ENABLED !== 'false'
}

export function isLegacyMentorApplicationAutoClaimEnabled(): boolean {
  return process.env.LEGACY_MENTOR_APPLICATION_AUTO_CLAIM_ENABLED === 'true'
}
