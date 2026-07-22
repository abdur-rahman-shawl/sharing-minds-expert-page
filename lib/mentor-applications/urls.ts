import 'server-only'

export function getMentorApplicationFileUrl(fileId: string): string {
  const configuredBaseUrl = process.env.APP_BASE_URL || process.env.BETTER_AUTH_URL
  if (!configuredBaseUrl) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('APP_BASE_URL is required to persist mentor application file URLs')
    }
    return `/api/mentor-applications/files/${fileId}`
  }

  return new URL(
    `/api/mentor-applications/files/${fileId}`,
    configuredBaseUrl,
  ).toString()
}
