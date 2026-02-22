import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { uploadContentFile } from '@/lib/storage'

export async function POST(request: NextRequest) {
    try {
        // Auth check
        const session = await auth.api.getSession({ headers: request.headers })
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File | null
        const type = (formData.get('type') as string) || 'content'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Size check (100MB)
        if (file.size > 100 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size exceeds 100MB limit' }, { status: 400 })
        }

        const result = await uploadContentFile(file, session.user.id, type)

        return NextResponse.json(
            {
                success: true,
                fileUrl: result.url,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
                originalName: file.name,
                storagePath: result.path,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Upload error:', error)
        const message = error instanceof Error ? error.message : 'Upload failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
