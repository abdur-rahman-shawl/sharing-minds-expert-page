import { NextResponse, type NextRequest } from 'next/server'

import { areMentorApplicationsEnabled } from '@/lib/mentor-applications/feature'

const UNAVAILABLE_MESSAGE = 'Mentor applications are temporarily unavailable'

export function middleware(_request: NextRequest) {
  if (areMentorApplicationsEnabled()) {
    return NextResponse.next()
  }

  return NextResponse.json(
    { success: false, error: UNAVAILABLE_MESSAGE },
    {
      status: 503,
      headers: {
        'Cache-Control': 'no-store',
        'Retry-After': '300',
      },
    },
  )
}

export const config = {
  matcher: [
    '/api/mentor-applications/:path*',
    '/api/internal/mentor-applications/:path*',
  ],
}
