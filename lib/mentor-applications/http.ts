import { NextResponse } from 'next/server'
import type { ZodError } from 'zod'

import { MentorApplicationSecurityError } from './security'

export function jsonError(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details === undefined ? {} : { details }),
    },
    { status },
  )
}

export function validationError(error: ZodError) {
  return NextResponse.json(
    {
      success: false,
      error: 'Please correct the submitted fields',
      fieldErrors: error.flatten().fieldErrors,
    },
    { status: 422 },
  )
}

export function handleMentorApplicationRouteError(
  context: string,
  error: unknown,
) {
  if (error instanceof MentorApplicationSecurityError) {
    return jsonError(error.message, 403)
  }

  console.error(`[mentor-applications] ${context}`, error)
  return jsonError('Unable to process the request', 500)
}

export function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const databaseError = error as { code?: string; cause?: { code?: string } }
  return databaseError.code === '23505' || databaseError.cause?.code === '23505'
}
