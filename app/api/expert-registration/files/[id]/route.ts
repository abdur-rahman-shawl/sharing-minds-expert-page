import { and, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'
import {
  mentorRegistrationDrafts,
  mentorRegistrationFiles,
  mentors,
} from '@/lib/db/schema'
import { getExpertRegistrationDraftFromRequest } from '@/lib/expert-registration/draft-session'
import { isLiveExpertRegistrationEnabled } from '@/lib/expert-registration/feature'
import {
  getApplicationAdmin,
  getAuthenticatedApplicationUser,
} from '@/lib/mentor-applications/auth'
import { createApplicationFileSignedUrl } from '@/lib/mentor-applications/storage'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function notFound() {
  return NextResponse.json(
    { success: false, error: 'File not found' },
    { status: 404, headers: { 'Cache-Control': 'private, no-store' } },
  )
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isLiveExpertRegistrationEnabled()) return notFound()

  try {
    const { id } = await params
    const [record] = await db
      .select({
        file: mentorRegistrationFiles,
        draft: mentorRegistrationDrafts,
        mentorUserId: mentors.userId,
        mentorVerified: mentors.isVerified,
      })
      .from(mentorRegistrationFiles)
      .innerJoin(
        mentorRegistrationDrafts,
        eq(
          mentorRegistrationFiles.registrationDraftId,
          mentorRegistrationDrafts.id,
        ),
      )
      .leftJoin(mentors, eq(mentorRegistrationFiles.mentorId, mentors.id))
      .where(
        and(
          eq(mentorRegistrationFiles.id, id),
          eq(mentorRegistrationFiles.isCurrent, true),
        ),
      )
      .limit(1)

    if (!record) return notFound()

    let authorized =
      record.file.kind === 'PROFILE_IMAGE' && record.mentorVerified === true

    if (!authorized) {
      const draft = await getExpertRegistrationDraftFromRequest(request)
      authorized = draft?.id === record.draft.id
    }

    if (!authorized) {
      const user = await getAuthenticatedApplicationUser(request)
      authorized = Boolean(
        user &&
          (record.draft.userId === user.id || record.mentorUserId === user.id),
      )
    }

    if (!authorized) authorized = Boolean(await getApplicationAdmin(request))
    if (!authorized) return notFound()

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
    console.error('[expert-registration] File authorization failed', error)
    return NextResponse.json(
      { success: false, error: 'Unable to retrieve the file' },
      { status: 500, headers: { 'Cache-Control': 'private, no-store' } },
    )
  }
}
