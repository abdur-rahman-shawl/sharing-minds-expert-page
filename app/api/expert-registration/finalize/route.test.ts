import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const mocks = vi.hoisted(() => ({
  checkRateLimit: vi.fn(),
  clearDraftCookie: vi.fn(),
  finalize: vi.fn(),
  getDraft: vi.fn(),
  getUser: vi.fn(),
  sendReceipt: vi.fn(),
}))

const securityMocks = vi.hoisted(() => {
  class MentorApplicationSecurityError extends Error {}

  return {
    MentorApplicationSecurityError,
    assertTrustedOrigin: vi.fn(),
  }
})

vi.mock('@/lib/expert-registration/drafts', () => ({
  ExpertRegistrationDraftError: class ExpertRegistrationDraftError extends Error {
    status = 409
  },
}))
vi.mock('@/lib/expert-registration/draft-session', () => ({
  clearExpertRegistrationDraftCookie: mocks.clearDraftCookie,
  getExpertRegistrationDraftFromRequest: mocks.getDraft,
}))
vi.mock('@/lib/expert-registration/feature', () => ({
  isLiveExpertRegistrationEnabled: () => true,
}))
vi.mock('@/lib/expert-registration/finalize', () => ({
  finalizeExpertRegistration: mocks.finalize,
}))
vi.mock('@/lib/mentor-applications/auth', () => ({
  getAuthenticatedApplicationUser: mocks.getUser,
}))
vi.mock('@/lib/mentor-applications/email', () => ({
  sendMentorApplicationReceivedEmail: mocks.sendReceipt,
}))
vi.mock('@/lib/mentor-applications/security', () => securityMocks)
vi.mock('@/lib/reports/public-report-rate-limit', () => ({
  checkPublicReportRateLimit: mocks.checkRateLimit,
}))

import { POST } from './route'

const mentor = {
  id: 'mentor-id',
  email: 'expert@example.com',
  fullName: 'Expert Person',
}

function request() {
  return new NextRequest('http://localhost/api/expert-registration/finalize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost',
    },
    body: JSON.stringify({ authMethod: 'EMAIL_PASSWORD' }),
  })
}

describe('POST /api/expert-registration/finalize', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.checkRateLimit.mockReturnValue({ allowed: true })
    mocks.getDraft.mockResolvedValue({ id: 'draft-id' })
    mocks.getUser.mockResolvedValue({ id: 'user-id', email: mentor.email })
    mocks.sendReceipt.mockResolvedValue(undefined)
  })

  it('expires the browser draft and sends one receipt after creation', async () => {
    mocks.finalize.mockResolvedValue({ mentor, outcome: 'CREATED' })

    const response = await POST(request())

    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toEqual({
      success: true,
      mentor,
      outcome: 'CREATED',
    })
    expect(mocks.clearDraftCookie).toHaveBeenCalledWith(response)
    expect(mocks.sendReceipt).toHaveBeenCalledOnce()
  })

  it('expires the browser draft without resending a receipt on replay', async () => {
    mocks.finalize.mockResolvedValue({ mentor, outcome: 'REPLAYED' })

    const response = await POST(request())

    expect(response.status).toBe(200)
    expect(mocks.clearDraftCookie).toHaveBeenCalledWith(response)
    expect(mocks.sendReceipt).not.toHaveBeenCalled()
  })

  it('preserves the prepared draft when the account already owns a mentor', async () => {
    mocks.finalize.mockResolvedValue({ mentor, outcome: 'EXISTING_PROFILE' })

    const response = await POST(request())

    expect(response.status).toBe(200)
    expect(mocks.clearDraftCookie).not.toHaveBeenCalled()
    expect(mocks.sendReceipt).not.toHaveBeenCalled()
  })
})
