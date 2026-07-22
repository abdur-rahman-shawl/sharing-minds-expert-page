const DEFAULT_REDIRECT_PATH = '/'

/**
 * Accept only same-origin path redirects. This keeps callback parameters from becoming an
 * open redirect while preserving query strings and fragments for legitimate app routes.
 */
export function getSafeRedirectPath(
  candidate: string | null | undefined,
  fallback = DEFAULT_REDIRECT_PATH,
): string {
  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//')) {
    return fallback
  }

  try {
    const parsed = new URL(candidate, 'https://sharingminds.local')
    if (parsed.origin !== 'https://sharingminds.local') {
      return fallback
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return fallback
  }
}
