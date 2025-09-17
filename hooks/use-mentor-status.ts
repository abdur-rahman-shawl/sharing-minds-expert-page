'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/auth-client'

interface MentorData {
  id: string
  registeredAt: string
  verificationStatus: string
  fullName: string
  email: string
}

interface MentorStatus {
  isMentor: boolean
  mentor: MentorData | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useMentorStatus(): MentorStatus {
  const { data: session } = useSession()
  const [isMentor, setIsMentor] = useState(false)
  const [mentor, setMentor] = useState<MentorData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMentorStatus = async () => {
    if (!session?.user) {
      setIsMentor(false)
      setMentor(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/mentors/status')
      const data = await response.json()

      if (data.success) {
        setIsMentor(data.isMentor)
        setMentor(data.mentor)
      } else {
        setError(data.error || 'Failed to check mentor status')
        setIsMentor(false)
        setMentor(null)
      }
    } catch (err) {
      console.error('Error fetching mentor status:', err)
      setError('Failed to check mentor status')
      setIsMentor(false)
      setMentor(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMentorStatus()
  }, [session])

  return {
    isMentor,
    mentor,
    isLoading,
    error,
    refetch: fetchMentorStatus
  }
}