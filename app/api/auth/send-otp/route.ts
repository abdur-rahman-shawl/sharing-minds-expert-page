import { NextRequest, NextResponse } from 'next/server'
import { db, emailVerifications } from '@/lib/db'
import { eq } from 'drizzle-orm'

// Generate 6-digit OTP
function generateOTP(): number {
  return Math.floor(100000 + Math.random() * 900000)
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10) // OTP expires in 10 minutes

    // Store OTP in database using Drizzle
    try {
      await db
        .insert(emailVerifications)
        .values({
          email,
          code: otp,
          expiresAt
        })
        .onConflictDoUpdate({
          target: emailVerifications.email,
          set: {
            code: otp,
            expiresAt,
            createdAt: new Date()
          }
        })
    } catch (dbError) {
      console.error('Database error storing OTP:', dbError)
      return NextResponse.json(
        { success: false, error: 'Failed to generate OTP' },
        { status: 500 }
      )
    }

    // In production, you would send the OTP via email service
    // For now, we'll just log it (remove in production!)
    console.log(`OTP for ${email}: ${otp}`)

    // TODO: Implement actual email sending using a service like SendGrid, Resend, or Nodemailer
    // Example with Nodemailer:
    /*
    const transporter = nodemailer.createTransport({...})
    await transporter.sendMail({
      from: 'noreply@sharingminds.com',
      to: email,
      subject: 'Your OTP for SharingMinds',
      html: `<p>Your OTP is: <strong>${otp}</strong></p>
             <p>This OTP will expire in 10 minutes.</p>`
    })
    */

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // Remove this in production!
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    })
  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}