import { pgEnum } from 'drizzle-orm/pg-core'

export const mentorRegistrationSourceEnum = pgEnum('mentor_registration_source', [
  'LIVE_EXPERT_REGISTRATION',
  'LEGACY_POC',
  'LEGACY_APPLICATION_MIGRATION',
  'MAIN_PLATFORM',
  'ADMIN_CREATED',
])

export const mentorRegistrationAuthMethodEnum = pgEnum(
  'mentor_registration_auth_method',
  ['GOOGLE', 'LINKEDIN', 'EMAIL_PASSWORD', 'EXISTING_SESSION'],
)

export const mentorRegistrationDraftStatusEnum = pgEnum(
  'mentor_registration_draft_status',
  [
    'DRAFT',
    'READY_FOR_AUTH',
    'AUTHENTICATED',
    'FINALIZING',
    'COMPLETED',
    'EXPIRED',
    'ABANDONED',
  ],
)

export const mentorRegistrationFileKindEnum = pgEnum(
  'mentor_registration_file_kind',
  [
    'PROFILE_IMAGE',
    'RESUME',
    'PORTFOLIO',
    'CASE_STUDY',
    'PRESENTATION',
    'AWARDS_CERTIFICATIONS',
  ],
)

export type MentorRegistrationSource =
  (typeof mentorRegistrationSourceEnum.enumValues)[number]
export type MentorRegistrationAuthMethod =
  (typeof mentorRegistrationAuthMethodEnum.enumValues)[number]
export type MentorRegistrationDraftStatus =
  (typeof mentorRegistrationDraftStatusEnum.enumValues)[number]
export type MentorRegistrationFileKind =
  (typeof mentorRegistrationFileKindEnum.enumValues)[number]
