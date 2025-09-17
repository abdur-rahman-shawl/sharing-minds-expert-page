import { NextRequest, NextResponse } from 'next/server'
import { db, emailVerifications } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Get OTP from database using Drizzle
    const otpRecords = await db
      .select()
      .from(emailVerifications)
      .where(eq(emailVerifications.email, email))
      .limit(1)

    const otpRecord = otpRecords[0]

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: 'OTP not found. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if OTP matches (convert to string for comparison since input is string)
    if (otpRecord.code.toString() !== otp) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      )
    }

    // Check if OTP is expired
    const expiresAt = new Date(otpRecord.expiresAt)
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Mark email as verified (delete the OTP record)
    try {
      await db
        .delete(emailVerifications)
        .where(eq(emailVerifications.email, email))
    } catch (deleteError) {
      console.error('Error deleting OTP:', deleteError)
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}