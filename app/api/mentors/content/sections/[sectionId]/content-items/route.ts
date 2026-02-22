import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mentors, mentorContent, courses, courseModules, courseSections, sectionContentItems } from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { z } from 'zod'

const createItemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    type: z.enum(['VIDEO', 'PDF', 'DOCUMENT', 'URL', 'TEXT']),
    orderIndex: z.number().int().min(0),
    content: z.string().optional(),
    fileUrl: z.string().optional(),
    fileName: z.string().optional(),
    fileSize: z.number().optional(),
    mimeType: z.string().optional(),
    duration: z.number().optional(),
    isPreview: z.boolean().default(false),
})

type RouteContext = { params: Promise<{ sectionId: string }> }

async function verifySectionOwnership(request: NextRequest, sectionId: string) {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return { error: 'Unauthorized', status: 401 }

    const [mentor] = await db.select().from(mentors).where(eq(mentors.userId, session.user.id)).limit(1)
    if (!mentor) return { error: 'Mentor not found', status: 404 }

    // Section → Module → Course → Content → verify ownership
    const [section] = await db.select().from(courseSections).where(eq(courseSections.id, sectionId)).limit(1)
    if (!section) return { error: 'Section not found', status: 404 }

    const [mod] = await db.select().from(courseModules).where(eq(courseModules.id, section.moduleId)).limit(1)
    if (!mod) return { error: 'Module not found', status: 404 }

    const [course] = await db.select().from(courses).where(eq(courses.id, mod.courseId)).limit(1)
    if (!course) return { error: 'Course not found', status: 404 }

    const [content] = await db
        .select()
        .from(mentorContent)
        .where(and(eq(mentorContent.id, course.contentId), eq(mentorContent.mentorId, mentor.id)))
        .limit(1)
    if (!content) return { error: 'Content not found', status: 404 }

    return { sectionId }
}

// GET /api/mentors/content/sections/[sectionId]/content-items
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const { sectionId } = await context.params
        const result = await verifySectionOwnership(request, sectionId)
        if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

        const items = await db
            .select()
            .from(sectionContentItems)
            .where(eq(sectionContentItems.sectionId, sectionId))
            .orderBy(asc(sectionContentItems.orderIndex))

        return NextResponse.json(items)
    } catch (error) {
        console.error('GET items error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/mentors/content/sections/[sectionId]/content-items
export async function POST(request: NextRequest, context: RouteContext) {
    try {
        const { sectionId } = await context.params
        const result = await verifySectionOwnership(request, sectionId)
        if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

        const body = await request.json()
        const parsed = createItemSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
        }

        const [created] = await db
            .insert(sectionContentItems)
            .values({ sectionId, ...parsed.data })
            .returning()

        return NextResponse.json(created, { status: 201 })
    } catch (error) {
        console.error('POST item error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
