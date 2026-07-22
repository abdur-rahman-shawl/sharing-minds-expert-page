import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mentorApplications, mentors } from '@/lib/db/schema'
import type {
  MentorApplicationStatusData,
  MentorStatusData,
} from '@/lib/mentor-onboarding'
import { areMentorApplicationsEnabled } from '@/lib/mentor-applications/feature'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', isMentor: false },
        { status: 401 },
      )
    }

    const [mentor] = await db
      .select({
        id: mentors.id,
        registeredAt: mentors.createdAt,
        verificationStatus: mentors.verificationStatus,
        verificationNotes: mentors.verificationNotes,
        fullName: mentors.fullName,
        email: mentors.email,
        isVerified: mentors.isVerified,
        isExpert: mentors.isExpert,
        paymentStatus: mentors.paymentStatus,
        searchMode: mentors.searchMode,
        creationSource: mentors.creationSource,
      })
      .from(mentors)
      .where(eq(mentors.userId, session.user.id))
      .limit(1)

    if (!mentor) {
      if (!areMentorApplicationsEnabled()) {
        return NextResponse.json({
          success: true,
          isMentor: false,
          mentor: null,
          isApplicant: false,
          application: null,
        })
      }

      const [application] = await db
        .select({
          id: mentorApplications.id,
          status: mentorApplications.status,
          email: mentorApplications.email,
          verificationNotes: mentorApplications.applicantVisibleNotes,
          submittedAt: mentorApplications.submittedAt,
          updatedAt: mentorApplications.updatedAt,
          mentorId: mentorApplications.mentorId,
        })
        .from(mentorApplications)
        .where(eq(mentorApplications.linkedUserId, session.user.id))
        .limit(1)

      const responseApplication: MentorApplicationStatusData | null = application
        ? {
            ...application,
            submittedAt: application.submittedAt?.toISOString() || null,
            updatedAt: application.updatedAt.toISOString(),
          }
        : null

      return NextResponse.json({
        success: true,
        isMentor: false,
        mentor: null,
        isApplicant: Boolean(responseApplication),
        application: responseApplication,
      })
    }

    const responseMentor: MentorStatusData = {
      ...mentor,
      registeredAt: mentor.registeredAt.toISOString(),
      fullName: mentor.fullName || session.user.name || 'SharingMinds Mentor',
      email: mentor.email || session.user.email || '',
    }

    return NextResponse.json({
      success: true,
      isMentor: true,
      mentor: responseMentor,
      isApplicant: false,
      application: null,
    })
  } catch (error) {
    console.error('[mentor-status] Failed to load mentor status', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check mentor status', isMentor: false },
      { status: 500 },
    )
  }
}
