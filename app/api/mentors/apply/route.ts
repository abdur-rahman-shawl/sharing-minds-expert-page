import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { uploadProfilePicture, uploadResume } from '@/lib/storage'
import { sendApplicationReceivedEmail } from '@/lib/emails'

export async function POST(request: NextRequest) {
  console.log('🚀 === MENTOR APPLICATION API CALLED ===')

  try {
    const formData = await request.formData()
    console.log('📋 FormData received')

    // Extract form data
    const userId = formData.get('userId') as string
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const countryId = formData.get('countryId') as string
    const stateId = formData.get('stateId') as string
    const cityId = formData.get('cityId') as string
    const title = formData.get('title') as string
    const company = formData.get('company') as string
    const industry = formData.get('industry') as string
    const experience = formData.get('experience') as string
    const expertise = formData.get('expertise') as string
    const about = formData.get('about') as string
    const linkedinUrl = formData.get('linkedinUrl') as string
    const availability = formData.get('availability') as string
    const profilePicture = formData.get('profilePicture') as File
    const resume = formData.get('resume') as File

    console.log('👤 Extracted userId:', userId)

    // Validate required fields
    if (!userId) {
      console.error('❌ VALIDATION FAILED: No user ID provided')
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    console.log('🔍 Step 1: Checking if user exists...')
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, name, email')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      console.error('❌ USER NOT FOUND:', userId)
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('✅ User found:', user)

    // Check if mentor profile already exists
    console.log('🔍 Step 2: Checking for existing mentor profile...')
    const { data: existingMentor } = await supabaseAdmin
      .from('mentors')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existingMentor) {
      console.error('❌ MENTOR ALREADY EXISTS for user:', userId)
      return NextResponse.json(
        { success: false, error: 'Mentor profile already exists' },
        { status: 400 }
      )
    }

    // Upload files
    console.log('🖼️ Step 3: Uploading files...')
    let profileImageUrl = null
    let resumeUrl = null

    if (profilePicture && profilePicture.size > 0) {
      try {
        const uploadResult = await uploadProfilePicture(profilePicture, userId)
        profileImageUrl = uploadResult.url
        console.log('✅ Profile picture uploaded')
      } catch (uploadError) {
        console.error('❌ Profile picture upload failed:', uploadError)
        return NextResponse.json(
          { success: false, error: 'Failed to upload profile picture' },
          { status: 400 }
        )
      }
    }

    if (resume && resume.size > 0) {
      try {
        const uploadResult = await uploadResume(resume, userId)
        resumeUrl = uploadResult.url
        console.log('✅ Resume uploaded')
      } catch (uploadError) {
        console.error('❌ Resume upload failed:', uploadError)
        return NextResponse.json(
          { success: false, error: `Failed to upload resume: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}` },
          { status: 400 }
        )
      }
    }

    // Get location names
    console.log('🌍 Step 4: Fetching location names...')
    let countryName = null, stateName = null, cityName = null

    if (countryId) {
      const { data: country } = await supabaseAdmin
        .from('countries')
        .select('name')
        .eq('id', countryId)
        .single()
      countryName = country?.name
    }

    if (stateId) {
      const { data: state } = await supabaseAdmin
        .from('states')
        .select('name')
        .eq('id', stateId)
        .single()
      stateName = state?.name
    }

    if (cityId) {
      const { data: city } = await supabaseAdmin
        .from('cities')
        .select('name')
        .eq('id', cityId)
        .single()
      cityName = city?.name
    }

    // Create mentor profile
    console.log('📝 Step 5: Creating mentor profile...')
    const mentorData = {
      user_id: userId,
      full_name: fullName,
      email,
      phone,
      country: countryName,
      state: stateName,
      city: cityName,
      title,
      company,
      industry,
      expertise,
      experience_years: experience ? parseInt(experience) : null,
      about: about || null,
      linkedin_url: linkedinUrl,
      availability,
      profile_image_url: profileImageUrl,
      resume_url: resumeUrl,
      hourly_rate: '50.00',
      currency: 'USD',
      verification_status: 'IN_PROGRESS',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: newMentor, error: mentorError } = await supabaseAdmin
      .from('mentors')
      .insert(mentorData)
      .select()
      .single()

    if (mentorError) {
      console.error('❌ DATABASE INSERT ERROR:', mentorError)
      return NextResponse.json(
        { success: false, error: 'Failed to create mentor profile' },
        { status: 500 }
      )
    }

    console.log('🎉 Mentor profile created:', newMentor.id)

    // Assign mentor role
    console.log('👤 Step 6: Assigning mentor role...')

    // First, get the mentor role ID
    const { data: mentorRole } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('name', 'mentor')
      .single()

    if (mentorRole) {
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: mentorRole.id,
          assigned_by: userId,
          assigned_at: new Date().toISOString()
        })

      if (roleError && !roleError.message.includes('duplicate')) {
        console.error('❌ Role assignment error:', roleError)
      } else {
        console.log('✅ Mentor role assigned')
      }
    }

    // Send application received email
    console.log('📧 Step 7: Sending application received email...')
    try {
      await sendApplicationReceivedEmail(email, fullName)
      console.log('✅ Application received email sent successfully')
    } catch (emailError) {
      console.error('❌ Failed to send application received email:', emailError)
      // We don't want to fail the whole request if the email fails
      // but we should log it.
    }

    console.log('🎉 === MENTOR APPLICATION COMPLETED SUCCESSFULLY ===')

    return NextResponse.json({
      success: true,
      message: 'Mentor application submitted successfully',
      data: {
        id: newMentor.id,
        userId,
        status: 'IN_PROGRESS'
      }
    })

  } catch (error) {
    console.error('❌ === FATAL ERROR IN MENTOR APPLICATION ===')
    console.error('Error details:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      { success: false, error: 'Failed to process mentor application: ' + errorMessage },
      { status: 500 }
    )
  }
}