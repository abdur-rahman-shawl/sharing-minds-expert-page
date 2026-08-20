'use client'

import { FileSpreadsheet, Loader2, LockKeyhole } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'

export default function ExpertReportLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reports/expert-applications/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const payload = (await response.json().catch(() => null)) as {
        error?: string
      } | null
      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to sign in')
      }

      router.refresh()
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Unable to sign in',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f7fb] px-5 py-16 text-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:32px_32px]"
      />
      <div className="relative mx-auto w-full max-w-md rounded-[2rem] border border-white/80 bg-white/95 p-7 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-9">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <FileSpreadsheet className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
          Protected export
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Download expert applications
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Sign in to generate applicant-level Excel reports. These files contain
          personal application information.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block space-y-2 text-sm font-semibold text-slate-800">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              autoComplete="username"
              required
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base font-normal outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </label>
          <label className="block space-y-2 text-sm font-semibold text-slate-800">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base font-normal outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </label>

          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
            >
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-full bg-slate-950 font-bold text-white hover:bg-blue-700"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            )}
            Sign in to reports
          </Button>
        </form>
      </div>
    </div>
  )
}
