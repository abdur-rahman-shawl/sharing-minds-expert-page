import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mentors, mentorContent, courses, courseModules } from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { z } from 'zod'

const createModuleSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    orderIndex: z.number().int().min(0),
    learningObjectives: z.string().optional(),
    estimatedDurationMinutes: z.number().positive().optional(),
})

type RouteContext = { params: Promise<{ id: string }> }

async function getMentorCourse(request: NextRequest, contentId: string) {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return { error: 'Unauthorized', status: 401 }

    const [mentor] = await db.select().from(mentors).where(eq(mentors.userId, session.user.id)).limit(1)
    if (!mentor) return { error: 'Mentor not found', status: 404 }

    const [content] = await db
        .select()
        .from(mentorContent)
        .where(and(eq(mentorContent.id, contentId), eq(mentorContent.mentorId, mentor.id)))
        .limit(1)
    if (!content) return { error: 'Content not found', status: 404 }

    const [courseRow] = await db.select().from(courses).where(eq(courses.contentId, contentId)).limit(1)
    if (!courseRow) return { error: 'Course not found', status: 404 }

    return { courseRow }
}

// GET /api/mentors/content/[id]/course/modules
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params
        const result = await getMentorCourse(request, id)
        if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

        const modules = await db
            .select()
            .from(courseModules)
            .where(eq(courseModules.courseId, result.courseRow.id))
            .orderBy(asc(courseModules.orderIndex))

        return NextResponse.json(modules)
    } catch (error) {
        console.error('GET modules error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/mentors/content/[id]/course/modules
export async function POST(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params
        const result = await getMentorCourse(request, id)
        if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

        const body = await request.json()
        const parsed = createModuleSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
        }

        const [created] = await db
            .insert(courseModules)
            .values({ courseId: result.courseRow.id, ...parsed.data })
            .returning()

        return NextResponse.json(created, { status: 201 })
    } catch (error) {
        console.error('POST module error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
