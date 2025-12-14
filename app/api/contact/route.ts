import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendContactSubmissionEmail } from '@/lib/emails'

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('A valid email is required'),
  subject: z.string().trim().min(1, 'Subject is required'),
  message: z.string().trim().min(1, 'Message is required'),
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

    const { name, email, subject, message } = parsed.data
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
