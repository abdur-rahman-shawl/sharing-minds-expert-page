import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mentors } from '@/lib/db/schema'
import { getUserWithRoles } from '@/lib/db/user-helpers'

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

    let mentorProfile = null as unknown

    if (isMentor) {
      const [mentor] = await db
        .select({
          id: mentors.id,
          verificationStatus: mentors.verificationStatus,
          fullName: mentors.fullName,
          email: mentors.email,
          phone: mentors.phone,
          title: mentors.title,
          company: mentors.company,
          city: mentors.city,
          country: mentors.country,
          industry: mentors.industry,
          expertise: mentors.expertise,
          experience: mentors.experience,
          about: mentors.about,
          linkedinUrl: mentors.linkedinUrl,
          githubUrl: mentors.githubUrl,
          websiteUrl: mentors.websiteUrl,
          hourlyRate: mentors.hourlyRate,
          currency: mentors.currency,
          availability: mentors.availability,
          headline: mentors.headline,
          maxMentees: mentors.maxMentees,
          profileImageUrl: mentors.profileImageUrl,
          resumeUrl: mentors.resumeUrl,
        })
        .from(mentors)
        .where(eq(mentors.userId, session.user.id))
        .limit(1)

      mentorProfile = mentor ?? null
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
        isAdmin: userWithRoles.roles.some((role) => role.name === 'admin'),
        isMentor,
        isMentee: userWithRoles.roles.some((role) => role.name === 'mentee'),
        isMentorWithIncompleteProfile:
          isMentor && (mentorProfile as any)?.verificationStatus === 'IN_PROGRESS',
      },
    })
  } catch (error) {
    console.error('Error fetching session with roles:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch session' }, { status: 500 })
  }
}
