'use client'

import React, { createContext, useCallback, useContext, useEffect } from 'react'
import {
  useSessionWithRolesQuery,
  useSignOutMutation,
  useRefreshSessionMutation,
} from '@/hooks/queries/use-session-query'
import { AuthErrorBoundary, useErrorHandler } from '@/components/common/error-boundary'
import { signIn as betterAuthSignIn } from '@/lib/auth-client'

type UserRole = {
  name: string
  displayName: string
}

type MentorProfile = {
  verificationStatus: string
  id: string
  profileImageUrl?: string
  resumeUrl?: string
  fullName?: string
  title?: string
  company?: string
  email?: string
  phone?: string
  city?: string
  country?: string
  industry?: string
  expertise?: string
  experience?: number
  about?: string
  linkedinUrl?: string
  githubUrl?: string
  websiteUrl?: string
  hourlyRate?: string
  currency?: string
  availability?: string
  headline?: string
  maxMentees?: number
} | null

type AuthState = {
  session: unknown
  isSessionLoading: boolean
  roles: UserRole[]
  primaryRole: UserRole | null
  mentorProfile: MentorProfile
  isRolesLoading: boolean
  isAuthenticated: boolean
  isLoading: boolean
  isMentorWithIncompleteProfile: boolean
  isAdmin: boolean
  isMentor: boolean
  isMentee: boolean
  signIn: (provider: string, credentials: unknown) => Promise<unknown>
  refreshUserData: () => Promise<void>
  signOut: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthState | null>(null)

type AuthProviderProps = {
  children: React.ReactNode
}

function AuthProviderInner({ children }: AuthProviderProps) {
  const { handleError } = useErrorHandler()

  const {
    data: sessionData,
    isLoading,
    error: sessionError,
    refetch,
  } = useSessionWithRolesQuery()

  const signOutMutation = useSignOutMutation()
  const refreshSessionMutation = useRefreshSessionMutation()

  const session = sessionData?.session ?? null
  const roles = sessionData?.roles ?? []
  const mentorProfile = sessionData?.mentorProfile ?? null
  const error = sessionError?.message ?? null

  const isAuthenticated = Boolean((session as any)?.user)
  const isAdmin = Boolean(sessionData?.isAdmin)
  const isMentor = Boolean(sessionData?.isMentor)
  const isMentee = Boolean(sessionData?.isMentee)
  const isMentorWithIncompleteProfile = Boolean(sessionData?.isMentorWithIncompleteProfile)

  const primaryRole =
    roles.find((role) => role.name === 'mentor') ??
    roles.find((role) => role.name === 'mentee') ??
    roles.find((role) => role.name === 'admin') ??
    null

  const refreshUserData = useCallback(async () => {
    await refetch()
  }, [refetch])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const userId = (session as any)?.user?.id

    if (userId) {
      window.localStorage.setItem('userId', userId)
    } else {
      window.localStorage.removeItem('userId')
    }
  }, [session])

  const handleSignIn = useCallback(
    async (provider: string, credentials: any) => {
      try {
        let result: any

        if (provider === 'email') {
          result = await (betterAuthSignIn as any).email(credentials)
        } else if (provider === 'social') {
          result = await (betterAuthSignIn as any).social(credentials)
        } else {
          throw new Error(`Unsupported sign-in provider: ${provider}`)
        }

        if (result?.error) {
          const message = result.error?.message ?? 'Invalid credentials'
          throw new Error(message)
        }

        await refreshUserData()
        return result
      } catch (err) {
        const error = err as Error
        handleError(error, 'signIn')
        throw error
      }
    },
    [refreshUserData, handleError],
  )

  const handleSignOut = useCallback(async () => {
    try {
      await signOutMutation.mutateAsync()
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('userId')
      }
    } catch (err) {
      const error = err as Error
      handleError(error, 'signOut')
      throw error
    }
  }, [signOutMutation, handleError])

  const value: AuthState = {
    session,
    isSessionLoading: isLoading,
    roles,
    primaryRole,
    mentorProfile,
    isRolesLoading: isLoading,
    isAuthenticated,
    isLoading: isLoading || signOutMutation.isPending || refreshSessionMutation.isPending,
    isMentorWithIncompleteProfile,
    isAdmin,
    isMentor,
    isMentee,
    signIn: handleSignIn,
    refreshUserData,
    signOut: handleSignOut,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <AuthErrorBoundary>
      <AuthProviderInner>{children}</AuthProviderInner>
    </AuthErrorBoundary>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useUserRoles() {
  const auth = useAuth()
  return {
    roles: auth.roles,
    primaryRole: auth.primaryRole,
    mentorProfile: auth.mentorProfile,
    isMentorWithIncompleteProfile: auth.isMentorWithIncompleteProfile,
    isLoading: auth.isRolesLoading,
    error: auth.error,
    refresh: auth.refreshUserData,
  }
}
