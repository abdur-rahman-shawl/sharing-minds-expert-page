import { z } from 'zod'

import { applicationConsentRequirements } from '@/lib/legal-documents'
import {
  CREDIBILITY_SIGNAL_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  EXPERIENCE_BAND_OPTIONS,
  EXPERTISE_OPTIONS,
  INDUSTRY_OPTIONS,
  LANGUAGE_OPTIONS,
  optionValues,
  SERVICE_INTEREST_OPTIONS,
  SESSION_MODE_OPTIONS,
  WEEKLY_AVAILABILITY_OPTIONS,
} from '@/lib/mentor-application-options'

export const MENTOR_APPLICATION_LEGAL_VERSION = '2025-11'
export const MENTOR_APPLICATION_SCHEMA_VERSION = 2
export const MENTOR_APPLICATION_LONG_ANSWER_MAX_LENGTH = 1500
export const MENTOR_APPLICATION_PHONE_LENGTH = 10

const employmentTypes = optionValues(EMPLOYMENT_TYPE_OPTIONS)
const experienceBands = optionValues(EXPERIENCE_BAND_OPTIONS)
const industries = optionValues(INDUSTRY_OPTIONS)
const expertiseAreas = optionValues(EXPERTISE_OPTIONS)
const credibilitySignals = optionValues(CREDIBILITY_SIGNAL_OPTIONS)
const serviceInterests = optionValues(SERVICE_INTEREST_OPTIONS)
const sessionModes = optionValues(SESSION_MODE_OPTIONS)
const languages = optionValues(LANGUAGE_OPTIONS)
const weeklyAvailabilityBands = optionValues(WEEKLY_AVAILABILITY_OPTIONS)

const normalizedEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Enter a valid email address')
  .max(254)

function normalizeHttpUrl(value: string) {
  const trimmedValue = value.trim()
  if (!trimmedValue || /^[a-z][a-z\d+.-]*:\/\//i.test(trimmedValue)) {
    return trimmedValue
  }

  return `https://${trimmedValue}`
}

function parseHttpUrl(value: string) {
  // Browsers may percent-encode whitespace in hostnames while Node rejects it.
  // Reject whitespace first so shared client/server validation stays deterministic.
  if (/\s/.test(value)) return null

  try {
    const parsedUrl = new URL(value)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
      ? parsedUrl
      : null
  } catch {
    return null
  }
}

const optionalUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .transform(value => (value ? normalizeHttpUrl(value) : ''))
  .refine(value => !value || Boolean(parseHttpUrl(value)), 'Enter a valid URL')

const linkedinUrlSchema = z
  .string()
  .trim()
  .min(1, 'LinkedIn profile is required')
  .max(2048)
  .transform(normalizeHttpUrl)
  .superRefine((value, context) => {
    const parsedUrl = parseHttpUrl(value)
    if (!parsedUrl) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid LinkedIn URL',
      })
      return
    }

    const hostname = parsedUrl.hostname.toLowerCase()
    if (hostname !== 'linkedin.com' && !hostname.endsWith('.linkedin.com')) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a LinkedIn URL',
      })
    }
  })

export const requestMentorApplicationOtpSchema = z.object({
  email: normalizedEmailSchema,
})

export const verifyMentorApplicationOtpSchema = z.object({
  challengeId: z.string().uuid(),
  code: z.string().trim().regex(/^\d{6}$/, 'Enter the six-digit verification code'),
})

const mentorApplicationV2Fields = {
  fullName: z.string().trim().min(2, 'Full name is required').max(120),
  phone: z
    .string()
    .trim()
    .regex(/^\+\d{1,4}-\d{10}$/, 'Enter a 10-digit mobile number'),
  countryId: z.string().trim().regex(/^\d+$/, 'Country is required'),
  stateId: z.string().trim().regex(/^\d+$/, 'State is required'),
  cityId: z.string().trim().regex(/^\d+$/, 'City is required'),
  professionalHeadline: z
    .string()
    .trim()
    .min(2, 'Professional headline is required')
    .max(160),
  title: z.string().trim().min(2, 'Current designation is required').max(160),
  company: z.string().trim().min(2, 'Current organization is required').max(160),
  websiteUrl: optionalUrlSchema,
  employmentType: z.enum(employmentTypes, {
    required_error: 'Employment type is required',
  }),
  experienceBand: z.enum(experienceBands, {
    required_error: 'Experience range is required',
  }),
  industries: z
    .array(z.enum(industries))
    .min(1, 'Select at least one industry')
    .max(10, 'Select no more than 10 industries'),
  otherIndustry: z.string().trim().max(160),
  expertise: z
    .array(z.enum(expertiseAreas))
    .min(1, 'Select at least one area of expertise')
    .max(5, 'Select no more than five areas of expertise'),
  otherExpertise: z.string().trim().max(160),
  about: z
    .string()
    .trim()
    .min(20, 'Tell us a little more about your professional journey')
    .max(
      MENTOR_APPLICATION_LONG_ANSWER_MAX_LENGTH,
      'Professional journey must not exceed 1,500 characters',
    ),
  challengeSolved: z
    .string()
    .trim()
    .min(20, 'Describe one challenge people seek your guidance on')
    .max(MENTOR_APPLICATION_LONG_ANSWER_MAX_LENGTH),
  measurableOutcomes: z
    .string()
    .trim()
    .min(20, 'Describe the measurable outcomes you have contributed to')
    .max(MENTOR_APPLICATION_LONG_ANSWER_MAX_LENGTH),
  guidanceValueProposition: z
    .string()
    .trim()
    .min(20, 'Explain what makes your guidance distinctive')
    .max(MENTOR_APPLICATION_LONG_ANSWER_MAX_LENGTH),
  credibilitySignals: z.array(z.enum(credibilitySignals)).max(14),
  linkedinUrl: linkedinUrlSchema,
  serviceInterests: z
    .array(z.enum(serviceInterests))
    .min(1, 'Select at least one mentoring interest'),
  preferredSessionMode: z.enum(sessionModes, {
    errorMap: () => ({ message: 'Please select a preferred session mode' }),
  }),
  languages: z.array(z.enum(languages)).min(1, 'Select at least one language'),
  otherLanguage: z.string().trim().max(100),
  weeklyAvailabilityBand: z.enum(weeklyAvailabilityBands, {
    errorMap: () => ({ message: 'Please select your weekly availability' }),
  }),
}

