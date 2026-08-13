import 'server-only'

import { and, desc, eq, gte, inArray, lt } from 'drizzle-orm'
import writeXlsxFile, {
  type Cell,
  type SheetData,
} from 'write-excel-file/node'
import { z } from 'zod'

import { db } from '@/lib/db'
import {
  campaignVisits,
  consentEvents,
  mentorApplicationFiles,
  mentorApplicationRevisions,
  mentorApplications,
  mentorRegistrationDrafts,
  mentorRegistrationFiles,
  mentors,
  type CampaignVisit,
  type ConsentEvent,
  type Mentor,
  type MentorApplication,
  type MentorApplicationFile,
  type MentorApplicationRevision,
  type MentorRegistrationDraft,
  type MentorRegistrationFile,
} from '@/lib/db/schema'
import { legalDocuments } from '@/lib/legal-documents'
import { isCampaignAttributionEnabled } from '@/lib/campaign-attribution/feature'
import {
  buildCampaignPerformanceData,
  getCampaignPerformanceData,
  type CampaignPerformanceData,
} from './campaign-performance'

export const EXPERT_REPORT_TIME_ZONE = 'Asia/Kolkata'
export const EXPERT_REPORT_MAX_RANGE_DAYS = 366
export const EXPERT_REPORT_MAX_ROWS = 10_000

const INDIA_OFFSET_MINUTES = 330
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000
const LOCAL_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
const SPREADSHEET_FORMULA_PATTERN = /^[\u0000-\u0020]*[=+\-@]/

export const expertApplicationReportRequestSchema = z
  .object({
    startAt: z
      .string()
      .trim()
      .regex(LOCAL_DATE_TIME_PATTERN, 'Enter a valid start date and time'),
    endAt: z
      .string()
      .trim()
      .regex(LOCAL_DATE_TIME_PATTERN, 'Enter a valid end date and time'),
  })
  .superRefine((value, context) => {
    const startAt = parseIndiaDateTime(value.startAt)
    const endAt = parseIndiaDateTime(value.endAt)

    if (!startAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startAt'],
        message: 'Enter a valid start date and time',
      })
    }

    if (!endAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endAt'],
        message: 'Enter a valid end date and time',
      })
    }

    if (!startAt || !endAt) return

    if (endAt <= startAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endAt'],
        message: 'End date and time must be later than the start',
      })
      return
    }

    if (endAt.getTime() - startAt.getTime() > EXPERT_REPORT_MAX_RANGE_DAYS * MILLISECONDS_PER_DAY) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endAt'],
        message: `Select a range of ${EXPERT_REPORT_MAX_RANGE_DAYS} days or less`,
      })
    }
  })

export type ExpertApplicationReportRequest = z.infer<
  typeof expertApplicationReportRequestSchema
>

export interface ExpertApplicationReportRange {
  startAt: Date
  endAt: Date
}

export interface ExpertApplicationReportRow extends Record<string, unknown> {
  applicationId: string
  registeredAtIst: string
  registrationDateIst: string
  registrationTimeIst: string
  registeredAtUtc: string
  email: string
  databaseStatus: string
  statusMeaning: string
  recordBasis: string
}

export interface ExpertApplicationReportData {
  range: ExpertApplicationReportRange
  generatedAt: Date
  rows: ExpertApplicationReportRow[]
  campaignPerformance?: CampaignPerformanceData
}

export class ExpertApplicationReportTooLargeError extends Error {
  constructor(public readonly maximumRows: number) {
    super(
      `The selected range contains more than ${maximumRows.toLocaleString('en-IN')} registrations`,
    )
    this.name = 'ExpertApplicationReportTooLargeError'
  }
}

type UnknownRecord = Record<string, unknown>
type AttachmentKind =
  | 'PROFILE_IMAGE'
  | 'RESUME'
  | 'PORTFOLIO'
  | 'CASE_STUDY'
  | 'PRESENTATION'
  | 'AWARDS_CERTIFICATIONS'

const ATTACHMENT_KINDS: AttachmentKind[] = [
  'PROFILE_IMAGE',
  'RESUME',
  'PORTFOLIO',
  'CASE_STUDY',
  'PRESENTATION',
  'AWARDS_CERTIFICATIONS',
]

const STATUS_DETAILS: Record<string, string> = {
  DRAFT: 'Not submitted — verified email but did not finish the application',
  SUBMITTED: 'Submitted — application completed and waiting for review',
  IN_REVIEW: 'Submitted — application is currently being reviewed',
  CHANGES_REQUESTED: 'Changes required — applicant must update and resubmit',
  RESUBMITTED: 'Resubmitted — requested changes were completed',
  APPROVED: 'Approved — expert application was accepted',
  REJECTED: 'Rejected — expert application was not accepted',
  WITHDRAWN: 'Withdrawn — applicant withdrew the application',
  IN_PROGRESS: 'Submitted — live account-backed registration is awaiting review',
  VERIFIED: 'Approved — live expert registration was verified',
  REVERIFICATION: 'Reverification required for the live mentor profile',
  UPDATED_PROFILE: 'Updated live mentor profile is awaiting review',
}

