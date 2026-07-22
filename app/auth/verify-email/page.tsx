'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSession } from '@/lib/auth-client'
import { getSafeRedirectPath } from '@/lib/safe-redirect'

const maskEmail = (email: string) => {
  const [localPart, domain] = email.split('@')
  if (!domain) return email
  const visible = localPart.slice(0, Math.min(2, localPart.length))
  return `${visible}${'*'.repeat(Math.max(2, localPart.length - visible.length))}@${domain}`
}

function VerifyEmailPage() {
  const [otp, setOtp] = useState('')
  const [challengeId, setChallengeId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const hasRequestedInitialCode = useRef(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, isPending } = useSession()
  const callbackUrl = getSafeRedirectPath(searchParams.get('callbackUrl'))

  const requestOtp = useCallback(async () => {
    setIsSending(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      })
      const data = await response.json()

      if (response.ok && data.alreadyVerified) {
        router.replace(callbackUrl)
        router.refresh()
        return
      }

      if (!response.ok || !data.challengeId) {
        throw new Error(data.error || 'Unable to send a verification code')
      }

      setChallengeId(data.challengeId)
      setMessage('A verification code has been sent to your email.')
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to send a verification code',
      )
    } finally {
      setIsSending(false)
    }
  }, [callbackUrl, router])

  useEffect(() => {
    if (isPending) return

    if (!session?.user) {
      router.replace(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
      return
    }

    if (session.user.emailVerified === true) {
      router.replace(callbackUrl)
      return
    }

    if (!hasRequestedInitialCode.current) {
      hasRequestedInitialCode.current = true
      void requestOtp()
    }
  }, [callbackUrl, isPending, requestOtp, router, session?.user])

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!challengeId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ challengeId, otp }),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid or expired verification code')
        return
      }

      router.replace(callbackUrl)
      router.refresh()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to verify the code',
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isPending || !session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Preparing secure email verification…
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Verify your email</h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter the six-digit code sent to{' '}
            <strong>{maskEmail(session.user.email)}</strong>.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verification code</CardTitle>
            <CardDescription>The code expires after ten minutes.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium text-slate-700">
                  Six-digit code
                </label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(event) => {
                    setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
                    setError(null)
                  }}
                  required
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  aria-describedby={error ? 'verification-error' : undefined}
                />
              </div>

              {error && (
                <p id="verification-error" role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}
              {message && <p className="text-sm text-emerald-700">{message}</p>}

              <Button
                type="submit"
                disabled={isLoading || isSending || otp.length !== 6 || !challengeId}
                className="w-full"
              >
                {isLoading ? 'Verifying…' : 'Verify email'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-slate-600">
          Didn&apos;t receive the code?{' '}
          <Button
            type="button"
            variant="link"
            onClick={() => void requestOtp()}
            disabled={isSending || isLoading}
            className="h-auto p-0"
          >
            {isSending ? 'Sending…' : 'Send another code'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPageWrapper() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <VerifyEmailPage />
    </Suspense>
  )
}
