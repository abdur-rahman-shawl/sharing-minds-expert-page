import { and, asc, eq, gt, isNotNull, isNull } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { db } from '@/lib/db'
import { mentorApplications } from '@/lib/db/schema'
import { jsonError, validationError } from '@/lib/mentor-applications/http'
import { verifyMentorApplicationInternalAuthorization } from '@/lib/mentor-applications/internal-auth'
import { promoteMentorApplication } from '@/lib/mentor-applications/promotion'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const reconciliationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().uuid().optional(),
})

export async function POST(request: NextRequest) {
  try {
    if (
      !verifyMentorApplicationInternalAuthorization(
        request.headers.get('authorization'),
      )
    ) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        {
          status: 401,
          headers: {
            'Cache-Control': 'no-store',
            'WWW-Authenticate': 'Bearer',
          },
        },
      )
    }

    let body: unknown = {}
    const rawBody = await request.text()
    if (rawBody) {
      try {
        body = JSON.parse(rawBody)
      } catch {
        return jsonError('A valid JSON body is required', 400)
      }
    }

    const parsed = reconciliationSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const candidatePage = await db
      .select({ id: mentorApplications.id })
      .from(mentorApplications)
      .where(
        and(
          eq(mentorApplications.status, 'APPROVED'),
          isNotNull(mentorApplications.linkedUserId),
          isNull(mentorApplications.mentorId),
          parsed.data.cursor
            ? gt(mentorApplications.id, parsed.data.cursor)
            : undefined,
        ),
      )
      .orderBy(asc(mentorApplications.id))
      .limit(parsed.data.limit + 1)

    const hasMore = candidatePage.length > parsed.data.limit
    const candidates = hasMore
      ? candidatePage.slice(0, parsed.data.limit)
      : candidatePage
    const nextCursor = hasMore
      ? candidates[candidates.length - 1]?.id ?? null
      : null

    const results = []
    for (const candidate of candidates) {
      try {
        results.push({
          applicationId: candidate.id,
          result: await promoteMentorApplication(candidate.id),
        })
      } catch (error) {
        console.error(
          `[mentor-applications] Reconciliation failed for ${candidate.id}`,
          error,
        )
        results.push({
          applicationId: candidate.id,
          result: { promoted: false, reason: 'RETRYABLE_ERROR', mentorId: null },
        })
      }
    }

    return NextResponse.json(
      {
        success: true,
        processed: results.length,
        results,
        nextCursor,
        hasMore,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('[mentor-applications] Reconciliation job failed', error)
    return jsonError('Unable to reconcile mentor applications', 500)
  }
}