const REPORT_COLUMNS: Array<{
  header: string
  key: string
  width: number
}> = [
  { header: 'Registration Date (IST)', key: 'registrationDateIst', width: 20 },
  { header: 'Registration Time (IST)', key: 'registrationTimeIst', width: 20 },
  { header: 'Registered At (IST)', key: 'registeredAtIst', width: 25 },
  { header: 'Registered At (UTC)', key: 'registeredAtUtc', width: 27 },
  { header: 'Email', key: 'email', width: 34 },
  { header: 'Record Type', key: 'recordType', width: 24 },
  { header: 'Registration Source', key: 'registrationSource', width: 32 },
  { header: 'Registration Auth Method', key: 'registrationAuthMethod', width: 28 },
  { header: 'Canonical User ID', key: 'canonicalUserId', width: 34 },
  { header: 'Canonical Mentor ID', key: 'canonicalMentorId', width: 38 },
  { header: 'Legacy Application Match ID', key: 'legacyApplicationMatchId', width: 38 },
  { header: 'Database Status', key: 'databaseStatus', width: 22 },
  { header: 'Status in Simple Terms', key: 'statusMeaning', width: 54 },
  { header: 'Record Basis', key: 'recordBasis', width: 38 },
  { header: 'Full Name', key: 'fullName', width: 28 },
  { header: 'Phone', key: 'phone', width: 22 },
  { header: 'Application ID', key: 'applicationId', width: 38 },
  { header: 'Application Entry Source', key: 'source', width: 24 },
  { header: 'Marketing Channel', key: 'marketingChannel', width: 22 },
  { header: 'Marketing Source', key: 'marketingSource', width: 24 },
  { header: 'Marketing Medium', key: 'marketingMedium', width: 24 },
  { header: 'Marketing Campaign', key: 'marketingCampaign', width: 32 },
  { header: 'Marketing Creative', key: 'marketingContent', width: 32 },
  { header: 'Marketing Term', key: 'marketingTerm', width: 28 },
  { header: 'Campaign Landing Page', key: 'campaignLandingPath', width: 34 },
  { header: 'Campaign Referrer', key: 'campaignReferrerHost', width: 30 },
  { header: 'Attributed Visit At (IST)', key: 'attributedVisitAtIst', width: 28 },
  { header: 'Email Verified At (IST)', key: 'emailVerifiedAtIst', width: 25 },
  { header: 'Latest Submitted At (IST)', key: 'submittedAtIst', width: 27 },
  { header: 'Reviewed At (IST)', key: 'reviewedAtIst', width: 25 },
  { header: 'Decision At (IST)', key: 'decidedAtIst', width: 25 },
  { header: 'Linked At (IST)', key: 'linkedAtIst', width: 25 },
  { header: 'Promoted At (IST)', key: 'promotedAtIst', width: 25 },
  { header: 'Last Updated At (IST)', key: 'updatedAtIst', width: 25 },
  { header: 'Linked to User Account', key: 'linkedToUser', width: 23 },
  { header: 'Promoted to Mentor', key: 'promotedToMentor', width: 22 },
  { header: 'Country', key: 'country', width: 22 },
  { header: 'Country ID', key: 'countryId', width: 18 },
  { header: 'State', key: 'state', width: 22 },
  { header: 'State ID', key: 'stateId', width: 18 },
  { header: 'City', key: 'city', width: 22 },
  { header: 'City ID', key: 'cityId', width: 18 },
  { header: 'Professional Headline', key: 'professionalHeadline', width: 42 },
  { header: 'Current Job Title', key: 'title', width: 30 },
  { header: 'Company', key: 'company', width: 30 },
  { header: 'Website URL', key: 'websiteUrl', width: 36 },
  { header: 'LinkedIn URL', key: 'linkedinUrl', width: 42 },
  { header: 'Employment Type', key: 'employmentType', width: 24 },
  { header: 'Industries', key: 'industries', width: 42 },
  { header: 'Other Industry', key: 'otherIndustry', width: 28 },
  { header: 'Expertise', key: 'expertise', width: 46 },
  { header: 'Other Expertise', key: 'otherExpertise', width: 30 },
  { header: 'Experience Years', key: 'experienceYears', width: 19 },
  { header: 'Experience Band', key: 'experienceBand', width: 22 },
  { header: 'Requested Hourly Rate', key: 'requestedHourlyRate', width: 24 },
  { header: 'Currency', key: 'currency', width: 14 },
  { header: 'Availability Cadence', key: 'availabilityCadence', width: 23 },
  { header: 'Weekly Availability', key: 'weeklyAvailabilityBand', width: 24 },
  { header: 'Preferred Session Mode', key: 'preferredSessionMode', width: 26 },
  { header: 'Languages', key: 'languages', width: 34 },
  { header: 'Other Language', key: 'otherLanguage', width: 24 },
  { header: 'Service Interests', key: 'serviceInterests', width: 44 },
  { header: 'Credibility Signals', key: 'credibilitySignals', width: 44 },
  { header: 'About', key: 'about', width: 58 },
  { header: 'Challenge Solved', key: 'challengeSolved', width: 58 },
  { header: 'Measurable Outcomes', key: 'measurableOutcomes', width: 58 },
  {
    header: 'Guidance Value Proposition',
    key: 'guidanceValueProposition',
    width: 58,
  },
  {
    header: 'Legacy Prior Mentoring Experience',
    key: 'hasPriorMentoringExperience',
    width: 31,
  },
  {
    header: 'Legacy Professional Misconduct',
    key: 'hasProfessionalMisconduct',
    width: 31,
  },
  {
    header: 'Legacy Misconduct Explanation',
    key: 'misconductExplanation',
    width: 46,
  },
  { header: 'Profile Image Filename', key: 'profileImageFileName', width: 34 },
  { header: 'Resume Filename', key: 'resumeFileName', width: 34 },
  { header: 'Portfolio Filename', key: 'portfolioFileName', width: 34 },
  { header: 'Case Study Filename', key: 'caseStudyFileName', width: 34 },
  { header: 'Presentation Filename', key: 'presentationFileName', width: 34 },
  {
    header: 'Awards / Certifications Filename',
    key: 'awardsCertificationsFileName',
    width: 38,
  },
  { header: 'Profile Image Size (MB)', key: 'profileImageSizeMb', width: 25 },
  { header: 'Resume Size (MB)', key: 'resumeSizeMb', width: 21 },
  { header: 'Accepted Consents', key: 'acceptedConsents', width: 58 },
  { header: 'Consent Count', key: 'consentCount', width: 16 },
  { header: 'Application Schema Version', key: 'applicationSchemaVersion', width: 28 },
  { header: 'Submission Revision', key: 'submissionRevision', width: 21 },
]

