import 'server-only'

import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { userHasRole } from '@/lib/db/user-helpers'

export type VerifiedApplicationUser = {
  id: string
  email: string
  name: string | null
}

export async function getVerifiedApplicationUser(
  request: NextRequest,
): Promise<VerifiedApplicationUser | null> {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.id) return null

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      emailVerified: users.emailVerified,
      name: users.name,
      isActive: users.isActive,
      isBlocked: users.isBlocked,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)

  if (
    !user ||
    user.emailVerified !== true ||
    user.isActive === false ||
    user.isBlocked === true
  ) {
    return null
  }

  return { id: user.id, email: user.email, name: user.name }
}

export async function getApplicationAdmin(
  request: NextRequest,
): Promise<VerifiedApplicationUser | null> {
  const user = await getVerifiedApplicationUser(request)
  if (!user) return null
  return (await userHasRole(user.id, 'admin')) ? user : null
}
