export const MENTOR_VERIFICATION_STATUSES = [
  'YET_TO_APPLY',
  'IN_PROGRESS',
  'VERIFIED',
  'REJECTED',
  'REVERIFICATION',
  'RESUBMITTED',
  'UPDATED_PROFILE',
] as const

export const MENTOR_SEARCH_MODES = ['AI_SEARCH', 'EXCLUSIVE_SEARCH'] as const
export const MENTOR_CREATION_SOURCES = ['SELF_REGISTERED', 'ADMIN_CREATED'] as const
export const MENTOR_AVAILABILITY_CADENCES = [
  'WEEKLY',
  'BIWEEKLY',
  'MONTHLY',
  'AS_NEEDED',
] as const

export const MENTOR_APPLICATION_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'IN_REVIEW',
  'CHANGES_REQUESTED',
  'RESUBMITTED',
  'APPROVED',
  'REJECTED',
  'WITHDRAWN',
] as const

export type MentorVerificationStatus = (typeof MENTOR_VERIFICATION_STATUSES)[number]
export type MentorSearchMode = (typeof MENTOR_SEARCH_MODES)[number]
export type MentorCreationSource = (typeof MENTOR_CREATION_SOURCES)[number]
export type MentorAvailabilityCadence = (typeof MENTOR_AVAILABILITY_CADENCES)[number]
export type MentorApplicationStatus = (typeof MENTOR_APPLICATION_STATUSES)[number]

export const SELF_REGISTERED_MENTOR_DEFAULTS = {
  verificationStatus: 'IN_PROGRESS',
  isVerified: false,
  paymentStatus: 'PENDING',
  isCouponCodeEnabled: false,
  isExpert: false,
  searchMode: 'AI_SEARCH',
  creationSource: 'SELF_REGISTERED',
} as const

export function parseExpertiseList(value: string): string[] {
  const uniqueItems = new Map<string, string>()

  for (const item of value.split(',')) {
    const expertise = item.trim().replace(/\s+/g, ' ')
    if (expertise) {
      uniqueItems.set(expertise.toLocaleLowerCase(), expertise)
    }
  }

  return Array.from(uniqueItems.values())
}

export function formatStoredExpertise(value: string | null): string {
  if (!value) return ''

  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
      return parsed.join(', ')
    }
  } catch {
    // Legacy records may contain a comma-separated string.
  }

  return value
}

export function normalizeMentorSearchValue(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/&/g, ' and ')
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

export function serializeMentorAvailability(cadence: MentorAvailabilityCadence): string {
  return JSON.stringify({ version: 1, cadence })
}

export function parseMentorAvailabilityCadence(
  value: string | null,
): MentorAvailabilityCadence | null {
  if (!value) return null

  const legacyCadences: Record<string, MentorAvailabilityCadence> = {
    Weekly: 'WEEKLY',
    BiWeekly: 'BIWEEKLY',
    Monthly: 'MONTHLY',
    AsNeeded: 'AS_NEEDED',
  }

  if (legacyCadences[value]) return legacyCadences[value]
  if (MENTOR_AVAILABILITY_CADENCES.some(cadence => cadence === value)) {
    return value as MentorAvailabilityCadence
  }

  try {
    const parsed = JSON.parse(value) as { cadence?: unknown }
    return typeof parsed.cadence === 'string'
      ? parseMentorAvailabilityCadence(parsed.cadence)
      : null
  } catch {
    return null
  }
}

export interface MentorStatusData {
  id: string
  registeredAt: string
  verificationStatus: MentorVerificationStatus
  verificationNotes: string | null
  fullName: string
  email: string
  isVerified: boolean | null
  isExpert: boolean
  paymentStatus: string
  searchMode: MentorSearchMode
  creationSource: MentorCreationSource
}

export interface MentorApplicationStatusData {
  id: string
  status: MentorApplicationStatus
  email: string
  verificationNotes: string | null
  submittedAt: string | null
  updatedAt: string
  mentorId: string | null
}

export interface MentorProfileData {
  id: string
  verificationStatus: MentorVerificationStatus
  fullName: string | null
  email: string | null
  phone: string | null
  title: string | null
  normalizedTitle: string | null
  company: string | null
  city: string | null
  state: string | null
  country: string | null
  industry: string | null
  industries: string[] | null
  normalizedIndustry: string | null
  expertise: string | null
  experience: number | null
  experienceBand: string | null
  employmentType: string | null
  about: string | null
  challengeSolved: string | null
  measurableOutcomes: string | null
  guidanceValueProposition: string | null
  credibilitySignals: string[] | null
  hasPriorMentoringExperience: boolean | null
  linkedinUrl: string | null
  githubUrl: string | null
  websiteUrl: string | null
  hourlyRate: string | null
  adminHourlyRateOverride: string | null
  currency: string | null
  availability: string | null
  weeklyAvailabilityBand: string | null
  preferredSessionMode: string | null
  serviceInterests: string[] | null
  languages: string[] | null
  headline: string | null
  maxMentees: number | null
  profileImageUrl: string | null
  bannerImageUrl: string | null
  resumeUrl: string | null
  isAvailable: boolean | null
  isVerified: boolean | null
  isExpert: boolean
  paymentStatus: string
  searchMode: MentorSearchMode
  creationSource: MentorCreationSource
  verificationNotes: string | null
  createdAt: string
  updatedAt: string
}

export function getMentorAccess(mentor: MentorStatusData) {
  const isVerificationComplete =
    mentor.verificationStatus === 'VERIFIED' && mentor.isVerified === true

  return {
    canAccessDashboard: isVerificationComplete,
    canAccessVipLounge: isVerificationComplete && mentor.isExpert,
  }
}