export function parseIndiaDateTime(value: string): Date | null {
  const match = LOCAL_DATE_TIME_PATTERN.exec(value.trim())
  if (!match) return null

  const [, yearText, monthText, dayText, hourText, minuteText, secondText = '0'] =
    match
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const hour = Number(hourText)
  const minute = Number(minuteText)
  const second = Number(secondText)

  const wallClockUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
  if (
    wallClockUtc.getUTCFullYear() !== year ||
    wallClockUtc.getUTCMonth() !== month - 1 ||
    wallClockUtc.getUTCDate() !== day ||
    wallClockUtc.getUTCHours() !== hour ||
    wallClockUtc.getUTCMinutes() !== minute ||
    wallClockUtc.getUTCSeconds() !== second
  ) {
    return null
  }

  return new Date(wallClockUtc.getTime() - INDIA_OFFSET_MINUTES * 60 * 1000)
}

export function toExpertApplicationReportRange(
  input: ExpertApplicationReportRequest,
): ExpertApplicationReportRange {
  const startAt = parseIndiaDateTime(input.startAt)
  const endAt = parseIndiaDateTime(input.endAt)

  if (!startAt || !endAt) {
    throw new Error('The report range must contain valid India Standard Time values')
  }

  return { startAt, endAt }
}

export function escapeSpreadsheetText(value: string): string {
  return SPREADSHEET_FORMULA_PATTERN.test(value) ? `'${value}` : value
}

export function getApplicationStatusMeaning(status: string): string {
  return STATUS_DETAILS[status] || 'Unknown application status'
}

function asRecord(value: unknown): UnknownRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as UnknownRecord
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function valueFrom(
  snapshot: UnknownRecord | null,
  key: string,
  fallback: unknown,
): unknown {
  if (!snapshot || !Object.prototype.hasOwnProperty.call(snapshot, key)) return fallback
  return snapshot[key]
}

function textValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return JSON.stringify(value)
}

function listValue(value: unknown): string {
  return asArray(value)
    .map(item => textValue(item))
    .filter(Boolean)
    .join(' | ')
}

function booleanValue(value: unknown): string {
  if (value === true) return 'Yes'
  if (value === false) return 'No'
  return ''
}

function numericValue(value: unknown): number | string {
  if (value === null || value === undefined || value === '') return ''
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : textValue(value)
}

function formatIndiaParts(value: Date | null): {
  date: string
  time: string
  dateTime: string
} {
  if (!value) return { date: '', time: '', dateTime: '' }

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: EXPERT_REPORT_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(value)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find(part => part.type === type)?.value || ''
  const date = `${get('year')}-${get('month')}-${get('day')}`
  const time = `${get('hour')}:${get('minute')}:${get('second')}`

  return {
    date,
    time,
    dateTime: `${date} ${time} IST`,
  }
}

function formatIndiaDateTime(value: Date | null | undefined): string {
  return value ? formatIndiaParts(value).dateTime : ''
}

function fileSizeMb(file: { sizeBytes: number } | undefined): number | string {
  if (!file) return ''
  return Math.round((file.sizeBytes / (1024 * 1024)) * 100) / 100
}

