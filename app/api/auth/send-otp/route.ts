import { NextRequest, NextResponse } from 'next/server'
import { sendVerificationOtp } from '@/lib/otp'

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
  }

  const result = await sendVerificationOtp(email)

  if (result.success) {
    return NextResponse.json({ success: true, message: result.message })
  }

  return NextResponse.json({ success: false, error: result.error }, { status: 500 })
}
