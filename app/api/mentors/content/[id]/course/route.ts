import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mentors, mentorContent, courses } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const courseSchema = z.object({
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    duration: z.number().positive().optional(),
    price: z.string().optional(),
    currency: z.string().default('USD'),
    thumbnailUrl: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    prerequisites: z.array(z.string()).optional(),
    learningOutcomes: z.array(z.string()).optional(),
})

type RouteContext = { params: Promise<{ id: string }> }

// POST /api/mentors/content/[id]/course — create course row
export async function POST(request: NextRequest, context: RouteContext) {
    try {
        const session = await auth.api.getSession({ headers: request.headers })
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: contentId } = await context.params

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
                and(
                    eq(mentorContent.id, contentId),
                    eq(mentorContent.mentorId, mentor[0].id)
                )
            )
            .limit(1)

        if (!content || content.type !== 'COURSE') {
            return NextResponse.json({ error: 'COURSE content not found' }, { status: 404 })
        }

        // Check no course already exists
        const [existing] = await db
            .select()
            .from(courses)
            .where(eq(courses.contentId, contentId))
            .limit(1)
        if (existing) {
            return NextResponse.json({ error: 'Course already exists for this content' }, { status: 409 })
        }

        const body = await request.json()
        const parsed = courseSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const d = parsed.data
        const [created] = await db
            .insert(courses)
            .values({
                contentId,
                difficulty: d.difficulty,
                duration: d.duration,
                price: d.price,
                currency: d.currency,
                thumbnailUrl: d.thumbnailUrl,
                category: d.category,
                tags: d.tags ? JSON.stringify(d.tags) : null,
                prerequisites: d.prerequisites ? JSON.stringify(d.prerequisites) : null,
                learningOutcomes: d.learningOutcomes ? JSON.stringify(d.learningOutcomes) : null,
            })
            .returning()

        return NextResponse.json(created, { status: 201 })
    } catch (error) {
        console.error('POST course error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PUT /api/mentors/content/[id]/course — update course
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const session = await auth.api.getSession({ headers: request.headers })
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: contentId } = await context.params

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
                and(
                    eq(mentorContent.id, contentId),
                    eq(mentorContent.mentorId, mentor[0].id)
                )
            )
            .limit(1)

        if (!content) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 })
        }

        const [courseRow] = await db
            .select()
            .from(courses)
            .where(eq(courses.contentId, contentId))
            .limit(1)
        if (!courseRow) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 })
        }

        const body = await request.json()
        const parsed = courseSchema.partial().safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const d = parsed.data
        const updateData: Record<string, unknown> = { ...d, updatedAt: new Date() }
        if (d.tags !== undefined) updateData.tags = JSON.stringify(d.tags)
        if (d.prerequisites !== undefined) updateData.prerequisites = JSON.stringify(d.prerequisites)
        if (d.learningOutcomes !== undefined) updateData.learningOutcomes = JSON.stringify(d.learningOutcomes)

        const [updated] = await db
            .update(courses)
            .set(updateData)
            .where(eq(courses.id, courseRow.id))
            .returning()

        return NextResponse.json(updated)
    } catch (error) {
        console.error('PUT course error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
