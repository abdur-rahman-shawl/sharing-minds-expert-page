import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mentors, courseModules, courseSections, courses, mentorContent } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const updateSectionSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    orderIndex: z.number().int().min(0).optional(),
})

type RouteContext = { params: Promise<{ moduleId: string; sectionId: string }> }

async function verifyModuleOwnership(request: NextRequest, moduleId: string) {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return { error: 'Unauthorized', status: 401 }

    const [mentor] = await db.select().from(mentors).where(eq(mentors.userId, session.user.id)).limit(1)
    if (!mentor) return { error: 'Mentor not found', status: 404 }

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

    return { ok: true }
}

// PUT /api/mentors/content/modules/[moduleId]/sections/[sectionId]
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const { moduleId, sectionId } = await context.params
        const ownership = await verifyModuleOwnership(request, moduleId)
        if ('error' in ownership) return NextResponse.json({ error: ownership.error }, { status: ownership.status })

        const body = await request.json()
        const parsed = updateSectionSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
        }

        const [updated] = await db
            .update(courseSections)
            .set({ ...parsed.data, updatedAt: new Date() })
            .where(eq(courseSections.id, sectionId))
            .returning()

        if (!updated) return NextResponse.json({ error: 'Section not found' }, { status: 404 })

        return NextResponse.json(updated)
    } catch (error) {
        console.error('PUT section error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE /api/mentors/content/modules/[moduleId]/sections/[sectionId]
export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const { moduleId, sectionId } = await context.params
        const ownership = await verifyModuleOwnership(request, moduleId)
        if ('error' in ownership) return NextResponse.json({ error: ownership.error }, { status: ownership.status })

        await db.delete(courseSections).where(eq(courseSections.id, sectionId))

        return NextResponse.json({ message: 'Section deleted' })
    } catch (error) {
        console.error('DELETE section error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