export const mentorApplicationDraftFieldsSchema = z
  .object(mentorApplicationV2Fields)
  .superRefine((value, context) => {
    if (value.industries.includes('OTHER') && !value.otherIndustry) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['otherIndustry'],
        message: 'Specify the other industry',
      })
    }
    if (value.expertise.includes('OTHER') && !value.otherExpertise) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['otherExpertise'],
        message: 'Specify the other area of expertise',
      })
    }
    if (value.languages.includes('OTHER') && !value.otherLanguage) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['otherLanguage'],
        message: 'Specify the other language',
      })
    }
  })

// Autosave accepts incomplete values while still rejecting unknown option keys
// and over-sized payloads. Final constraints are enforced by the schema above.
export const patchMentorApplicationSchema = z
  .object({
    fullName: z.string().trim().max(120).optional(),
    phone: z.string().trim().max(24).regex(/^[+\d-]*$/).optional(),
    phoneCountryCode: z.string().trim().max(5).regex(/^\+?\d{0,4}$/).optional(),
    countryId: z.string().trim().max(30).regex(/^\d*$/).optional(),
    stateId: z.string().trim().max(30).regex(/^\d*$/).optional(),
    cityId: z.string().trim().max(30).regex(/^\d*$/).optional(),
    professionalHeadline: z.string().trim().max(160).optional(),
    title: z.string().trim().max(160).optional(),
    company: z.string().trim().max(160).optional(),
    websiteUrl: z.string().trim().max(2048).optional(),
    employmentType: z.union([z.literal(''), z.enum(employmentTypes)]).optional(),
    experienceBand: z.union([z.literal(''), z.enum(experienceBands)]).optional(),
    industries: z.array(z.enum(industries)).max(10).optional(),
    otherIndustry: z.string().trim().max(160).optional(),
    expertise: z.array(z.enum(expertiseAreas)).max(5).optional(),
    otherExpertise: z.string().trim().max(160).optional(),
    about: z.string().trim().max(MENTOR_APPLICATION_LONG_ANSWER_MAX_LENGTH).optional(),
    challengeSolved: z
      .string()
      .trim()
      .max(MENTOR_APPLICATION_LONG_ANSWER_MAX_LENGTH)
      .optional(),
    measurableOutcomes: z
      .string()
      .trim()
      .max(MENTOR_APPLICATION_LONG_ANSWER_MAX_LENGTH)
      .optional(),
    guidanceValueProposition: z
      .string()
      .trim()
      .max(MENTOR_APPLICATION_LONG_ANSWER_MAX_LENGTH)
      .optional(),
    credibilitySignals: z.array(z.enum(credibilitySignals)).max(14).optional(),
    linkedinUrl: z.string().trim().max(2048).optional(),
    serviceInterests: z.array(z.enum(serviceInterests)).max(11).optional(),
    preferredSessionMode: z.union([z.literal(''), z.enum(sessionModes)]).optional(),
    languages: z.array(z.enum(languages)).max(17).optional(),
    otherLanguage: z.string().trim().max(100).optional(),
    weeklyAvailabilityBand: z
      .union([z.literal(''), z.enum(weeklyAvailabilityBands)])
      .optional(),
  })
  .strict()
  .refine(value => Object.keys(value).length > 0, 'At least one field is required')

export const mentorApplicationConsentSchema = z.object({
  documentId: z.string().trim().min(1).max(100),
  version: z.string().trim().min(1).max(50),
  accepted: z.literal(true),
})

export const mentorApplicationConsentsSchema = z
  .array(mentorApplicationConsentSchema)
  .length(applicationConsentRequirements.length)
  .superRefine((consents, context) => {
    const expectedVersions = new Map(
      applicationConsentRequirements.map(document => [document.id, document.version]),
    )
    const receivedIds = new Set(consents.map(consent => consent.documentId))

    if (
      receivedIds.size !== expectedVersions.size ||
      Array.from(expectedVersions).some(
        ([documentId, version]) =>
          !receivedIds.has(documentId) ||
          !consents.some(
            consent =>
              consent.documentId === documentId && consent.version === version,
          ),
      )
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'All current legal documents must be accepted',
      })
    }
  })

export type MentorApplicationDraftInput = z.infer<
  typeof mentorApplicationDraftFieldsSchema
>
export type MentorApplicationPatchInput = z.infer<typeof patchMentorApplicationSchema>
export type MentorApplicationConsentInput = z.infer<
  typeof mentorApplicationConsentSchema
>