function buildLiveMentorReportRow(input: {
  mentor: Mentor
  draft?: MentorRegistrationDraft
  files: MentorRegistrationFile[]
  consents: ConsentEvent[]
  attributionVisit?: CampaignVisit
}): ExpertApplicationReportRow {
  const { mentor, draft, files, consents, attributionVisit } = input
  const registeredAt = mentor.registrationSubmittedAt || mentor.createdAt
  const registered = formatIndiaParts(registeredAt)
  const currentFile = (kind: MentorRegistrationFile['kind']) =>
    files.find(file => file.kind === kind && file.isCurrent)
  const profileImage = currentFile('PROFILE_IMAGE')
  const resume = currentFile('RESUME')
  const consentSummaryText = consents
    .map(consent => {
      const label =
        legalDocuments.find(document => document.id === consent.consentType)?.label ||
        consent.consentType
      return consent.consentVersion
        ? `${label} (version ${consent.consentVersion})`
        : label
    })
    .join(' | ')

  return {
    applicationId: mentor.registrationDraftId || mentor.id,
    registeredAtIst: registered.dateTime,
    registrationDateIst: registered.date,
    registrationTimeIst: registered.time,
    registeredAtUtc: registeredAt.toISOString(),
    email: mentor.email || '',
    recordType: 'LIVE_MENTOR_REGISTRATION',
    registrationSource: mentor.registrationSource || '',
    registrationAuthMethod: mentor.registrationAuthMethod || '',
    canonicalUserId: mentor.userId,
    canonicalMentorId: mentor.id,
    legacyApplicationMatchId: draft?.legacyApplicationId || '',
    databaseStatus: mentor.verificationStatus,
    statusMeaning: getApplicationStatusMeaning(mentor.verificationStatus),
    recordBasis: 'Canonical live account-backed mentor registration',
    fullName: mentor.fullName || '',
    phone: mentor.phone || '',
    source: mentor.creationSource,
    marketingChannel: attributionVisit?.channel || 'UNATTRIBUTED',
    marketingSource: attributionVisit?.source || 'unattributed',
    marketingMedium: attributionVisit?.medium || '',
    marketingCampaign: attributionVisit?.campaign || '',
    marketingContent: attributionVisit?.content || '',
    marketingTerm: attributionVisit?.term || '',
    campaignLandingPath: attributionVisit?.landingPath || '',
    campaignReferrerHost: attributionVisit?.referrerHost || '',
    attributedVisitAtIst: formatIndiaDateTime(attributionVisit?.startedAt),
    emailVerifiedAtIst: '',
    submittedAtIst: formatIndiaDateTime(mentor.registrationSubmittedAt),
    reviewedAtIst: '',
    decidedAtIst:
      mentor.verificationStatus === 'VERIFIED' || mentor.verificationStatus === 'REJECTED'
        ? formatIndiaDateTime(mentor.updatedAt)
        : '',
    linkedAtIst: formatIndiaDateTime(mentor.registrationSubmittedAt),
    promotedAtIst: formatIndiaDateTime(mentor.registrationSubmittedAt),
    updatedAtIst: formatIndiaDateTime(mentor.updatedAt),
    linkedToUser: 'Yes',
    promotedToMentor: 'Yes',
    country: mentor.country || '',
    countryId: mentor.countryId || '',
    state: mentor.state || '',
    stateId: mentor.stateId || '',
    city: mentor.city || '',
    cityId: mentor.cityId || '',
    professionalHeadline: mentor.headline || '',
    title: mentor.title || '',
    company: mentor.company || '',
    websiteUrl: mentor.websiteUrl || '',
    linkedinUrl: mentor.linkedinUrl || '',
    employmentType: mentor.employmentType || '',
    industries: (mentor.industries || []).join(' | '),
    otherIndustry: mentor.otherIndustry || '',
    expertise: (() => {
      try {
        const parsed = mentor.expertise ? JSON.parse(mentor.expertise) : []
        return Array.isArray(parsed) ? parsed.join(' | ') : mentor.expertise || ''
      } catch {
        return mentor.expertise || ''
      }
    })(),
    otherExpertise: mentor.otherExpertise || '',
    experienceYears: mentor.experience ?? '',
    experienceBand: mentor.experienceBand || '',
    requestedHourlyRate: mentor.hourlyRate || '',
    currency: mentor.currency || '',
    availabilityCadence: '',
    weeklyAvailabilityBand: mentor.weeklyAvailabilityBand || '',
    preferredSessionMode: mentor.preferredSessionMode || '',
    languages: (mentor.languages || []).join(' | '),
    otherLanguage: mentor.otherLanguage || '',
    serviceInterests: (mentor.serviceInterests || []).join(' | '),
    credibilitySignals: (mentor.credibilitySignals || []).join(' | '),
    about: mentor.about || '',
    challengeSolved: mentor.challengeSolved || '',
    measurableOutcomes: mentor.measurableOutcomes || '',
    guidanceValueProposition: mentor.guidanceValueProposition || '',
    hasPriorMentoringExperience: booleanValue(mentor.hasPriorMentoringExperience),
    hasProfessionalMisconduct: '',
    misconductExplanation: '',
    profileImageFileName: profileImage?.originalFileName || '',
    resumeFileName: resume?.originalFileName || '',
    portfolioFileName: currentFile('PORTFOLIO')?.originalFileName || '',
    caseStudyFileName: currentFile('CASE_STUDY')?.originalFileName || '',
    presentationFileName: currentFile('PRESENTATION')?.originalFileName || '',
    awardsCertificationsFileName:
      currentFile('AWARDS_CERTIFICATIONS')?.originalFileName || '',
    profileImageSizeMb: fileSizeMb(profileImage),
    resumeSizeMb: fileSizeMb(resume),
    acceptedConsents: consentSummaryText,
    consentCount: consents.length,
    applicationSchemaVersion: mentor.registrationSchemaVersion || '',
    submissionRevision: '',
  }
}

function attachmentIdsFromSnapshot(snapshot: UnknownRecord | null): Map<string, string> {
  const result = new Map<string, string>()
  const files = asRecord(snapshot?.files)
  if (!files) return result

  for (const item of asArray(files.current)) {
    const current = asRecord(item)
    const kind = textValue(current?.kind)
    const id = textValue(current?.id)
    if (kind && id) result.set(kind, id)
  }

  const uploaded = asRecord(files.uploaded)
  if (uploaded) {
    for (const [kind, idValue] of Object.entries(uploaded)) {
      const id = textValue(idValue)
      if (id) result.set(kind, id)
    }
  }

  return result
}

function resolveAttachments(
  snapshot: UnknownRecord | null,
  latestRevision: MentorApplicationRevision | undefined,
  applicationFiles: MentorApplicationFile[],
): Map<AttachmentKind, MentorApplicationFile> {
  const resolved = new Map<AttachmentKind, MentorApplicationFile>()
  const filesById = new Map(applicationFiles.map(file => [file.id, file]))

  if (latestRevision) {
    const snapshotIds = attachmentIdsFromSnapshot(snapshot)
    for (const kind of ATTACHMENT_KINDS) {
      const id = snapshotIds.get(kind)
      const file = id ? filesById.get(id) : undefined
      if (file) resolved.set(kind, file)
    }

    if (resolved.size > 0) return resolved
  }

  for (const file of applicationFiles) {
    if (file.isCurrent && ATTACHMENT_KINDS.includes(file.kind as AttachmentKind)) {
      resolved.set(file.kind as AttachmentKind, file)
    }
  }

  return resolved
}

