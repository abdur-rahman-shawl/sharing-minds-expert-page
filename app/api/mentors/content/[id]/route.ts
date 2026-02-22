import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
    mentors,
    mentorContent,
    courses,
    courseModules,
    courseSections,
    sectionContentItems,
} from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { z } from 'zod'

const updateContentSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    fileUrl: z.string().optional(),
    fileName: z.string().optional(),
    fileSize: z.number().optional(),
    mimeType: z.string().optional(),
    url: z
        .string()
        .refine((val) => !val || val === '' || /^https?:\/\/.+/.test(val), {
            message: 'Invalid URL format',
        })
        .optional(),
    urlTitle: z.string().optional(),
    urlDescription: z.string().optional(),
})

type RouteContext = { params: Promise<{ id: string }> }

// GET /api/mentors/content/[id] — single content item (with full course tree for COURSE type)
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const session = await auth.api.getSession({ headers: request.headers })
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await context.params

        const mentor = await db
            .select()
            .from(mentors)
            .where(eq(mentors.userId, session.user.id))
            .limit(1)

        if (!mentor.length) {
            return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
        }

        const [content] = await db
            .select()
            .from(mentorContent)
            .where(
                and(eq(mentorContent.id, id), eq(mentorContent.mentorId, mentor[0].id))
            )
            .limit(1)

        if (!content) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 })
        }

        // For COURSE type, return full nested tree
        if (content.type === 'COURSE') {
            const [courseRow] = await db
                .select()
                .from(courses)
                .where(eq(courses.contentId, content.id))
                .limit(1)

            if (courseRow) {
                const modules = await db
                    .select()
                    .from(courseModules)
                    .where(eq(courseModules.courseId, courseRow.id))
                    .orderBy(asc(courseModules.orderIndex))

                const modulesWithSections = await Promise.all(
                    modules.map(async (mod) => {
                        const sections = await db
                            .select()
                            .from(courseSections)
                            .where(eq(courseSections.moduleId, mod.id))
                            .orderBy(asc(courseSections.orderIndex))

                        const sectionsWithItems = await Promise.all(
                            sections.map(async (sec) => {
                                const items = await db
                                    .select()
                                    .from(sectionContentItems)
                                    .where(eq(sectionContentItems.sectionId, sec.id))
                                    .orderBy(asc(sectionContentItems.orderIndex))

                                return { ...sec, contentItems: items }
                            })
                        )

                        return { ...mod, sections: sectionsWithItems }
                    })
                )

                return NextResponse.json({
                    ...content,
                    course: { ...courseRow, modules: modulesWithSections },
                })
            }

            return NextResponse.json({ ...content, course: null })
        }

        return NextResponse.json(content)
    } catch (error) {
        console.error('GET /api/mentors/content/[id] error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PUT /api/mentors/content/[id] — update content metadata
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const session = await auth.api.getSession({ headers: request.headers })
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await context.params

        const mentor = await db
            .select()
            .from(mentors)
            .where(eq(mentors.userId, session.user.id))
            .limit(1)

        if (!mentor.length) {
            return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
        }

        // Ownership check
        const [existing] = await db
            .select()
            .from(mentorContent)
            .where(
                and(eq(mentorContent.id, id), eq(mentorContent.mentorId, mentor[0].id))
            )
            .limit(1)

        if (!existing) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 })
        }

        const body = await request.json()
        const parsed = updateContentSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const [updated] = await db
            .update(mentorContent)
            .set({ ...parsed.data, updatedAt: new Date() })
            .where(eq(mentorContent.id, id))
            .returning()

        return NextResponse.json(updated)
    } catch (error) {
        console.error('PUT /api/mentors/content/[id] error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE /api/mentors/content/[id] — delete content (cascades to course data)
export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const session = await auth.api.getSession({ headers: request.headers })
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await context.params

        const mentor = await db
            .select()
            .from(mentors)
            .where(eq(mentors.userId, session.user.id))
            .limit(1)

        if (!mentor.length) {
            return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
        }

        const [existing] = await db
            .select()
            .from(mentorContent)
            .where(
                and(eq(mentorContent.id, id), eq(mentorContent.mentorId, mentor[0].id))
            )
            .limit(1)

        if (!existing) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 })
        }

        await db.delete(mentorContent).where(eq(mentorContent.id, id))

        return NextResponse.json({ message: 'Content deleted successfully' })
    } catch (error) {
        console.error('DELETE /api/mentors/content/[id] error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
