'use client'

let lastCaptureKey = ''
let lastCapturePromise: Promise<void> | null = null
let initialReferrerSent = false

const EXCLUDED_ATTRIBUTION_PATHS = [
  '/auth',
  '/dashboard',
  '/reports',
  '/verify-email',
  '/vip-lounge',
]

function isPublicAcquisitionPath(pathname: string): boolean {
  return !EXCLUDED_ATTRIBUTION_PATHS.some(
    excluded => pathname === excluded || pathname.startsWith(`${excluded}/`),
  )
}

export function captureCurrentCampaignVisit(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (!isPublicAcquisitionPath(window.location.pathname)) return Promise.resolve()

  const key = `${window.location.pathname}${window.location.search}`
  if (key === lastCaptureKey && lastCapturePromise) return lastCapturePromise

  const referrer = initialReferrerSent ? '' : document.referrer
  initialReferrerSent = true
  lastCaptureKey = key
  lastCapturePromise = fetch('/api/attribution/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    keepalive: true,
    body: JSON.stringify({
      path: window.location.pathname,
      search: window.location.search,
      referrer,
    }),
  })
    .then(response => {
      if (!response.ok) throw new Error('Campaign visit capture failed')
    })
    .catch(error => {
      lastCaptureKey = ''
      lastCapturePromise = null
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[campaign-attribution] Visit capture was not recorded', error)
      }
    })

  return lastCapturePromise
}
