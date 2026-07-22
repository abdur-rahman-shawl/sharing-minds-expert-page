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
      hourlyRate: '',
      availability: '',
    })

    expect(result.success).toBe(true)
  })

  it('keeps final submission validation strict', () => {
    expect(
      mentorApplicationDraftFieldsSchema.safeParse({ fullName: 'A' }).success,
    ).toBe(false)
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