function consentSummary(revision: MentorApplicationRevision | undefined): {
  value: string
  count: number
} {
  const consentSnapshot = asRecord(revision?.consentSnapshot)
  const documents = asArray(consentSnapshot?.documents)
    .map(asRecord)
    .filter((document): document is UnknownRecord => Boolean(document))
    .filter(document => document.accepted === true)

  return {
    value: documents
      .map(document => {
        const label = textValue(document.label || document.documentId)
        const version = textValue(document.version)
        return version ? `${label} (version ${version})` : label
      })
      .filter(Boolean)
      .join(' | '),
    count: documents.length,
  }
}

function buildReportRow(input: {
  application: MentorApplication
  latestRevision?: MentorApplicationRevision
  files: MentorApplicationFile[]
  attributionVisit?: CampaignVisit
}): ExpertApplicationReportRow {
  const { application, latestRevision, files, attributionVisit } = input
  const snapshot = asRecord(latestRevision?.snapshot)
  const location = asRecord(snapshot?.location)
  const hasSubmittedSnapshot = Boolean(latestRevision && snapshot)
  const registered = formatIndiaParts(application.createdAt)
  const attachments = resolveAttachments(snapshot, latestRevision, files)
  const consents = consentSummary(latestRevision)
  const availability = asRecord(
    valueFrom(snapshot, 'availability', application.availability),
  )

  const draftBasis = 'Current draft — not submitted'
  const submittedBasis = latestRevision
    ? `Latest submitted revision ${latestRevision.revision}`
    : 'Current record — submitted revision unavailable'
  const recordBasis = application.status === 'DRAFT' ? draftBasis : submittedBasis

  const currentOrSnapshot = (key: string, fallback: unknown) =>
    hasSubmittedSnapshot ? valueFrom(snapshot, key, null) : fallback
  const currentOrSnapshotLocation = (key: string, fallback: unknown) =>
    hasSubmittedSnapshot ? valueFrom(location, key, null) : fallback

  const profileImage = attachments.get('PROFILE_IMAGE')
  const resume = attachments.get('RESUME')

  return {
    applicationId: application.id,
    registeredAtIst: registered.dateTime,
    registrationDateIst: registered.date,
    registrationTimeIst: registered.time,
    registeredAtUtc: application.createdAt.toISOString(),
    email: textValue(currentOrSnapshot('email', application.email)),
    recordType: 'LEGACY_MENTOR_APPLICATION',
    registrationSource: 'LEGACY_GUEST_APPLICATION',
    registrationAuthMethod: application.source,
    canonicalUserId: application.linkedUserId || '',
    canonicalMentorId: application.mentorId || '',
    legacyApplicationMatchId: '',
    databaseStatus: application.status,
    statusMeaning: getApplicationStatusMeaning(application.status),
    recordBasis,
    fullName: textValue(currentOrSnapshot('fullName', application.fullName)),
    phone: textValue(currentOrSnapshot('phone', application.phone)),
    source: application.source,
    marketingChannel: attributionVisit?.channel || 'UNATTRIBUTED',
    marketingSource: attributionVisit?.source || 'unattributed',
    marketingMedium: attributionVisit?.medium || '',
    marketingCampaign: attributionVisit?.campaign || '',
    marketingContent: attributionVisit?.content || '',
    marketingTerm: attributionVisit?.term || '',
    campaignLandingPath: attributionVisit?.landingPath || '',
    campaignReferrerHost: attributionVisit?.referrerHost || '',
    attributedVisitAtIst: formatIndiaDateTime(attributionVisit?.startedAt),
    emailVerifiedAtIst: formatIndiaDateTime(application.emailVerifiedAt),
    submittedAtIst: formatIndiaDateTime(
      latestRevision?.submittedAt || application.submittedAt,
    ),
    reviewedAtIst: formatIndiaDateTime(application.reviewedAt),
    decidedAtIst: formatIndiaDateTime(application.decidedAt),
    linkedAtIst: formatIndiaDateTime(application.linkedAt),
    promotedAtIst: formatIndiaDateTime(application.promotedAt),
    updatedAtIst: formatIndiaDateTime(application.updatedAt),
    linkedToUser: application.linkedUserId ? 'Yes' : 'No',
    promotedToMentor: application.mentorId ? 'Yes' : 'No',
    country: textValue(currentOrSnapshotLocation('country', application.country)),
    countryId: textValue(currentOrSnapshotLocation('countryId', application.countryId)),
    state: textValue(currentOrSnapshotLocation('state', application.state)),
    stateId: textValue(currentOrSnapshotLocation('stateId', application.stateId)),
    city: textValue(currentOrSnapshotLocation('city', application.city)),
    cityId: textValue(currentOrSnapshotLocation('cityId', application.cityId)),
    professionalHeadline: textValue(
      currentOrSnapshot('professionalHeadline', application.professionalHeadline),
    ),
    title: textValue(currentOrSnapshot('title', application.title)),
    company: textValue(currentOrSnapshot('company', application.company)),
    websiteUrl: textValue(currentOrSnapshot('websiteUrl', application.websiteUrl)),
    linkedinUrl: textValue(currentOrSnapshot('linkedinUrl', application.linkedinUrl)),
    employmentType: textValue(
      currentOrSnapshot('employmentType', application.employmentType),
    ),
    industries: listValue(currentOrSnapshot('industries', application.industries)),
    otherIndustry: textValue(
      currentOrSnapshot('otherIndustry', application.otherIndustry),
    ),
    expertise: listValue(currentOrSnapshot('expertise', application.expertise)),
    otherExpertise: textValue(
      currentOrSnapshot('otherExpertise', application.otherExpertise),
    ),
    experienceYears: numericValue(
      currentOrSnapshot('experienceYears', application.experienceYears),
    ),
    experienceBand: textValue(
      currentOrSnapshot('experienceBand', application.experienceBand),
    ),
    requestedHourlyRate: numericValue(
      currentOrSnapshot('requestedHourlyRate', application.requestedHourlyRate),
    ),
    currency: textValue(currentOrSnapshot('currency', application.currency)),
    availabilityCadence: textValue(availability?.cadence),
    weeklyAvailabilityBand: textValue(
      currentOrSnapshot(
        'weeklyAvailabilityBand',
        application.weeklyAvailabilityBand,
      ),
    ),
    preferredSessionMode: textValue(
      currentOrSnapshot('preferredSessionMode', application.preferredSessionMode),
    ),
    languages: listValue(currentOrSnapshot('languages', application.languages)),
    otherLanguage: textValue(
      currentOrSnapshot('otherLanguage', application.otherLanguage),
    ),
    serviceInterests: listValue(
      currentOrSnapshot('serviceInterests', application.serviceInterests),
    ),
    credibilitySignals: listValue(
      currentOrSnapshot('credibilitySignals', application.credibilitySignals),
    ),
    about: textValue(currentOrSnapshot('about', application.about)),
    challengeSolved: textValue(
      currentOrSnapshot('challengeSolved', application.challengeSolved),
    ),
    measurableOutcomes: textValue(
      currentOrSnapshot('measurableOutcomes', application.measurableOutcomes),
    ),
    guidanceValueProposition: textValue(
      currentOrSnapshot(
        'guidanceValueProposition',
        application.guidanceValueProposition,
      ),
    ),
    hasPriorMentoringExperience: booleanValue(
      application.hasPriorMentoringExperience,
    ),
    hasProfessionalMisconduct: booleanValue(application.hasProfessionalMisconduct),
    misconductExplanation: textValue(application.misconductExplanation),
    profileImageFileName: textValue(profileImage?.originalFileName),
    resumeFileName: textValue(resume?.originalFileName),
    portfolioFileName: textValue(
      attachments.get('PORTFOLIO')?.originalFileName,
    ),
    caseStudyFileName: textValue(
      attachments.get('CASE_STUDY')?.originalFileName,
    ),
    presentationFileName: textValue(
      attachments.get('PRESENTATION')?.originalFileName,
    ),
    awardsCertificationsFileName: textValue(
      attachments.get('AWARDS_CERTIFICATIONS')?.originalFileName,
    ),
    profileImageSizeMb: fileSizeMb(profileImage),
    resumeSizeMb: fileSizeMb(resume),
    acceptedConsents: consents.value,
    consentCount: consents.count,
    applicationSchemaVersion: application.applicationSchemaVersion,
    submissionRevision: latestRevision?.revision || '',
  }
}

