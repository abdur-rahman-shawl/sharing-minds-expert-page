import { NextRequest, NextResponse } from 'next/server'
import { and, eq, gt, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { emailVerifications } from '@/lib/db/schema/email-verifications'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: 'Email and OTP required' }, { status: 400 })
    }

    const deleted = await db
      .delete(emailVerifications)
      .where(
        and(
          eq(emailVerifications.email, email),
          eq(emailVerifications.code, Number(otp)),
          gt(emailVerifications.expiresAt, sql`now()`),
        ),
      )
      .returning({ id: emailVerifications.id })

    if (deleted.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'OTP verified' })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
