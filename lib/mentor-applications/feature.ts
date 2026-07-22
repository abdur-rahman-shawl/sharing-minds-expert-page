import 'server-only'

/**
 * Production defaults off so application code can be deployed before the
 * additive database migration without breaking existing authenticated flows.
 * Enable only after migration 003 and storage prerequisites are verified.
 */
export function areMentorApplicationsEnabled(): boolean {
  const configured = process.env.MENTOR_APPLICATIONS_ENABLED?.trim().toLowerCase()
  if (configured === 'true') return true
  if (configured === 'false') return false
  return process.env.NODE_ENV !== 'production'
}