export async function getExpertApplicationReportData(
  range: ExpertApplicationReportRange,
): Promise<ExpertApplicationReportData> {
  const campaignPerformancePromise = isCampaignAttributionEnabled()
    ? getCampaignPerformanceData({ ...range, groupBy: 'campaign' })
    : Promise.resolve(
        buildCampaignPerformanceData({
          visits: [],
          applications: [],
          groupBy: 'campaign',
          ...range,
        }),
      )
  const [applications, liveMentors] = await Promise.all([
    db
      .select()
      .from(mentorApplications)
      .where(
        and(
          gte(mentorApplications.createdAt, range.startAt),
          lt(mentorApplications.createdAt, range.endAt),
        ),
      )
      .orderBy(desc(mentorApplications.createdAt))
      .limit(EXPERT_REPORT_MAX_ROWS + 1),
    db
      .select()
      .from(mentors)
      .where(
        and(
          eq(mentors.registrationSource, 'LIVE_EXPERT_REGISTRATION'),
          gte(mentors.registrationSubmittedAt, range.startAt),
          lt(mentors.registrationSubmittedAt, range.endAt),
        ),
      )
      .orderBy(desc(mentors.registrationSubmittedAt))
      .limit(EXPERT_REPORT_MAX_ROWS + 1),
  ])

  if (applications.length + liveMentors.length > EXPERT_REPORT_MAX_ROWS) {
    throw new ExpertApplicationReportTooLargeError(EXPERT_REPORT_MAX_ROWS)
  }

  if (applications.length === 0 && liveMentors.length === 0) {
    return {
      range,
      generatedAt: new Date(),
      rows: [],
      campaignPerformance: await campaignPerformancePromise,
    }
  }

  const applicationIds = applications.map(application => application.id)
  const liveMentorIds = liveMentors.map(mentor => mentor.id)
  const attributionVisitIds = [...applications, ...liveMentors]
    .map(record => record.attributionVisitId)
    .filter((id): id is string => Boolean(id))
  const [revisions, files, liveDrafts, liveFiles, liveConsents, attributionVisits] =
    await Promise.all([
    applicationIds.length
      ? db
          .select()
          .from(mentorApplicationRevisions)
          .where(inArray(mentorApplicationRevisions.applicationId, applicationIds))
          .orderBy(
            desc(mentorApplicationRevisions.submittedAt),
            desc(mentorApplicationRevisions.revision),
          )
      : Promise.resolve([]),
    applicationIds.length
      ? db
          .select()
          .from(mentorApplicationFiles)
          .where(inArray(mentorApplicationFiles.applicationId, applicationIds))
          .orderBy(desc(mentorApplicationFiles.createdAt))
      : Promise.resolve([]),
    liveMentorIds.length
      ? db
          .select()
          .from(mentorRegistrationDrafts)
          .where(inArray(mentorRegistrationDrafts.mentorId, liveMentorIds))
      : Promise.resolve([]),
    liveMentorIds.length
      ? db
          .select()
          .from(mentorRegistrationFiles)
          .where(inArray(mentorRegistrationFiles.mentorId, liveMentorIds))
          .orderBy(desc(mentorRegistrationFiles.createdAt))
      : Promise.resolve([]),
    liveMentorIds.length
      ? db
          .select()
          .from(consentEvents)
          .where(inArray(consentEvents.mentorId, liveMentorIds))
          .orderBy(desc(consentEvents.createdAt))
      : Promise.resolve([]),
    attributionVisitIds.length > 0
      ? db
          .select()
          .from(campaignVisits)
          .where(inArray(campaignVisits.id, attributionVisitIds))
      : Promise.resolve([]),
    ])

  const latestRevisionByApplication = new Map<string, MentorApplicationRevision>()
  for (const revision of revisions) {
    if (!latestRevisionByApplication.has(revision.applicationId)) {
      latestRevisionByApplication.set(revision.applicationId, revision)
    }
  }

  const filesByApplication = new Map<string, MentorApplicationFile[]>()
  for (const file of files) {
    const applicationFiles = filesByApplication.get(file.applicationId) || []
    applicationFiles.push(file)
    filesByApplication.set(file.applicationId, applicationFiles)
  }
  const attributionVisitsById = new Map(
    attributionVisits.map(visit => [visit.id, visit]),
  )

  const liveFilesByMentor = new Map<string, MentorRegistrationFile[]>()
  for (const file of liveFiles) {
    if (!file.mentorId) continue
    const current = liveFilesByMentor.get(file.mentorId) || []
    current.push(file)
    liveFilesByMentor.set(file.mentorId, current)
  }
  const liveConsentsByMentor = new Map<string, ConsentEvent[]>()
  for (const consent of liveConsents) {
    if (!consent.mentorId) continue
    const current = liveConsentsByMentor.get(consent.mentorId) || []
    current.push(consent)
    liveConsentsByMentor.set(consent.mentorId, current)
  }
  const liveDraftByMentor = new Map(
    liveDrafts
      .filter(
        (draft): draft is MentorRegistrationDraft & { mentorId: string } =>
          Boolean(draft.mentorId),
      )
      .map(draft => [draft.mentorId, draft]),
  )

  const rows = [
    ...applications.map(application =>
      buildReportRow({
        application,
        latestRevision: latestRevisionByApplication.get(application.id),
        files: filesByApplication.get(application.id) || [],
        attributionVisit: application.attributionVisitId
          ? attributionVisitsById.get(application.attributionVisitId)
          : undefined,
      }),
    ),
    ...liveMentors.map(mentor =>
      buildLiveMentorReportRow({
        mentor,
        draft: liveDraftByMentor.get(mentor.id),
        files: liveFilesByMentor.get(mentor.id) || [],
        consents: liveConsentsByMentor.get(mentor.id) || [],
        attributionVisit: mentor.attributionVisitId
          ? attributionVisitsById.get(mentor.attributionVisitId)
          : undefined,
      }),
    ),
  ].sort(
    (left, right) =>
      new Date(String(right.registeredAtUtc)).getTime() -
      new Date(String(left.registeredAtUtc)).getTime(),
  )

  return {
    range,
    generatedAt: new Date(),
    campaignPerformance: await campaignPerformancePromise,
    rows,
  }
}

