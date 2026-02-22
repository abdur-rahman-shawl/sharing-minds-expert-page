import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mentors, mentorContent, courses, courseModules, courseSections, sectionContentItems } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const updateItemSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    type: z.enum(['VIDEO', 'PDF', 'DOCUMENT', 'URL', 'TEXT']).optional(),
    orderIndex: z.number().int().min(0).optional(),
    content: z.string().optional(),
    fileUrl: z.string().optional(),
    fileName: z.string().optional(),
    fileSize: z.number().optional(),
    mimeType: z.string().optional(),
    duration: z.number().optional(),
    isPreview: z.boolean().optional(),
})

type RouteContext = { params: Promise<{ sectionId: string; itemId: string }> }

async function verifySectionOwnership(request: NextRequest, sectionId: string) {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return { error: 'Unauthorized', status: 401 }

    const [mentor] = await db.select().from(mentors).where(eq(mentors.userId, session.user.id)).limit(1)
    if (!mentor) return { error: 'Mentor not found', status: 404 }

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

    return { ok: true }
}

// PUT /api/mentors/content/sections/[sectionId]/content-items/[itemId]
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const { sectionId, itemId } = await context.params
        const ownership = await verifySectionOwnership(request, sectionId)
        if ('error' in ownership) return NextResponse.json({ error: ownership.error }, { status: ownership.status })

        const body = await request.json()
        const parsed = updateItemSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
        }

        const [updated] = await db
            .update(sectionContentItems)
            .set({ ...parsed.data, updatedAt: new Date() })
            .where(eq(sectionContentItems.id, itemId))
            .returning()

        if (!updated) return NextResponse.json({ error: 'Item not found' }, { status: 404 })

        return NextResponse.json(updated)
    } catch (error) {
        console.error('PUT item error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE /api/mentors/content/sections/[sectionId]/content-items/[itemId]
export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const { sectionId, itemId } = await context.params
        const ownership = await verifySectionOwnership(request, sectionId)
        if ('error' in ownership) return NextResponse.json({ error: ownership.error }, { status: ownership.status })

        await db.delete(sectionContentItems).where(eq(sectionContentItems.id, itemId))

        return NextResponse.json({ message: 'Content item deleted' })
    } catch (error) {
        console.error('DELETE item error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
