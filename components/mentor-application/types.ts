export type MentorApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'RESUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN'

export interface MentorApplication {
  id: string
  status: MentorApplicationStatus
  email: string
  fullName?: string | null
  phone?: string | null
  phoneCountryCode?: string | null
  countryId?: string | number | null
  stateId?: string | number | null
  cityId?: string | number | null
  title?: string | null
  company?: string | null
  industry?: string | null
  expertise?: string | string[] | null
  experience?: string | number | null
  experienceYears?: string | number | null
  hourlyRate?: string | number | null
  requestedHourlyRate?: string | number | null
  about?: string | null
  linkedinUrl?: string | null
  availability?: string | null
  profileImageUrl?: string | null
  resumeUrl?: string | null
  verificationNotes?: string | null
  applicantVisibleNotes?: string | null
  linkedUserId?: string | null
  mentorId?: string | null
  submittedAt?: string | null
  updatedAt?: string | null
}

export const EDITABLE_APPLICATION_STATUSES: MentorApplicationStatus[] = [
  'DRAFT',
  'CHANGES_REQUESTED',
]
