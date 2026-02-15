import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mentors, mentorsProfileAudit } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        // 1. Auth check
        const session = await auth.api.getSession({ headers: request.headers })
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            )
        }

        // 2. Parse request (JSON or FormData)
        const contentType = request.headers.get('content-type') || ''
        let userId: string
        let updateFields: Record<string, unknown> = {}
        let profilePictureFile: File | null = null
        let bannerImageFile: File | null = null
        let resumeFile: File | null = null

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData()
            userId = formData.get('userId') as string

            // Extract files
            const ppFile = formData.get('profilePicture')
            if (ppFile && ppFile instanceof File && ppFile.size > 0) profilePictureFile = ppFile
            const biFile = formData.get('bannerImage')
            if (biFile && biFile instanceof File && biFile.size > 0) bannerImageFile = biFile
            const rFile = formData.get('resume')
            if (rFile && rFile instanceof File && rFile.size > 0) resumeFile = rFile

            // Extract text fields
            for (const [key, value] of formData.entries()) {
                if (['profilePicture', 'bannerImage', 'resume', 'userId'].includes(key)) continue
                updateFields[key] = value as string
            }
        } else {
            const body = await request.json()
            userId = body.userId
            const { userId: _, ...rest } = body
            updateFields = rest
        }

        // 3. Validate userId matches session
        if (userId !== session.user.id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized: userId mismatch' },
                { status: 403 }
            )
        }

        // 4. Get current mentor data for audit
        const [currentMentor] = await db
            .select()
            .from(mentors)
            .where(eq(mentors.userId, userId))
            .limit(1)

        if (!currentMentor) {
            return NextResponse.json(
                { success: false, error: 'Mentor profile not found' },
                { status: 404 }
            )
        }

        // 5. Handle file uploads
        if (profilePictureFile) {
            // Delete old file if exists
            if (currentMentor.profileImageUrl) {
                try {
                    const oldPath = extractStoragePath(currentMentor.profileImageUrl)
                    if (oldPath) {
                        await supabaseAdmin.storage.from('uploads').remove([oldPath])
                    }
                } catch { /* ignore delete errors */ }
            }

            const { url } = await uploadFileToStorage(profilePictureFile, userId, 'mentors/profile-pictures')
            updateFields.profileImageUrl = url
        }

        if (bannerImageFile) {
            if (currentMentor.bannerImageUrl) {
                try {
                    const oldPath = extractStoragePath(currentMentor.bannerImageUrl)
                    if (oldPath) {
                        await supabaseAdmin.storage.from('uploads').remove([oldPath])
                    }
                } catch { /* ignore delete errors */ }
            }

            const { url } = await uploadFileToStorage(bannerImageFile, userId, 'mentors/banners')
            updateFields.bannerImageUrl = url
        }

        if (resumeFile) {
            // Validate resume type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
            const ext = resumeFile.name.split('.').pop()?.toLowerCase()
            if (!allowedTypes.includes(resumeFile.type) && !['pdf', 'doc', 'docx'].includes(ext || '')) {
                return NextResponse.json(
                    { success: false, error: 'Invalid resume file type' },
                    { status: 400 }
                )
            }
            if (resumeFile.size > 10 * 1024 * 1024) {
                return NextResponse.json(
                    { success: false, error: 'Resume file too large (max 10MB)' },
                    { status: 400 }
                )
            }

            if (currentMentor.resumeUrl) {
                try {
                    const oldPath = extractStoragePath(currentMentor.resumeUrl)
                    if (oldPath) {
                        await supabaseAdmin.storage.from('uploads').remove([oldPath])
                    }
                } catch { /* ignore delete errors */ }
            }

            const { url } = await uploadFileToStorage(resumeFile, userId, 'mentors/resumes')
            updateFields.resumeUrl = url
        }

        // 6. Normalize and build update data
        const mentorUpdateData: Record<string, unknown> = {
            updatedAt: new Date(),
        }

        // Map camelCase field names to Drizzle columns
        const fieldMap: Record<string, keyof typeof mentors.$inferInsert> = {
            fullName: 'fullName',
            email: 'email',
            phone: 'phone',
            title: 'title',
            company: 'company',
            city: 'city',
            state: 'state',
            country: 'country',
            industry: 'industry',
            expertise: 'expertise',
            experience: 'experience',
            about: 'about',
            linkedinUrl: 'linkedinUrl',
            githubUrl: 'githubUrl',
            websiteUrl: 'websiteUrl',
            hourlyRate: 'hourlyRate',
            currency: 'currency',
            availability: 'availability',
            headline: 'headline',
            maxMentees: 'maxMentees',
            profileImageUrl: 'profileImageUrl',
            bannerImageUrl: 'bannerImageUrl',
            resumeUrl: 'resumeUrl',
            verificationNotes: 'verificationNotes',
            isAvailable: 'isAvailable',
        }

        for (const [inputKey, value] of Object.entries(updateFields)) {
            const drizzleKey = fieldMap[inputKey]
            if (!drizzleKey) continue

            // Normalize values
            if (['experience', 'maxMentees'].includes(inputKey)) {
                const num = Number(value)
                mentorUpdateData[drizzleKey] = isNaN(num) ? null : num
            } else if (inputKey === 'hourlyRate') {
                const num = Number(value)
                mentorUpdateData[drizzleKey] = isNaN(num) ? null : String(num)
            } else if (inputKey === 'isAvailable') {
                mentorUpdateData[drizzleKey] = value === true || value === 'true'
            } else {
                // Convert empty strings to null
                mentorUpdateData[drizzleKey] = (value === '' || value === null || value === undefined) ? null : value
            }
        }

        // Force verification status to UPDATED_PROFILE on every save
        mentorUpdateData.verificationStatus = 'UPDATED_PROFILE'

        // 7. Update database
        const [updatedMentor] = await db
            .update(mentors)
            .set(mentorUpdateData)
            .where(eq(mentors.userId, userId))
            .returning()

        // 8. Audit log
        try {
            await db.insert(mentorsProfileAudit).values({
                mentorId: currentMentor.id,
                previousData: currentMentor as unknown as Record<string, unknown>,
                updatedData: updatedMentor as unknown as Record<string, unknown>,
                changedBy: userId,
            })
        } catch (auditError) {
            console.error('Audit log insert failed:', auditError)
            // Don't fail the request for audit errors
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: updatedMentor.id,
                fullName: updatedMentor.fullName,
                email: updatedMentor.email,
                verificationStatus: updatedMentor.verificationStatus,
                profileImageUrl: updatedMentor.profileImageUrl,
                bannerImageUrl: updatedMentor.bannerImageUrl,
                resumeUrl: updatedMentor.resumeUrl,
            },
        })
    } catch (error) {
        console.error('Error updating mentor profile:', error)
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

// Helper: upload a file to Supabase storage
async function uploadFileToStorage(file: File, userId: string, folder: string) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const buffer = Buffer.from(await file.arrayBuffer())

    const { data, error } = await supabaseAdmin.storage
        .from('uploads')
        .upload(filePath, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: true,
        })

    if (error) throw new Error(`Upload failed: ${error.message}`)

    const { data: { publicUrl } } = supabaseAdmin.storage
        .from('uploads')
        .getPublicUrl(filePath)

    return { url: publicUrl, path: data.path }
}

// Helper: extract storage path from public URL
function extractStoragePath(url: string): string | null {
    try {
        const match = url.match(/\/uploads\/(.+)$/)
        return match ? match[1] : null
    } catch {
        return null
    }
}
