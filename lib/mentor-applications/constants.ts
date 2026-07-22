import 'server-only'

export const MENTOR_APPLICATION_SESSION_COOKIE =
  process.env.MENTOR_APPLICATION_COOKIE_NAME ||
  '__Secure-sharingminds-mentor-application'

export const MENTOR_APPLICATION_SESSION_PATH = '/api/mentor-applications'
export const MENTOR_APPLICATION_SESSION_TTL_MS = 24 * 60 * 60 * 1000
export const MENTOR_APPLICATION_SESSION_IDLE_TTL_MS = 60 * 60 * 1000

export const OTP_TTL_MS = 10 * 60 * 1000
export const OTP_MAX_ATTEMPTS = 5
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000
export const OTP_EMAIL_WINDOW_MS = 15 * 60 * 1000
export const OTP_EMAIL_WINDOW_LIMIT = 3
export const OTP_IP_WINDOW_MS = 24 * 60 * 60 * 1000
export const OTP_IP_WINDOW_LIMIT = 10

export const MENTOR_APPLICATION_BUCKET =
  process.env.SUPABASE_MENTOR_APPLICATIONS_BUCKET || 'mentor-applications'

export const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024
export const RESUME_MAX_BYTES = 5 * 1024 * 1024
export const SUPPORTING_DOCUMENT_MAX_BYTES = 5 * 1024 * 1024
export const MENTOR_APPLICATION_MULTIPART_MAX_BYTES = 31 * 1024 * 1024

export const EMAIL_OTP_PURPOSES = [
  'MENTOR_APPLICATION_ACCESS',
  'MENTOR_APPLICATION_CLAIM',
  'ACCOUNT_EMAIL_VERIFICATION',
] as const

export type EmailOtpPurpose = (typeof EMAIL_OTP_PURPOSES)[number]
