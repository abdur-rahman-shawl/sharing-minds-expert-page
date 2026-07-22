'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from '@/lib/auth-client'
import type {
  MentorApplicationStatusData,
  MentorStatusData,
} from '@/lib/mentor-onboarding'

interface MentorStatus {
  isMentor: boolean
  mentor: MentorStatusData | null
  isApplicant: boolean
  application: MentorApplicationStatusData | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useMentorStatus(): MentorStatus {
  const { data: session, isPending: isSessionPending } = useSession()
  const [isMentor, setIsMentor] = useState(false)
  const [mentor, setMentor] = useState<MentorStatusData | null>(null)
  const [isApplicant, setIsApplicant] = useState(false)
  const [application, setApplication] =
    useState<MentorApplicationStatusData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMentorStatus = useCallback(async () => {
    if (isSessionPending) return

    if (!session?.user) {
      setIsMentor(false)
      setMentor(null)
      setIsApplicant(false)
      setApplication(null)
      setError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/mentors/status', {
        credentials: 'include',
        cache: 'no-store',
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to check mentor status')
      }

      setIsMentor(Boolean(data.isMentor))
      setMentor(data.mentor ?? null)
      setIsApplicant(Boolean(data.isApplicant))
      setApplication(data.application ?? null)
    } catch (requestError) {
      console.error('Error fetching mentor status:', requestError)
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Failed to check mentor status',
      )
      setIsMentor(false)
      setMentor(null)
      setIsApplicant(false)
      setApplication(null)
    } finally {
      setIsLoading(false)
    }
  }, [isSessionPending, session?.user?.id])

  useEffect(() => {
    void fetchMentorStatus()
  }, [fetchMentorStatus])

  return {
    isMentor,
    mentor,
    isApplicant,
    application,
    isLoading: isLoading || isSessionPending,
    error,
    refetch: fetchMentorStatus,
  }
}
