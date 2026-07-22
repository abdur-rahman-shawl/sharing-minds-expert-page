import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Retained temporarily so older clients fail safely instead of bypassing the
 * guest-application review and promotion lifecycle.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error:
        'This application endpoint has been retired. Continue through /verified-experts.',
      replacement: '/api/mentor-applications/current/submit',
    },
    {
      status: 410,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}
