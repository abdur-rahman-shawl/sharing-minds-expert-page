import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { MentorApplicationConflictError } from '@/lib/mentor-applications/application'
import { jsonError, validationError } from '@/lib/mentor-applications/http'
import { verifyMentorApplicationInternalAuthorization } from '@/lib/mentor-applications/internal-auth'
import { claimMentorApplicationForVerifiedUser } from '@/lib/mentor-applications/promotion'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const internalClaimSchema = z.object({
  userId: z.string().trim().min(1).max(255),
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

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return jsonError('A valid JSON body is required', 400)
    }

    const parsed = internalClaimSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const result = await claimMentorApplicationForVerifiedUser({
      userId: parsed.data.userId,
    })

    return NextResponse.json(
      {
        success: true,
        found: Boolean(result.application),
        linked: result.linked,
        application: result.application
          ? {
              id: result.application.id,
              status: result.application.status,
              mentorId: result.application.mentorId,
            }
          : null,
        promotion: result.promotion,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    if (error instanceof MentorApplicationConflictError) {
      return jsonError(error.message, 409)
    }
    console.error('[mentor-applications] Internal application claim failed', error)
    return jsonError('Unable to reconcile the mentor application', 500)
  }
}
