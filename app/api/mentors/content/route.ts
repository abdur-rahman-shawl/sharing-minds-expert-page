import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mentors, mentorContent } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'

const createContentSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    type: z.enum(['COURSE', 'FILE', 'URL']),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
    // FILE
    fileUrl: z.string().optional(),
    fileName: z.string().optional(),
    fileSize: z.number().optional(),
    mimeType: z.string().optional(),
    // URL
    url: z.string().url().optional(),
    urlTitle: z.string().optional(),
    urlDescription: z.string().optional(),
})

// GET /api/mentors/content — list all content for authenticated mentor
export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers })
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const mentor = await db
            .select()
            .from(mentors)
            .where(eq(mentors.userId, session.user.id))
            .limit(1)

        if (!mentor.length) {
            return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
        }

        const content = await db
            .select()
            .from(mentorContent)
            .where(eq(mentorContent.mentorId, mentor[0].id))
            .orderBy(desc(mentorContent.createdAt))

        return NextResponse.json(content)
    } catch (error) {
        console.error('GET /api/mentors/content error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/mentors/content — create a new content item
export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers })
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const mentor = await db
            .select()
            .from(mentors)
            .where(eq(mentors.userId, session.user.id))
            .limit(1)

        if (!mentor.length) {
            return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
        }

        const body = await request.json()
        const parsed = createContentSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const data = parsed.data

        // Type-specific validation
        if (data.type === 'FILE' && !data.fileUrl) {
            return NextResponse.json({ error: 'fileUrl is required for FILE type' }, { status: 400 })
        }
        if (data.type === 'URL' && !data.url) {
            return NextResponse.json({ error: 'url is required for URL type' }, { status: 400 })
        }

        const [created] = await db
            .insert(mentorContent)
            .values({
                mentorId: mentor[0].id,
                title: data.title,
                description: data.description,
                type: data.type,
                status: data.status,
                fileUrl: data.fileUrl,
                fileName: data.fileName,
                fileSize: data.fileSize,
                mimeType: data.mimeType,
                url: data.url,
                urlTitle: data.urlTitle,
                urlDescription: data.urlDescription,
            })
            .returning()

        return NextResponse.json(created, { status: 201 })
    } catch (error) {
        console.error('POST /api/mentors/content error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
