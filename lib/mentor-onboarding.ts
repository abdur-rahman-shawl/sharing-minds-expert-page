import { z } from 'zod'

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

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_RESUME_SIZE = 5 * 1024 * 1024
const PROFILE_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const RESUME_TYPES = ['application/pdf']

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

export const mentorApplicationFieldsSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(120),
  email: z.string().trim().toLowerCase().email('Invalid email address').max(254),
  phone: z
    .string()
    .trim()
    .regex(/^\+\d{1,4}-\d{6,15}$/, 'Invalid phone number format'),
  country: z.string().trim().regex(/^\d+$/, 'Country is required'),
  state: z.string().trim().regex(/^\d+$/, 'State is required'),
  city: z.string().trim().regex(/^\d+$/, 'City is required'),
  title: z.string().trim().min(2, 'Job title must be at least 2 characters').max(160),
  company: z.string().trim().min(2, 'Company name must be at least 2 characters').max(160),
  industry: z.string().trim().min(1, 'Industry is required').max(160),
  expertise: z
    .string()
    .trim()
    .min(1, 'Expertise is required')
    .max(500, 'Expertise must not exceed 500 characters')
    .refine(
      value => parseExpertiseList(value).length >= 5,
      'Please list at least 5 unique areas of expertise, separated by commas.',
    )
    .refine(
      value => parseExpertiseList(value).length <= 25,
      'Please list no more than 25 areas of expertise.',
    ),
  experience: z
    .string()
    .trim()
    .regex(/^\d{1,2}$/, 'Experience must be a whole number')
    .refine(value => Number(value) >= 2, 'Minimum 2 years of experience required')
    .refine(value => Number(value) <= 80, 'Experience must not exceed 80 years'),
  hourlyRate: z
    .string()
    .trim()
    .regex(/^\d{1,8}(\.\d{1,2})?$/, 'Enter a valid hourly rate with up to 2 decimals')
    .refine(value => Number(value) > 0, 'Hourly rate must be greater than zero'),
  about: z.string().trim().max(3000, 'About must not exceed 3000 characters').optional(),
  linkedinUrl: z
    .string()
    .trim()
    .url('Invalid LinkedIn URL')
    .refine(value => {
      try {
        const hostname = new URL(value).hostname.toLocaleLowerCase()
        return hostname === 'linkedin.com' || hostname.endsWith('.linkedin.com')
      } catch {
        return false
      }
    }, 'Must be a LinkedIn URL'),
  availability: z.enum(MENTOR_AVAILABILITY_CADENCES, {
    required_error: 'Availability is required',
  }),
})

const isFile = (value: unknown): value is File =>
  typeof File !== 'undefined' && value instanceof File

export const mentorApplicationSchema = mentorApplicationFieldsSchema.extend({
  otherIndustry: z.string().trim().max(160).optional(),
  profilePicture: z
    .custom<File>(isFile, 'Profile picture is required')
    .refine(file => file.size > 0, 'Profile picture is required')
    .refine(file => file.size <= MAX_PROFILE_IMAGE_SIZE, 'Profile picture must be less than 5MB')
    .refine(file => PROFILE_IMAGE_TYPES.includes(file.type), 'Use a JPEG, PNG, or WebP image'),
  resume: z
    .custom<File>(value => value === null || value === undefined || isFile(value), 'Resume must be a file')
    .refine(file => !file || file.size <= MAX_RESUME_SIZE, 'Resume must be less than 5MB')
    .refine(file => !file || RESUME_TYPES.includes(file.type), 'Use a PDF, DOC, or DOCX resume')
    .optional()
    .nullable(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
})

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
  normalizedIndustry: string | null
  expertise: string | null
  experience: number | null
  about: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  websiteUrl: string | null
  hourlyRate: string | null
  adminHourlyRateOverride: string | null
  currency: string | null
  availability: string | null
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

export type MentorApplicationData = z.infer<typeof mentorApplicationSchema>
