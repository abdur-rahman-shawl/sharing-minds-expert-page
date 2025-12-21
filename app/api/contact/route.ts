import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendContactSubmissionEmail } from '@/lib/emails'
import { db } from '@/lib/db'
import { contactSubmissions } from '@/lib/db/schema'

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('A valid email is required').max(320),
  subject: z.string().trim().min(1, 'Subject is required').max(200),
  message: z.string().trim().min(1, 'Message is required').max(4000),
  consent: z.boolean().refine(val => val, { message: 'Consent is required' }),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Invalid contact submission'
      return NextResponse.json({ success: false, error: firstError }, { status: 400 })
    }

    const { name, email, subject, message, consent } = parsed.data
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      null
    const userAgent = request.headers.get('user-agent') || null

    await db.insert(contactSubmissions).values({
      name,
      email,
      subject,
      message,
      consent,
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
    })

    const result = await sendContactSubmissionEmail({ name, email, subject, message })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to send contact request' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error handling contact submission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit contact request' },
      { status: 500 }
    )
  }
}