function safeExcelValue(value: unknown): string | number | boolean | Date {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number' || typeof value === 'boolean') return value
  if (value instanceof Date) return value
  return escapeSpreadsheetText(textValue(value))
}

function headerCell(value: string, options?: { columnSpan?: number }): Cell {
  return {
    value,
    type: String,
    fontWeight: 'bold',
    fontSize: 11,
    textColor: '#FFFFFF',
    backgroundColor: '#111827',
    bottomBorderColor: '#2563EB',
    bottomBorderStyle: 'thin',
    align: 'left',
    alignVertical: 'center',
    wrap: true,
    height: 30,
    columnSpan: options?.columnSpan,
  }
}

function dataCell(value: unknown): Cell {
  const safeValue = safeExcelValue(value)
  return {
    value: safeValue,
    type:
      typeof safeValue === 'number'
        ? Number
        : typeof safeValue === 'boolean'
          ? Boolean
          : safeValue instanceof Date
            ? Date
            : String,
    alignVertical: 'top',
    wrap: true,
  }
}

function buildSummarySheet(report: ExpertApplicationReportData): SheetData {
  const statusCounts = new Map<string, number>()
  for (const row of report.rows) {
    const status = textValue(row.databaseStatus)
    statusCounts.set(status, (statusCounts.get(status) || 0) + 1)
  }

  const summaryRows: Array<[string, string | number]> = [
    ['Reporting timezone', 'Asia/Kolkata (IST)'],
    ['Range starts (inclusive)', formatIndiaDateTime(report.range.startAt)],
    ['Range ends (exclusive)', formatIndiaDateTime(report.range.endAt)],
    ['Generated at', formatIndiaDateTime(report.generatedAt)],
    ['Total verified registrations', report.rows.length],
    ['Not submitted (DRAFT)', statusCounts.get('DRAFT') || 0],
    [
      'Submitted or progressed',
      report.rows.filter(row => row.databaseStatus !== 'DRAFT').length,
    ],
    ['Submitted', statusCounts.get('SUBMITTED') || 0],
    ['In review', statusCounts.get('IN_REVIEW') || 0],
    ['Changes requested', statusCounts.get('CHANGES_REQUESTED') || 0],
    ['Resubmitted', statusCounts.get('RESUBMITTED') || 0],
    ['Approved', statusCounts.get('APPROVED') || 0],
    ['Rejected', statusCounts.get('REJECTED') || 0],
    ['Withdrawn', statusCounts.get('WITHDRAWN') || 0],
    ['Verification in progress', statusCounts.get('IN_PROGRESS') || 0],
    ['Verified mentors', statusCounts.get('VERIFIED') || 0],
    ['Reverification', statusCounts.get('REVERIFICATION') || 0],
    ['Profile updated', statusCounts.get('UPDATED_PROFILE') || 0],
  ]

  return [
    [
      {
        ...headerCell('sharingminds Expert Application Report', { columnSpan: 2 }),
        fontSize: 18,
        height: 42,
      },
      null,
    ],
    ...summaryRows.map(([label, value]) => [
      {
        ...dataCell(label),
        fontWeight: 'bold' as const,
        textColor: '#334155',
      },
      dataCell(value),
    ]),
    [null, null],
    [
      {
        ...dataCell('Data interpretation'),
        fontWeight: 'bold',
        textColor: '#334155',
      },
      {
        ...dataCell(
          'Legacy submissions use their latest immutable revision. Live account-backed registrations use the canonical mentor record. Legacy drafts remain explicitly marked as not submitted.',
        ),
        height: 42,
      },
    ],
  ]
}

