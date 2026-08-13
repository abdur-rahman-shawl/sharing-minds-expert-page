import { describe, expect, it } from 'vitest'

import { applicationConsentRequirements } from '@/lib/legal-documents'
import {
  mentorApplicationConsentsSchema,
  mentorApplicationDraftFieldsSchema,
  patchMentorApplicationSchema,
} from './mentor-application'

const validApplication = {
  fullName: 'Asha Rao',
  phone: '+91-9876543210',
  countryId: '101',
  stateId: '22',
  cityId: '33',
  professionalHeadline: 'Product leader helping early-stage teams scale',
  title: 'Product Consultant',
  company: 'Independent',
  websiteUrl: '',
  employmentType: 'CONSULTANT',
  experienceBand: 'YEARS_3_5',
  industries: ['TECHNOLOGY'],
  otherIndustry: '',
  expertise: ['PRODUCT', 'STARTUP_GROWTH'],
  otherExpertise: '',
  about: 'I have built and launched products with multidisciplinary teams.',
  challengeSolved: 'I help teams validate product direction before scaling execution.',
  measurableOutcomes: 'I have improved activation and reduced avoidable product rework.',
  guidanceValueProposition: 'I bring context-specific judgment and accountable follow-through.',
  credibilitySignals: ['CONSULTANT'],
  linkedinUrl: 'https://www.linkedin.com/in/asha-rao',
  serviceInterests: ['STARTUP_ADVISORY'],
  preferredSessionMode: 'ONLINE',
  languages: ['ENGLISH'],
  otherLanguage: '',
  weeklyAvailabilityBand: 'HOURS_1_2',
}

describe('mentor application validation boundaries', () => {
  it('allows incomplete and cleared autosave fields', () => {
    const result = patchMentorApplicationSchema.safeParse({
      fullName: '',
      phone: '',
      phoneCountryCode: '',
      professionalHeadline: '',
      industries: [],
      expertise: [],
    })

    expect(result.success).toBe(true)
  })

  it('keeps final submission validation strict', () => {
    expect(
      mentorApplicationDraftFieldsSchema.safeParse({ fullName: 'A' }).success,
    ).toBe(false)
  })

  it('accepts an expert with fewer than ten years of experience', () => {
    const result = mentorApplicationDraftFieldsSchema.safeParse(validApplication)

    expect(result.success).toBe(true)
  })

  it('normalizes a LinkedIn URL entered without a protocol', () => {
    const result = mentorApplicationDraftFieldsSchema.safeParse({
      ...validApplication,
      linkedinUrl: 'www.linkedin.com/something',
      websiteUrl: 'asha.example.com',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.linkedinUrl).toBe('https://www.linkedin.com/something')
      expect(result.data.websiteUrl).toBe('https://asha.example.com')
    }
  })

  it('reports malformed and lookalike LinkedIn URLs without throwing', () => {
    let malformedResult: ReturnType<typeof mentorApplicationDraftFieldsSchema.safeParse>
    expect(() => {
      malformedResult = mentorApplicationDraftFieldsSchema.safeParse({
        ...validApplication,
        linkedinUrl: 'not a url',
      })
    }).not.toThrow()
    expect(malformedResult!.success).toBe(false)
    if (!malformedResult!.success) {
      expect(malformedResult!.error.flatten().fieldErrors.linkedinUrl?.[0]).toBe(
        'Enter a valid LinkedIn URL',
      )
    }

    const lookalikeResult = mentorApplicationDraftFieldsSchema.safeParse({
      ...validApplication,
      linkedinUrl: 'https://linkedin.com.attacker.example/profile',
    })
    expect(lookalikeResult.success).toBe(false)
    if (!lookalikeResult.success) {
      expect(lookalikeResult.error.flatten().fieldErrors.linkedinUrl?.[0]).toBe(
        'Enter a LinkedIn URL',
      )
    }
  })

  it('rejects more than five expertise selections', () => {
    const result = mentorApplicationDraftFieldsSchema.safeParse({
      ...validApplication,
      expertise: [
        'PRODUCT',
        'STARTUP_GROWTH',
        'TECHNOLOGY',
        'INNOVATION',
        'LEADERSHIP',
        'BUSINESS_STRATEGY',
      ],
    })

    expect(result.success).toBe(false)
  })

  it('does not collect the removed mentoring and misconduct screening fields', () => {
    expect(
      patchMentorApplicationSchema.safeParse({
        hasPriorMentoringExperience: true,
      }).success,
    ).toBe(false)
    expect(
      patchMentorApplicationSchema.safeParse({
        hasProfessionalMisconduct: false,
      }).success,
    ).toBe(false)
  })

  it('accepts every current legal document exactly at its current version', () => {
    const result = mentorApplicationConsentsSchema.safeParse(
      applicationConsentRequirements.map(document => ({
        documentId: document.id,
        version: document.version,
        accepted: true,
      })),
    )

    expect(result.success).toBe(true)
  })

  it('rejects stale legal document versions', () => {
    const consents: Array<{
      documentId: string
      version: string
      accepted: true
    }> = applicationConsentRequirements.map(document => ({
      documentId: document.id,
      version: document.version,
      accepted: true as const,
    }))
    consents[0] = { ...consents[0], version: 'stale-version' }

    expect(mentorApplicationConsentsSchema.safeParse(consents).success).toBe(false)
  })
})
