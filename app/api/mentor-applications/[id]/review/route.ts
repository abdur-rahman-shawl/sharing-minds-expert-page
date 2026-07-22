import { eq, sql } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { db } from '@/lib/db'
import { mentorApplicationEvents, mentorApplications } from '@/lib/db/schema'
import { serializeMentorApplication } from '@/lib/mentor-applications/application'
import { getApplicationAdmin } from '@/lib/mentor-applications/auth'
import { jsonError, validationError } from '@/lib/mentor-applications/http'
import { promoteMentorApplication } from '@/lib/mentor-applications/promotion'
import {
  assertTrustedOrigin,
  MentorApplicationSecurityError,
} from '@/lib/mentor-applications/security'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const reviewSchema = z
  .object({
    status: z.enum(['IN_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED']),
    applicantVisibleNotes: z.string().trim().max(3000).nullable().optional(),
    internalReviewNotes: z.string().trim().max(5000).nullable().optional(),
  })
  .superRefine((value, context) => {
    if (
      ['CHANGES_REQUESTED', 'REJECTED'].includes(value.status) &&
      !value.applicantVisibleNotes
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['applicantVisibleNotes'],
        message: 'Applicant-visible notes are required for this decision',
      })
    }
  })

const allowedTransitions: Record<string, string[]> = {
  SUBMITTED: ['IN_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED'],
  RESUBMITTED: ['IN_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED'],
  IN_REVIEW: ['CHANGES_REQUESTED', 'APPROVED', 'REJECTED'],
}

const eventByStatus = {
  IN_REVIEW: 'REVIEW_STARTED',
  CHANGES_REQUESTED: 'CHANGES_REQUESTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    assertTrustedOrigin(request)
    const admin = await getApplicationAdmin(request)
    if (!admin) return jsonError('Administrator access is required', 403)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return jsonError('Request body must be valid JSON', 400)
    }
    const parsed = reviewSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const result = await db.transaction(async transaction => {
      await transaction.execute(
        sql`select pg_advisory_xact_lock(hashtextextended(${`mentor-application-review:${id}`}, 0))`,
      )
      const [current] = await transaction
        .select()
        .from(mentorApplications)
        .where(eq(mentorApplications.id, id))
        .limit(1)
      if (!current) return null

      if (!allowedTransitions[current.status]?.includes(parsed.data.status)) {
        return { conflict: true as const, current }
      }

      const now = new Date()
      const isDecision = ['APPROVED', 'REJECTED'].includes(parsed.data.status)
      const [updated] = await transaction
        .update(mentorApplications)
        .set({
          status: parsed.data.status,
          reviewedAt: now,
          decidedAt: isDecision ? now : null,
          reviewedBy: admin.id,
          ...(parsed.data.applicantVisibleNotes === undefined
            ? {}
            : { applicantVisibleNotes: parsed.data.applicantVisibleNotes }),
          ...(parsed.data.internalReviewNotes === undefined
            ? {}
            : { internalReviewNotes: parsed.data.internalReviewNotes }),
          updatedAt: now,
        })
        .where(eq(mentorApplications.id, current.id))
        .returning()

      await transaction.insert(mentorApplicationEvents).values({
        applicationId: current.id,
        actorUserId: admin.id,
        eventType: eventByStatus[parsed.data.status],
        fromStatus: current.status,
        toStatus: parsed.data.status,
        metadata: { hasInternalNotes: Boolean(parsed.data.internalReviewNotes) },
      })

      const promotion =
        parsed.data.status === 'APPROVED'
          ? await promoteMentorApplication(current.id, transaction)
          : null
      return { conflict: false as const, application: updated, promotion }
    })

    if (!result) return jsonError('Mentor application not found', 404)
    if (result.conflict) {
      return jsonError(
        `Cannot transition application from ${result.current.status} to ${parsed.data.status}`,
        409,
      )
    }

    return NextResponse.json({
      success: true,
      application: await serializeMentorApplication(result.application),
      promotion: result.promotion,
    })
  } catch (error) {
    if (error instanceof MentorApplicationSecurityError) {
      return jsonError(error.message, 403)
    }
    console.error('[mentor-applications] Admin review failed', error)
    return jsonError('Unable to review the mentor application', 500)
  }
}
