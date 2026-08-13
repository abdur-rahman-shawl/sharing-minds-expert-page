import type {
  MentorRegistrationDraftStatus,
} from '@/lib/db/schema/mentor-registration-enums'
import type { MentorStatusData } from '@/lib/mentor-onboarding'

export const EXPERT_REGISTRATION_FINALIZATION_OUTCOMES = [
  'CREATED',
  'REPLAYED',
  'EXISTING_PROFILE',
] as const

export type ExpertRegistrationFinalizationOutcome =
  (typeof EXPERT_REGISTRATION_FINALIZATION_OUTCOMES)[number]

export interface ExpertRegistrationFinalizationResult {
  mentor: MentorStatusData
  outcome: ExpertRegistrationFinalizationOutcome
}

const RESTORABLE_DRAFT_STATUSES = new Set<MentorRegistrationDraftStatus>([
  'DRAFT',
  'READY_FOR_AUTH',
])

export function isRestorableExpertRegistrationDraft(
  status: MentorRegistrationDraftStatus,
): boolean {
  return RESTORABLE_DRAFT_STATUSES.has(status)
}

export function shouldClearExpertRegistrationDraftAfterFinalization(
  outcome: ExpertRegistrationFinalizationOutcome,
): boolean {
  return outcome !== 'EXISTING_PROFILE'
}

export function getExistingMentorFinalizationOutcome(input: {
  existingRegistrationDraftId: string | null
  currentDraftId: string
}): Extract<
  ExpertRegistrationFinalizationOutcome,
  'REPLAYED' | 'EXISTING_PROFILE'
> {
  return input.existingRegistrationDraftId === input.currentDraftId
    ? 'REPLAYED'
    : 'EXISTING_PROFILE'
}
