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
  professionalHeadline?: string | null
  title?: string | null
  company?: string | null
  websiteUrl?: string | null
  employmentType?: string | null
  experienceBand?: string | null
  industries?: string[] | null
  otherIndustry?: string | null
  expertise?: string[] | null
  otherExpertise?: string | null
  about?: string | null
  challengeSolved?: string | null
  measurableOutcomes?: string | null
  guidanceValueProposition?: string | null
  credibilitySignals?: string[] | null
  linkedinUrl?: string | null
  serviceInterests?: string[] | null
  preferredSessionMode?: string | null
  languages?: string[] | null
  otherLanguage?: string | null
  weeklyAvailabilityBand?: string | null
  hasPriorMentoringExperience?: boolean | null
  hasProfessionalMisconduct?: boolean | null
  misconductExplanation?: string | null
  profileImageUrl?: string | null
  resumeUrl?: string | null
  portfolioUrl?: string | null
  caseStudyUrl?: string | null
  presentationUrl?: string | null
  awardsCertificationsUrl?: string | null
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
