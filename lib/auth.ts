import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { users } from './db/schema/users';
import { betterAuthAccounts, betterAuthSessions, betterAuthVerifications } from './db/schema/auth';
import { roles, userRoles } from './db/schema';

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
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: ['openid', 'email', 'profile'],
      accessType: 'offline',
      prompt: 'consent',
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
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          if (!session.userId) {
            return;
          }

          try {
            const existingRoles = await db
              .select()
              .from(userRoles)
              .where(eq(userRoles.userId, session.userId));

            if (existingRoles.length > 0) {
              return;
            }

            const [menteeRole] = await db
              .select()
              .from(roles)
              .where(eq(roles.name, 'mentee'))
              .limit(1);

            if (!menteeRole) {
              return;
            }

            await db
              .insert(userRoles)
              .values({
                userId: session.userId,
                roleId: menteeRole.id,
                assignedBy: session.userId,
              })
              .onConflictDoNothing();

            console.info(`[auth] Auto-assigned mentee role to user ${session.userId}`);
          } catch (error) {
            console.error('[auth] Failed to auto-assign mentee role', error);
          }
        },
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
});

export type Session = typeof auth.$Infer.Session;
