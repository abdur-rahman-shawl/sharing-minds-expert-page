import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const draftMocks = vi.hoisted(() => ({
  clearExpertRegistrationDraftCookie: vi.fn(),
  getExpertRegistrationDraftFromRequest: vi.fn(),
  saveExpertRegistrationDraft: vi.fn(),
  serializeExpertRegistrationDraft: vi.fn(),
}))

const securityMocks = vi.hoisted(() => {
  class MentorApplicationSecurityError extends Error {}

  return {
    MentorApplicationSecurityError,
    assertTrustedOrigin: vi.fn(),
  }
})

vi.mock('@/lib/expert-registration/drafts', () => ({
  ExpertRegistrationDraftError: class ExpertRegistrationDraftError extends Error {},
  saveExpertRegistrationDraft: draftMocks.saveExpertRegistrationDraft,
  serializeExpertRegistrationDraft: draftMocks.serializeExpertRegistrationDraft,
}))
vi.mock('@/lib/expert-registration/draft-session', () => ({
  clearExpertRegistrationDraftCookie: draftMocks.clearExpertRegistrationDraftCookie,
  getExpertRegistrationDraftFromRequest:
    draftMocks.getExpertRegistrationDraftFromRequest,
}))
vi.mock('@/lib/expert-registration/feature', () => ({
  isLiveExpertRegistrationEnabled: () => true,
}))
vi.mock('@/lib/mentor-applications/security', () => securityMocks)
vi.mock('@/lib/validations/mentor-application', () => ({
  patchMentorApplicationSchema: { safeParse: vi.fn() },
}))

import { GET } from './route'

describe('GET /api/expert-registration/drafts/current', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('restores an editable draft with its real lifecycle status', async () => {
    const storedDraft = { id: 'draft-id', status: 'READY_FOR_AUTH' }
    const serializedDraft = {
      id: 'draft-id',
      status: 'DRAFT',
      registrationDraftStatus: 'READY_FOR_AUTH',
    }
    draftMocks.getExpertRegistrationDraftFromRequest.mockResolvedValue(storedDraft)
    draftMocks.serializeExpertRegistrationDraft.mockResolvedValue(serializedDraft)

    const response = await GET(
      new NextRequest('http://localhost/api/expert-registration/drafts/current'),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      success: true,
      draft: serializedDraft,
    })
    expect(draftMocks.clearExpertRegistrationDraftCookie).not.toHaveBeenCalled()
  })

  it('does not reopen a completed draft and expires its browser cookie', async () => {
    draftMocks.getExpertRegistrationDraftFromRequest.mockResolvedValue({
      id: 'completed-draft-id',
      status: 'COMPLETED',
    })

    const response = await GET(
      new NextRequest('http://localhost/api/expert-registration/drafts/current'),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true, draft: null })
    expect(draftMocks.serializeExpertRegistrationDraft).not.toHaveBeenCalled()
    expect(draftMocks.clearExpertRegistrationDraftCookie).toHaveBeenCalledWith(response)
  })
})
