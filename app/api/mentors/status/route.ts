import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user session
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          isMentor: false
        },
        { status: 401 }
      )
    }

    // Check if user has a mentor profile
    const { data: mentor, error } = await supabaseAdmin
      .from('mentors')
      .select('id, created_at, verification_status, full_name, email')
      .eq('user_id', session.user.id)
      .single()

    if (error) {
      // No mentor profile found is not an error condition
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: true,
          isMentor: false,
          mentor: null
        })
      }

      // Actual database error
      console.error('Error checking mentor status:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to check mentor status',
          isMentor: false
        },
        { status: 500 }
      )
    }

    // User is a registered mentor
    return NextResponse.json({
      success: true,
      isMentor: true,
      mentor: {
        id: mentor.id,
        registeredAt: mentor.created_at,
        verificationStatus: mentor.verification_status,
        fullName: mentor.full_name,
        email: mentor.email
      }
    })

  } catch (error) {
    console.error('Error in mentor status check:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        isMentor: false
      },
      { status: 500 }
    )
  }
}