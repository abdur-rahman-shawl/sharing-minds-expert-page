import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mentors, courseModules, courseSections, courses, mentorContent } from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { z } from 'zod'

const createSectionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    orderIndex: z.number().int().min(0),
})

type RouteContext = { params: Promise<{ moduleId: string }> }

async function verifyModuleOwnership(request: NextRequest, moduleId: string) {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return { error: 'Unauthorized', status: 401 }

    const [mentor] = await db.select().from(mentors).where(eq(mentors.userId, session.user.id)).limit(1)
    if (!mentor) return { error: 'Mentor not found', status: 404 }

    // Module → Course → Content → verify mentor owns the content
    const [mod] = await db.select().from(courseModules).where(eq(courseModules.id, moduleId)).limit(1)
    if (!mod) return { error: 'Module not found', status: 404 }

    const [course] = await db.select().from(courses).where(eq(courses.id, mod.courseId)).limit(1)
    if (!course) return { error: 'Course not found', status: 404 }

    const [content] = await db
        .select()
        .from(mentorContent)
        .where(and(eq(mentorContent.id, course.contentId), eq(mentorContent.mentorId, mentor.id)))
        .limit(1)
    if (!content) return { error: 'Content not found', status: 404 }

    return { moduleId }
}

// GET /api/mentors/content/modules/[moduleId]/sections
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const { moduleId } = await context.params
        const result = await verifyModuleOwnership(request, moduleId)
        if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

        const sections = await db
            .select()
            .from(courseSections)
            .where(eq(courseSections.moduleId, moduleId))
            .orderBy(asc(courseSections.orderIndex))

        return NextResponse.json(sections)
    } catch (error) {
        console.error('GET sections error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/mentors/content/modules/[moduleId]/sections
export async function POST(request: NextRequest, context: RouteContext) {
    try {
        const { moduleId } = await context.params
        const result = await verifyModuleOwnership(request, moduleId)
        if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

        const body = await request.json()
        const parsed = createSectionSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
        }

        const [created] = await db
            .insert(courseSections)
            .values({ moduleId, ...parsed.data })
            .returning()

        return NextResponse.json(created, { status: 201 })
    } catch (error) {
        console.error('POST section error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
