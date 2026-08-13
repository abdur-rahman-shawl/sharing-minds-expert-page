import { describe, expect, it } from 'vitest'

import {
  getExistingMentorFinalizationOutcome,
  isRestorableExpertRegistrationDraft,
  shouldClearExpertRegistrationDraftAfterFinalization,
} from './lifecycle'

describe('expert registration lifecycle', () => {
  it('restores only editable and authentication-ready drafts', () => {
    expect(isRestorableExpertRegistrationDraft('DRAFT')).toBe(true)
    expect(isRestorableExpertRegistrationDraft('READY_FOR_AUTH')).toBe(true)
    expect(isRestorableExpertRegistrationDraft('AUTHENTICATED')).toBe(false)
    expect(isRestorableExpertRegistrationDraft('FINALIZING')).toBe(false)
    expect(isRestorableExpertRegistrationDraft('COMPLETED')).toBe(false)
    expect(isRestorableExpertRegistrationDraft('EXPIRED')).toBe(false)
    expect(isRestorableExpertRegistrationDraft('ABANDONED')).toBe(false)
  })

  it('clears the browser draft only after a completed finalization', () => {
    expect(shouldClearExpertRegistrationDraftAfterFinalization('CREATED')).toBe(true)
    expect(shouldClearExpertRegistrationDraftAfterFinalization('REPLAYED')).toBe(true)
    expect(
      shouldClearExpertRegistrationDraftAfterFinalization('EXISTING_PROFILE'),
    ).toBe(false)
  })

  it('distinguishes an idempotent replay from a different existing profile', () => {
    expect(
      getExistingMentorFinalizationOutcome({
        existingRegistrationDraftId: 'draft-1',
        currentDraftId: 'draft-1',
      }),
    ).toBe('REPLAYED')
    expect(
      getExistingMentorFinalizationOutcome({
        existingRegistrationDraftId: 'draft-1',
        currentDraftId: 'draft-2',
      }),
    ).toBe('EXISTING_PROFILE')
    expect(
      getExistingMentorFinalizationOutcome({
        existingRegistrationDraftId: null,
        currentDraftId: 'draft-2',
      }),
    ).toBe('EXISTING_PROFILE')
  })
})