function buildApplicationsSheet(report: ExpertApplicationReportData): SheetData {
  return [
    REPORT_COLUMNS.map(column => headerCell(column.header)),
    ...report.rows.map(reportRow =>
      REPORT_COLUMNS.map(column => dataCell(reportRow[column.key])),
    ),
  ]
}

const CAMPAIGN_PERFORMANCE_COLUMNS: Array<{
  header: string
  key: keyof CampaignPerformanceData['rows'][number]
  width: number
}> = [
  { header: 'Source', key: 'source', width: 24 },
  { header: 'Medium', key: 'medium', width: 22 },
  { header: 'Campaign', key: 'campaign', width: 32 },
  { header: 'Visits', key: 'visits', width: 14 },
  { header: 'Unique Visitors', key: 'uniqueVisitors', width: 18 },
  { header: 'Application Page Visits', key: 'applicationPageVisits', width: 24 },
  { header: 'OTP Starts', key: 'otpStarts', width: 15 },
  { header: 'Applications', key: 'applications', width: 16 },
  { header: 'Current Drafts', key: 'drafts', width: 17 },
  { header: 'Submitted', key: 'submitted', width: 15 },
  { header: 'In Review', key: 'inReview', width: 15 },
  { header: 'Changes Requested', key: 'changesRequested', width: 20 },
  { header: 'Resubmitted', key: 'resubmitted', width: 16 },
  { header: 'Approved', key: 'approved', width: 14 },
  { header: 'Rejected', key: 'rejected', width: 14 },
  { header: 'Withdrawn', key: 'withdrawn', width: 15 },
  { header: 'Visit to Application %', key: 'visitToApplicationRate', width: 23 },
  {
    header: 'Application to Submission %',
    key: 'applicationToSubmissionRate',
    width: 27,
  },
  {
    header: 'Submission to Approval %',
    key: 'submissionToApprovalRate',
    width: 25,
  },
]

function buildCampaignPerformanceSheet(report: ExpertApplicationReportData): SheetData {
  const rows = report.campaignPerformance?.rows || []
  return [
    CAMPAIGN_PERFORMANCE_COLUMNS.map(column => headerCell(column.header)),
    ...rows.map(row =>
      CAMPAIGN_PERFORMANCE_COLUMNS.map(column => dataCell(row[column.key])),
    ),
  ]
}

function buildStatusGuideSheet(): SheetData {
  return [
    [headerCell('Database Status'), headerCell('Meaning')],
    ...Object.entries(STATUS_DETAILS).map(([status, meaning]) => [
      dataCell(status),
      dataCell(meaning),
    ]),
  ]
}

export async function buildExpertApplicationWorkbook(
  report: ExpertApplicationReportData,
): Promise<Uint8Array> {
  const output = await writeXlsxFile(
    [
      {
        data: buildSummarySheet(report),
        sheet: 'Summary',
        columns: [{ width: 34 }, { width: 58 }],
        showGridLines: false,
        zoomScale: 1,
      },
      {
        data: buildApplicationsSheet(report),
        sheet: 'Applications',
        columns: REPORT_COLUMNS.map(column => ({ width: column.width })),
        stickyRowsCount: 1,
        showGridLines: false,
        zoomScale: 0.85,
      },
      {
        data: buildStatusGuideSheet(),
        sheet: 'Status Guide',
        columns: [{ width: 24 }, { width: 72 }],
        stickyRowsCount: 1,
        showGridLines: false,
        zoomScale: 1,
      },
      {
        data: buildCampaignPerformanceSheet(report),
        sheet: 'Campaign Performance',
        columns: CAMPAIGN_PERFORMANCE_COLUMNS.map(column => ({
          width: column.width,
        })),
        stickyRowsCount: 1,
        showGridLines: false,
        zoomScale: 0.9,
      },
    ],
    {
      fontFamily: 'Arial',
      fontSize: 10,
    },
  ).toBuffer()

  return new Uint8Array(output)
}

export function buildExpertApplicationReportFilename(
  range: ExpertApplicationReportRange,
): string {
  const start = formatIndiaParts(range.startAt)
  const end = formatIndiaParts(range.endAt)
  const compact = (value: string) => value.replace(/[-:]/g, '').replace(' ', '-')

  return `sharingminds-expert-applications-${compact(
    `${start.date} ${start.time.slice(0, 5)}`,
  )}-to-${compact(`${end.date} ${end.time.slice(0, 5)}`)}-IST.xlsx`
}
