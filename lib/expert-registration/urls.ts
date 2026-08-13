import 'server-only'

export function getExpertRegistrationFileUrl(fileId: string): string {
  const path = `/api/expert-registration/files/${encodeURIComponent(fileId)}`
  const configuredBaseUrl = process.env.APP_BASE_URL || process.env.BETTER_AUTH_URL

  if (!configuredBaseUrl) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'APP_BASE_URL is required to persist expert registration file URLs',
      )
    }
    return path
  }

  return new URL(path, configuredBaseUrl).toString()
}
