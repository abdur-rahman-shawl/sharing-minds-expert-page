import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query'

interface SessionWithRolesData {
  session: unknown
  user: unknown
  roles: Array<{ name: string; displayName: string }>
  mentorProfile: unknown
  isAdmin: boolean
  isMentor: boolean
  isMentee: boolean
  isMentorWithIncompleteProfile: boolean
}

export function useSessionWithRolesQuery() {
  return useQuery({
    queryKey: queryKeys.sessionWithRoles,
    queryFn: async (): Promise<SessionWithRolesData | null> => {
      const response = await fetch('/api/auth/session-with-roles', {
        credentials: 'include',
        cache: 'no-cache',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        return result.data
      }

      throw new Error(result.error || 'Failed to fetch session')
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}

export function useSignInMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ provider, credentials }: { provider: string; credentials: unknown }) => {
      const { signIn } = await import('@/lib/auth-client')
      return signIn(provider, credentials)
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: queryKeys.sessionWithRoles })
    },
  })
}

export function useSignOutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { signOut } = await import('@/lib/auth-client')
      await signOut()
    },
    onSuccess: () => {
      queryClient.clear()
    },
    onError: (error) => {
      console.error('Sign out failed:', error)
      queryClient.clear()
    },
  })
}

export function useRefreshSessionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.sessionWithRoles,
        refetchType: 'active',
      })
    },
    onSuccess: () => {
      console.info('Session refreshed successfully')
    },
  })
}
