import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mentorApplications, mentors } from '@/lib/db/schema'
import { getUserWithRoles } from '@/lib/db/user-helpers'
import type {
  MentorApplicationStatusData,
  MentorProfileData,
} from '@/lib/mentor-onboarding'
import { areMentorApplicationsEnabled } from '@/lib/mentor-applications/feature'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({
        success: true,
        data: {
          session: null,
          user: null,
          roles: [],
          mentorProfile: null,
          mentorApplication: null,
          isAdmin: false,
          isMentor: false,
          isMentee: false,
          isMentorWithIncompleteProfile: false,
        },
      })
    }

    const userWithRoles = await getUserWithRoles(session.user.id)

    if (!userWithRoles) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const isMentor = userWithRoles.roles.some((role) => role.name === 'mentor')

    let mentorProfile: MentorProfileData | null = null
    let mentorApplication: MentorApplicationStatusData | null = null

    if (isMentor) {
      const [mentor] = await db
        .select({
          id: mentors.id,
          verificationStatus: mentors.verificationStatus,
          fullName: mentors.fullName,
          email: mentors.email,
          phone: mentors.phone,
          title: mentors.title,
          normalizedTitle: mentors.normalizedTitle,
          company: mentors.company,
          city: mentors.city,
          state: mentors.state,
          country: mentors.country,
          industry: mentors.industry,
          normalizedIndustry: mentors.normalizedIndustry,
          expertise: mentors.expertise,
          experience: mentors.experience,
          about: mentors.about,
          linkedinUrl: mentors.linkedinUrl,
          githubUrl: mentors.githubUrl,
          websiteUrl: mentors.websiteUrl,
          hourlyRate: mentors.hourlyRate,
          adminHourlyRateOverride: mentors.adminHourlyRateOverride,
          currency: mentors.currency,
          availability: mentors.availability,
          headline: mentors.headline,
          maxMentees: mentors.maxMentees,
          profileImageUrl: mentors.profileImageUrl,
          bannerImageUrl: mentors.bannerImageUrl,
          resumeUrl: mentors.resumeUrl,
          isAvailable: mentors.isAvailable,
          isVerified: mentors.isVerified,
          isExpert: mentors.isExpert,
          paymentStatus: mentors.paymentStatus,
          searchMode: mentors.searchMode,
          creationSource: mentors.creationSource,
          verificationNotes: mentors.verificationNotes,
          createdAt: mentors.createdAt,
          updatedAt: mentors.updatedAt,
        })
        .from(mentors)
        .where(eq(mentors.userId, session.user.id))
        .limit(1)

      mentorProfile = mentor
        ? {
            ...mentor,
            createdAt: mentor.createdAt.toISOString(),
            updatedAt: mentor.updatedAt.toISOString(),
          }
        : null
    }

    if (!mentorProfile && areMentorApplicationsEnabled()) {
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

      mentorApplication = application
        ? {
            ...application,
            submittedAt: application.submittedAt?.toISOString() || null,
            updatedAt: application.updatedAt.toISOString(),
          }
        : null
    }

    return NextResponse.json({
      success: true,
      data: {
        session: {
          ...session,
          user: {
            ...session.user,
            ...userWithRoles,
          },
        },
        user: userWithRoles,
        roles: userWithRoles.roles,
        mentorProfile,
        mentorApplication,
        isAdmin: userWithRoles.roles.some((role) => role.name === 'admin'),
        isMentor,
        isMentee: userWithRoles.roles.some((role) => role.name === 'mentee'),
        isMentorWithIncompleteProfile:
          isMentor &&
          (!mentorProfile ||
            mentorProfile.verificationStatus !== 'VERIFIED' ||
            mentorProfile.isVerified !== true),
      },
    })
  } catch (error) {
    console.error('Error fetching session with roles:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch session' }, { status: 500 })
  }
}
