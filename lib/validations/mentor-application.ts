import { z } from 'zod'

import { legalDocuments } from '@/lib/legal-documents'
import {
  MENTOR_AVAILABILITY_CADENCES,
  parseExpertiseList,
} from '@/lib/mentor-onboarding'

export const MENTOR_APPLICATION_LEGAL_VERSION = '2025-11'

const normalizedEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Enter a valid email address')
  .max(254)

export const requestMentorApplicationOtpSchema = z.object({
  email: normalizedEmailSchema,
})

export const verifyMentorApplicationOtpSchema = z.object({
  challengeId: z.string().uuid(),
  code: z.string().trim().regex(/^\d{6}$/, 'Enter the six-digit verification code'),
})

export const mentorApplicationDraftFieldsSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(/^\+\d{1,4}-\d{6,15}$/, 'Invalid phone number format'),
  countryId: z.string().trim().regex(/^\d+$/, 'Country is required'),
  stateId: z.string().trim().regex(/^\d+$/, 'State is required'),
  cityId: z.string().trim().regex(/^\d+$/, 'City is required'),
  title: z.string().trim().min(2).max(160),
  company: z.string().trim().min(2).max(160),
  industry: z.string().trim().min(1).max(160),
  expertise: z
    .string()
    .trim()
    .min(1, 'Expertise is required')
    .max(500)
    .refine(value => parseExpertiseList(value).length >= 5, {
      message: 'List at least five unique areas of expertise',
    })
    .refine(value => parseExpertiseList(value).length <= 25, {
      message: 'List no more than 25 areas of expertise',
    }),
  experience: z.coerce.number().int().min(2).max(80),
  hourlyRate: z
    .union([z.string(), z.number()])
    .transform(value => String(value).trim())
    .pipe(z.string().regex(/^\d{1,8}(\.\d{1,2})?$/, 'Enter a valid hourly rate'))
    .refine(value => Number(value) > 0, 'Hourly rate must be greater than zero'),
  about: z.string().trim().max(3000).optional().default(''),
  linkedinUrl: z
    .string()
    .trim()
    .url('Enter a valid LinkedIn URL')
    .refine(value => {
      const hostname = new URL(value).hostname.toLowerCase()
      return hostname === 'linkedin.com' || hostname.endsWith('.linkedin.com')
    }, 'Enter a LinkedIn URL'),
  availability: z.enum(MENTOR_AVAILABILITY_CADENCES),
})

// Drafts intentionally allow incomplete values. Final constraints live in
// mentorApplicationDraftFieldsSchema and are enforced at submission.
export const patchMentorApplicationSchema = z
  .object({
    fullName: z.string().trim().max(120).optional(),
    phone: z.string().trim().max(24).regex(/^[+\d-]*$/).optional(),
    phoneCountryCode: z.string().trim().max(5).regex(/^\+?\d{0,4}$/).optional(),
    countryId: z.string().trim().max(30).regex(/^\d*$/).optional(),
    stateId: z.string().trim().max(30).regex(/^\d*$/).optional(),
    cityId: z.string().trim().max(30).regex(/^\d*$/).optional(),
    title: z.string().trim().max(160).optional(),
    company: z.string().trim().max(160).optional(),
    industry: z.string().trim().max(160).optional(),
    expertise: z.string().trim().max(500).optional(),
    experience: z
      .union([z.literal(''), z.coerce.number().int().min(0).max(80)])
      .optional(),
    hourlyRate: z
      .string()
      .trim()
      .max(11)
      .regex(/^(?:$|\d{1,8}(?:\.\d{0,2})?)$/)
      .optional(),
    about: z.string().trim().max(3000).optional(),
    linkedinUrl: z.string().trim().max(2048).optional(),
    availability: z.union([z.literal(''), z.enum(MENTOR_AVAILABILITY_CADENCES)]).optional(),
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
  .length(legalDocuments.length)
  .superRefine((consents, context) => {
    const expectedVersions = new Map(
      legalDocuments.map(document => [document.id, document.version]),
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
