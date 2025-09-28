import { and, eq } from 'drizzle-orm';
import { db } from './index';
import { users } from './schema/users';
import { roles } from './schema/roles';
import { userRoles } from './schema/user-roles';
import { mentors } from './schema/mentors';
import { mentees } from './schema/mentees';

export type UserRoleName = 'admin' | 'mentor' | 'mentee';

export async function getUserWithRoles(userId: string) {
  const userWithRoles = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      image: users.image,
      isActive: users.isActive,
      roleName: roles.name,
      roleDisplayName: roles.displayName,
    })
    .from(users)
    .leftJoin(userRoles, eq(users.id, userRoles.userId))
    .leftJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(users.id, userId));

  if (userWithRoles.length === 0) {
    return null;
  }

  const user = userWithRoles[0];
  const userRolesList = userWithRoles
    .filter((row) => row.roleName)
    .map((row) => ({
      name: row.roleName!,
      displayName: row.roleDisplayName!,
    }));

  return {
    ...user,
    roles: userRolesList,
  };
}

export async function assignRoleToUser(userId: string, roleName: UserRoleName, assignedBy?: string) {
  const role = await db.select().from(roles).where(eq(roles.name, roleName)).limit(1);

  if (role.length === 0) {
    throw new Error(`Role '${roleName}' not found`);
  }

  const existingRole = await db
    .select()
    .from(userRoles)
    .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, role[0].id)))
    .limit(1);

  if (existingRole.length > 0) {
    throw new Error(`User already has role '${roleName}'`);
  }

  await db.insert(userRoles).values({
    userId,
    roleId: role[0].id,
    assignedBy,
  });

  return true;
}

export async function removeRoleFromUser(userId: string, roleName: UserRoleName) {
  const role = await db.select().from(roles).where(eq(roles.name, roleName)).limit(1);

  if (role.length === 0) {
    throw new Error(`Role '${roleName}' not found`);
  }

  await db
    .delete(userRoles)
    .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, role[0].id)));

  return true;
}

export async function userHasRole(userId: string, roleName: UserRoleName): Promise<boolean> {
  const role = await db.select().from(roles).where(eq(roles.name, roleName)).limit(1);

  if (role.length === 0) {
    return false;
  }

  const userRole = await db
    .select()
    .from(userRoles)
    .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, role[0].id)))
    .limit(1);

  return userRole.length > 0;
}

export async function createMentorProfile(
  userId: string,
  mentorData: {
    title?: string;
    company?: string;
    industry?: string;
    expertise?: string[];
    hourlyRate?: number;
    headline?: string;
    about?: string;
  },
) {
  const hasMentorRole = await userHasRole(userId, 'mentor');
  if (!hasMentorRole) {
    await assignRoleToUser(userId, 'mentor');
  }

  const mentor = await db
    .insert(mentors)
    .values({
      userId,
      title: mentorData.title,
      company: mentorData.company,
      industry: mentorData.industry,
      expertise: mentorData.expertise ? JSON.stringify(mentorData.expertise) : null,
      hourlyRate: mentorData.hourlyRate?.toString(),
      headline: mentorData.headline,
      about: mentorData.about,
    })
    .returning();

  return mentor[0];
}

export async function createMenteeProfile(
  userId: string,
  menteeData: {
    currentRole?: string;
    careerGoals?: string;
    interests?: string[];
    skillsToLearn?: string[];
  },
) {
  const hasMenteeRole = await userHasRole(userId, 'mentee');
  if (!hasMenteeRole) {
    await assignRoleToUser(userId, 'mentee');
  }

  const mentee = await db
    .insert(mentees)
    .values({
      userId,
      currentRole: menteeData.currentRole,
      careerGoals: menteeData.careerGoals,
      interests: menteeData.interests ? JSON.stringify(menteeData.interests) : null,
      skillsToLearn: menteeData.skillsToLearn ? JSON.stringify(menteeData.skillsToLearn) : null,
    })
    .returning();

  return mentee[0];
}
