import { and, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { mentorApplicationFiles, mentorApplications } from '@/lib/db/schema'
import {
  getApplicationAdmin,
  getVerifiedApplicationUser,
} from '@/lib/mentor-applications/auth'
import { jsonError } from '@/lib/mentor-applications/http'
import { verifyMentorApplicationInternalAuthorization } from '@/lib/mentor-applications/internal-auth'
import {
  getMentorApplicationFromSession,
  MentorApplicationSessionError,
} from '@/lib/mentor-applications/session'
import { createApplicationFileSignedUrl } from '@/lib/mentor-applications/storage'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const [record] = await db
      .select({
        file: mentorApplicationFiles,
        application: mentorApplications,
      })
      .from(mentorApplicationFiles)
      .innerJoin(
        mentorApplications,
        eq(mentorApplicationFiles.applicationId, mentorApplications.id),
      )
      .where(
        and(
          eq(mentorApplicationFiles.id, id),
          eq(mentorApplicationFiles.isCurrent, true),
        ),
      )
      .limit(1)

    if (!record) return jsonError('File not found', 404)

    // Approved profile images are intentionally public through this stable
    // endpoint. Storage itself remains private and every redirect is short-lived.
    let authorized =
      record.file.kind === 'PROFILE_IMAGE' &&
      record.application.status === 'APPROVED' &&
      Boolean(record.application.mentorId)

    if (!authorized) {
      authorized = verifyMentorApplicationInternalAuthorization(
        request.headers.get('authorization'),
      )
    }

    if (!authorized) {
      try {
        const scopedApplication = await getMentorApplicationFromSession(request)
        authorized = scopedApplication.id === record.application.id
      } catch (error) {
        if (!(error instanceof MentorApplicationSessionError)) throw error
      }
    }

    if (!authorized) {
      const user = await getVerifiedApplicationUser(request)
      authorized = Boolean(
        user && record.application.linkedUserId === user.id,
      )
    }

    if (!authorized) {
      authorized = Boolean(await getApplicationAdmin(request))
    }
    if (!authorized) return jsonError('File not found', 404)

    const signedUrl = await createApplicationFileSignedUrl({
      storageBucket: record.file.storageBucket,
      storagePath: record.file.storagePath,
      expiresInSeconds: 60,
    })
    const response = NextResponse.redirect(signedUrl, 302)
    response.headers.set('Cache-Control', 'private, no-store, max-age=0')
    response.headers.set('Referrer-Policy', 'no-referrer')
    return response
  } catch (error) {
    console.error('[mentor-applications] File authorization failed', error)
    return jsonError('Unable to retrieve the file', 500)
  }
}
