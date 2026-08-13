import { betterAuth } from 'better-auth';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { users } from './db/schema/users';
import { betterAuthAccounts, betterAuthSessions, betterAuthVerifications } from './db/schema/auth';
import { roles, userRoles } from './db/schema';
import { areMentorApplicationsEnabled } from './mentor-applications/feature';
import { claimMentorApplicationForVerifiedUser } from './mentor-applications/promotion';
import { isLegacyMentorApplicationAutoClaimEnabled } from './expert-registration/feature';
import { passwordValidation } from './validations/auth';

async function assignDefaultMenteeRole(userId: string) {
  const existingRoles = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.userId, userId));

  if (existingRoles.length > 0) return;

  const [menteeRole] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, 'mentee'))
    .limit(1);

  if (!menteeRole) return;

  await db
    .insert(userRoles)
    .values({
      userId,
      roleId: menteeRole.id,
      assignedBy: userId,
    })
    .onConflictDoNothing();
}

async function reconcileVerifiedMentorApplication(userId: string) {
  if (
    !areMentorApplicationsEnabled() ||
    !isLegacyMentorApplicationAutoClaimEnabled()
  ) return;

  const [user] = await db
    .select({
      email: users.email,
      emailVerified: users.emailVerified,
      isActive: users.isActive,
      isBlocked: users.isBlocked,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (
    !user ||
    user.emailVerified !== true ||
    user.isActive === false ||
    user.isBlocked === true
  ) {
    return;
  }

  await claimMentorApplicationForVerifiedUser({
    userId,
  });
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: users,
      session: betterAuthSessions,
      account: betterAuthAccounts,
      verification: betterAuthVerifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: ['openid', 'email', 'profile'],
      accessType: 'offline',
      prompt: 'select_account consent',
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      scope: ['openid', 'email', 'profile'],
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  hooks: {
    before: createAuthMiddleware(async context => {
      if (context.path !== '/sign-up/email') return;

      const password = context.body?.password;
      const validation = passwordValidation.safeParse(password);
      if (!validation.success) {
        throw new APIError('BAD_REQUEST', {
          message:
            validation.error.issues[0]?.message ||
            'Password does not meet the security requirements',
        });
      }
    }),
  },
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          if (!session.userId) {
            return;
          }

          try {
            await assignDefaultMenteeRole(session.userId);
          } catch (error) {
            console.error('[auth] Failed to auto-assign mentee role', error);
          }

          try {
            await reconcileVerifiedMentorApplication(session.userId);
          } catch (error) {
            // Login must remain available if reconciliation needs a retry or
            // manual conflict resolution. The explicit claim route is the
            // user-facing retry path.
            console.error('[auth] Failed to reconcile mentor application', error);
          }
        },
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
});

export type Session = typeof auth.$Infer.Session;
