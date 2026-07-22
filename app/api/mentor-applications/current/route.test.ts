import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const applicationMocks = vi.hoisted(() => ({
  saveMentorApplicationDraft: vi.fn(),
  serializeMentorApplication: vi.fn(),
}))

const sessionMocks = vi.hoisted(() => {
  class MentorApplicationSessionError extends Error {}

  return {
    MentorApplicationSessionError,
    clearMentorApplicationSessionCookie: vi.fn(),
    getMentorApplicationFromSession: vi.fn(),
  }
})

const securityMocks = vi.hoisted(() => {
  class MentorApplicationSecurityError extends Error {}

  return {
    MentorApplicationSecurityError,
    assertTrustedOrigin: vi.fn(),
  }
})

vi.mock('@/lib/mentor-applications/application', () => ({
  MentorApplicationConflictError: class MentorApplicationConflictError extends Error {},
  ...applicationMocks,
}))

vi.mock('@/lib/mentor-applications/session', () => sessionMocks)
vi.mock('@/lib/mentor-applications/security', () => securityMocks)
vi.mock('@/lib/validations/mentor-application', () => ({
  patchMentorApplicationSchema: { safeParse: vi.fn() },
}))

import { GET } from './route'

describe('GET /api/mentor-applications/current', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('restores an active guest application session', async () => {
    const storedApplication = { id: 'application-id' }
    const serializedApplication = {
      id: 'application-id',
      email: 'verified@example.com',
      status: 'DRAFT',
    }
    sessionMocks.getMentorApplicationFromSession.mockResolvedValue(storedApplication)
    applicationMocks.serializeMentorApplication.mockResolvedValue(serializedApplication)

    const response = await GET(
      new NextRequest('http://localhost/api/mentor-applications/current'),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      success: true,
      application: serializedApplication,
    })
  })

  it('treats a missing optional guest session as an unauthenticated state', async () => {
    sessionMocks.getMentorApplicationFromSession.mockRejectedValue(
      new sessionMocks.MentorApplicationSessionError(),
    )

    const response = await GET(
      new NextRequest('http://localhost/api/mentor-applications/current'),
    )

    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    await expect(response.json()).resolves.toEqual({
      success: true,
      application: null,
    })
    expect(sessionMocks.clearMentorApplicationSessionCookie).toHaveBeenCalledWith(
      response,
    )
  })
})
