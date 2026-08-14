'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { MentorApplicationStatus } from '@/components/mentor/mentor-application-status'
import { ApplicationAccessCard } from '@/components/mentor-application/application-access-card'
import { ApplicationLifecycleStatus } from '@/components/mentor-application/application-lifecycle-status'
import { ExpertApplicationWizard } from '@/components/mentor-application/expert-application-wizard'
import {
  EDITABLE_APPLICATION_STATUSES,
  type MentorApplication,
} from '@/components/mentor-application/types'
import { Button } from '@/components/ui/button'
import { useMentorStatus } from '@/hooks/use-mentor-status'
import { useSession } from '@/lib/auth-client'
import { captureCurrentCampaignVisit } from '@/lib/campaign-attribution/client'

type AccessStep = 'loading' | 'email' | 'otp' | 'form' | 'status'

async function readResponseJson(response: Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>
  } catch {
    return {}
  }
}

export default function RegistrationForm() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const { isMentor, mentor, isLoading: mentorStatusLoading } = useMentorStatus()
  const [accessStep, setAccessStep] = useState<AccessStep>('loading')
  const [application, setApplication] = useState<MentorApplication | null>(null)
  const [accessEmail, setAccessEmail] = useState('')
  const [challengeId, setChallengeId] = useState<string | null>(null)
  const [otp, setOtp] = useState('')
  const [accessError, setAccessError] = useState<string | null>(null)
  const [resendSeconds, setResendSeconds] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const guestAccessStarted = useRef(false)
  const bootstrapController = useRef<AbortController | null>(null)

  const activateApplication = useCallback((nextApplication: MentorApplication) => {
    setApplication(nextApplication)
    setAccessEmail(nextApplication.email)
    setAccessStep(
      EDITABLE_APPLICATION_STATUSES.includes(nextApplication.status) ? 'form' : 'status',
    )
  }, [])

  useEffect(() => {
    if (accessStep !== 'loading' || isLoading) return
    const timer = window.setTimeout(() => {
      setAccessStep(current => (current === 'loading' ? 'email' : current))
    }, 2_500)
    return () => window.clearTimeout(timer)
  }, [accessStep, isLoading])

  useEffect(() => {
    if (isPending || mentorStatusLoading || isMentor || guestAccessStarted.current) return

    let cancelled = false
    const controller = new AbortController()
    bootstrapController.current?.abort()
    bootstrapController.current = controller

    const restoreApplication = async () => {
      setAccessStep('loading')
      setAccessError(null)
      const signedInEmail = session?.user?.email || ''

      try {
        if (session?.user && session.user.emailVerified) {
          await captureCurrentCampaignVisit()
          const sessionResponse = await fetch('/api/mentor-applications/session', {
            method: 'POST',
            credentials: 'include',
            signal: controller.signal,
          })
          const sessionResult = await readResponseJson(sessionResponse)
          if (guestAccessStarted.current) return
          if (!sessionResponse.ok || sessionResult.success !== true) {
            if (!cancelled) {
              setAccessEmail(signedInEmail)
              setAccessError(
                typeof sessionResult.error === 'string'
                  ? sessionResult.error
                  : 'We could not connect your verified account. Verify your email to continue.',
              )
              setAccessStep('email')
            }
            return
          }
        }

        const response = await fetch('/api/mentor-applications/current', {
          credentials: 'include',
          cache: 'no-store',
          signal: controller.signal,
        })
        const result = await readResponseJson(response)
        if (
          !cancelled &&
          !guestAccessStarted.current &&
          response.ok &&
          result.success === true &&
          result.application
        ) {
          const restored = result.application as MentorApplication
          if (session?.user?.name && !restored.fullName) {
            restored.fullName = session.user.name
          }
          activateApplication(restored)
          return
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        console.error('Failed to restore expert application access', error)
      }

      if (!cancelled && !guestAccessStarted.current) {
        setAccessEmail(signedInEmail)
        setAccessStep('email')
      }
    }

    void restoreApplication()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [
    activateApplication,
    isMentor,
    isPending,
    mentorStatusLoading,
    session?.user?.email,
    session?.user?.emailVerified,
    session?.user?.id,
    session?.user?.name,
  ])

  useEffect(() => {
    if (resendSeconds <= 0) return
    const timer = window.setInterval(() => {
      setResendSeconds(current => Math.max(0, current - 1))
    }, 1_000)
    return () => window.clearInterval(timer)
  }, [resendSeconds])

  const requestOtp = async (email: string) => {
    await captureCurrentCampaignVisit()
    const response = await fetch('/api/mentor-applications/email/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: email.trim() }),
    })
    const result = await readResponseJson(response)
    if (!response.ok || result.success !== true || typeof result.challengeId !== 'string') {
      throw new Error(
        typeof result.error === 'string'
          ? result.error
          : 'We could not send a verification code. Please try again shortly.',
      )
    }
    setChallengeId(result.challengeId)
    setOtp('')
    setResendSeconds(60)
    setAccessStep('otp')
  }

  const handleRequestOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    guestAccessStarted.current = true
    bootstrapController.current?.abort()
    setIsLoading(true)
    setAccessError(null)
    try {
      await requestOtp(accessEmail)
    } catch (error) {
      setAccessError(error instanceof Error ? error.message : 'Unable to send a code.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!challengeId) {
      setAccessError('This verification request expired. Please request a new code.')
      setAccessStep('email')
      return
    }
    setIsLoading(true)
    setAccessError(null)
    try {
      const response = await fetch('/api/mentor-applications/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ challengeId, code: otp }),
      })
      const result = await readResponseJson(response)
      if (!response.ok || result.success !== true || !result.application) {
        throw new Error(
          typeof result.error === 'string'
            ? result.error
            : 'That code is invalid or expired. Please try again.',
        )
      }
      activateApplication(result.application as MentorApplication)
    } catch (error) {
      setAccessError(error instanceof Error ? error.message : 'Unable to verify the code.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendSeconds > 0) return
    setIsLoading(true)
    setAccessError(null)
    try {
      await requestOtp(accessEmail)
    } catch (error) {
      setAccessError(error instanceof Error ? error.message : 'Unable to resend the code.')
    } finally {
      setIsLoading(false)
    }
  }

  const switchApplicationEmail = async () => {
    const previousStep = accessStep
    setIsLoading(true)
    setAccessError(null)
    try {
      const response = await fetch('/api/mentor-applications/session', {
        method: 'DELETE',
        credentials: 'include',
      })
      const result = await readResponseJson(response)
      if (!response.ok || result.success !== true) {
        throw new Error(
          typeof result.error === 'string'
            ? result.error
            : 'Unable to close this application session.',
        )
      }
      guestAccessStarted.current = true
      setApplication(null)
      setChallengeId(null)
      setOtp('')
      setAccessEmail('')
      setAccessStep('email')
    } catch (error) {
      setAccessError(
        error instanceof Error ? error.message : 'Unable to close this application session.',
      )
      setAccessStep(previousStep)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mentorStatusLoading && isMentor && mentor) {
    return (
      <MentorApplicationStatus
        mentor={mentor}
        onNavigateHome={() => router.push('/')}
        onNavigateDashboard={() => router.push('/dashboard')}
      />
    )
  }

  if (accessStep === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600" />
          <p className="mt-4 font-medium text-slate-600">Loading your application securely...</p>
        </div>
      </div>
    )
  }

  if (accessStep === 'status' && application) {
    return (
      <ApplicationLifecycleStatus
        application={application}
        onNavigateHome={() => router.push('/')}
        onUseAnotherEmail={() => void switchApplicationEmail()}
        isClosing={isLoading}
        actionError={accessError}
      />
    )
  }

  if (accessStep === 'form' && application) {
    return (
      <ExpertApplicationWizard
        key={application.id}
        application={application}
        onApplicationChange={setApplication}
        onSubmitted={submitted => {
          setApplication(submitted)
          setAccessStep('status')
        }}
        onExit={() => router.push('/')}
      />
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-slate-50 to-white" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <main className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="mb-6 rounded-full text-slate-500 hover:bg-white hover:text-indigo-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
            </Button>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              SharingMinds experts
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              Become a verified expert
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Apply without creating an account. Your verified email secures the application and
              connects it to your SharingMinds account when you join later.
            </p>
          </div>

          <ApplicationAccessCard
            step={accessStep === 'otp' ? 'otp' : 'email'}
            email={accessEmail}
            otp={otp}
            error={accessError}
            isLoading={isLoading}
            resendSeconds={resendSeconds}
            onEmailChange={setAccessEmail}
            onOtpChange={value => setOtp(value.replace(/\D/g, '').slice(0, 6))}
            onRequestOtp={handleRequestOtp}
            onVerifyOtp={handleVerifyOtp}
            onResendOtp={handleResendOtp}
            onChangeEmail={() => {
              setChallengeId(null)
              setOtp('')
              setAccessError(null)
              setAccessStep('email')
            }}
          />
        </div>
      </main>
    </div>
  )
}
