import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mentors, mentorContent, courses, courseModules } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const updateModuleSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    orderIndex: z.number().int().min(0).optional(),
    learningObjectives: z.string().optional(),
    estimatedDurationMinutes: z.number().positive().optional(),
})

type RouteContext = { params: Promise<{ id: string; moduleId: string }> }

async function verifyOwnership(request: NextRequest, contentId: string) {
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

    return { ok: true }
}

// PUT /api/mentors/content/[id]/course/modules/[moduleId]
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const { id, moduleId } = await context.params
        const ownership = await verifyOwnership(request, id)
        if ('error' in ownership) return NextResponse.json({ error: ownership.error }, { status: ownership.status })

        const body = await request.json()
        const parsed = updateModuleSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
        }

        const [updated] = await db
            .update(courseModules)
            .set({ ...parsed.data, updatedAt: new Date() })
            .where(eq(courseModules.id, moduleId))
            .returning()

        if (!updated) return NextResponse.json({ error: 'Module not found' }, { status: 404 })

        return NextResponse.json(updated)
    } catch (error) {
        console.error('PUT module error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE /api/mentors/content/[id]/course/modules/[moduleId]
export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const { id, moduleId } = await context.params
        const ownership = await verifyOwnership(request, id)
        if ('error' in ownership) return NextResponse.json({ error: ownership.error }, { status: ownership.status })

        await db.delete(courseModules).where(eq(courseModules.id, moduleId))

        return NextResponse.json({ message: 'Module deleted' })
    } catch (error) {
        console.error('DELETE module error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
