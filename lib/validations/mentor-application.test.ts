import { describe, expect, it } from 'vitest'

import { legalDocuments } from '@/lib/legal-documents'
import {
  mentorApplicationConsentsSchema,
  mentorApplicationDraftFieldsSchema,
  patchMentorApplicationSchema,
} from './mentor-application'

describe('mentor application validation boundaries', () => {
  it('allows incomplete and cleared autosave fields', () => {
    const result = patchMentorApplicationSchema.safeParse({
      fullName: '',
      phone: '',
      phoneCountryCode: '',
      professionalHeadline: '',
      industries: [],
      expertise: [],
      hasPriorMentoringExperience: null,
    })

    expect(result.success).toBe(true)
  })

  it('keeps final submission validation strict', () => {
    expect(
      mentorApplicationDraftFieldsSchema.safeParse({ fullName: 'A' }).success,
    ).toBe(false)
  })

  it('accepts an expert with fewer than ten years of experience', () => {
    const result = mentorApplicationDraftFieldsSchema.safeParse({
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
      hasPriorMentoringExperience: false,
      hasProfessionalMisconduct: false,
      misconductExplanation: '',
    })

    expect(result.success).toBe(true)
  })

  it('rejects more than five expertise selections', () => {
    const result = mentorApplicationDraftFieldsSchema.safeParse({
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
      expertise: [
        'PRODUCT',
        'STARTUP_GROWTH',
        'TECHNOLOGY',
        'INNOVATION',
        'LEADERSHIP',
        'BUSINESS_STRATEGY',
      ],
      otherExpertise: '',
      about: 'I have built and launched products with multidisciplinary teams.',
      challengeSolved: 'I help teams validate product direction before scaling execution.',
      measurableOutcomes: 'I have improved activation and reduced avoidable product rework.',
      guidanceValueProposition: 'I bring context-specific judgment and accountable follow-through.',
      credibilitySignals: [],
      linkedinUrl: 'https://www.linkedin.com/in/asha-rao',
      serviceInterests: ['STARTUP_ADVISORY'],
      preferredSessionMode: 'ONLINE',
      languages: ['ENGLISH'],
      otherLanguage: '',
      weeklyAvailabilityBand: 'HOURS_1_2',
      hasPriorMentoringExperience: false,
      hasProfessionalMisconduct: false,
      misconductExplanation: '',
    })

    expect(result.success).toBe(false)
  })

  it('requires an explanation when misconduct is reported', () => {
    const partial = patchMentorApplicationSchema.safeParse({
      hasProfessionalMisconduct: true,
      misconductExplanation: '',
    })
    expect(partial.success).toBe(true)

    const result = mentorApplicationDraftFieldsSchema.safeParse({
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
      expertise: ['PRODUCT'],
      otherExpertise: '',
      about: 'I have built and launched products with multidisciplinary teams.',
      challengeSolved: 'I help teams validate product direction before scaling execution.',
      measurableOutcomes: 'I have improved activation and reduced avoidable product rework.',
      guidanceValueProposition: 'I bring context-specific judgment and accountable follow-through.',
      credibilitySignals: [],
      linkedinUrl: 'https://www.linkedin.com/in/asha-rao',
      serviceInterests: ['STARTUP_ADVISORY'],
      preferredSessionMode: 'ONLINE',
      languages: ['ENGLISH'],
      otherLanguage: '',
      weeklyAvailabilityBand: 'HOURS_1_2',
      hasPriorMentoringExperience: false,
      hasProfessionalMisconduct: true,
      misconductExplanation: '',
    })

    expect(result.success).toBe(false)
  })

  it('accepts every current legal document exactly at its current version', () => {
    const result = mentorApplicationConsentsSchema.safeParse(
      legalDocuments.map(document => ({
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
    }> = legalDocuments.map(document => ({
      documentId: document.id,
      version: document.version,
      accepted: true as const,
    }))
    consents[0] = { ...consents[0], version: 'stale-version' }

    expect(mentorApplicationConsentsSchema.safeParse(consents).success).toBe(false)
  })
})
