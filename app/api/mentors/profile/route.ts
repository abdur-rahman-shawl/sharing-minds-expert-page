import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // Using correct auth import for better-auth
import { db } from '@/lib/db';
import { mentors, mentorsProfileAudit, type Mentor } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { uploadProfilePicture, uploadResume, uploadBannerImage, deleteFile } from '@/lib/storage';

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        const sessionUserId = session?.user?.id;

        if (!sessionUserId) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        const [mentor] = await db
            .select()
            .from(mentors)
            .where(eq(mentors.userId, sessionUserId))
            .limit(1);

        if (!mentor) {
            return NextResponse.json(
                { success: false, error: 'Mentor profile not found' },
                { status: 404 }
            );
        }

        // Parse availability if it's a string (though schema says string, it might be JSON string)
        let availabilityParsed = mentor.availability;
        try {
            if (typeof mentor.availability === 'string') {
                availabilityParsed = JSON.parse(mentor.availability);
            }
        } catch (e) {
            // ignore error, keep as string
        }

        return NextResponse.json({
            success: true,
            data: {
                ...mentor,
                availability: availabilityParsed
            }
        });

    } catch (error) {
        console.error('Error fetching mentor profile:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch mentor profile' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    console.log('🚀 === MENTOR PROFILE UPDATE API CALLED ===');

    try {
        const session = await auth.api.getSession({ headers: request.headers });
        const sessionUserId = session?.user?.id;

        if (!sessionUserId) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Try to get FormData first
        let updateData: any = {};
        let profilePicture: File | null = null;
        let bannerImage: File | null = null;
        let resume: File | null = null;

        const contentType = request.headers.get('content-type');

        if (contentType?.includes('multipart/form-data')) {
            const formData = await request.formData();
            profilePicture = formData.get('profilePicture') as File;
            bannerImage = formData.get('bannerImage') as File;
            resume = formData.get('resume') as File;

            for (const [key, value] of formData.entries()) {
                if (!['profilePicture', 'bannerImage', 'resume', 'userId'].includes(key)) {
                    updateData[key] = value;
                }
            }
        } else {
            const data = await request.json();
            delete data.userId; // Remove userId from update data
            updateData = data;
        }

        const [existingMentor] = await db
            .select()
            .from(mentors)
            .where(eq(mentors.userId, sessionUserId))
            .limit(1);

        if (!existingMentor) {
            return NextResponse.json(
                { success: false, error: 'Mentor profile not found' },
                { status: 404 }
            );
        }

        const serializeMentorRecord = (record: Mentor) => ({
            ...record,
            createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : record.createdAt,
            updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : record.updatedAt,
        });

        const previousProfileSnapshot = serializeMentorRecord(existingMentor);

        let newProfileImageUrl = existingMentor.profileImageUrl;
        let newBannerImageUrl = existingMentor.bannerImageUrl;
        let newResumeUrl = existingMentor.resumeUrl;

        // Handle Profile Picture
        if (profilePicture && profilePicture.size > 0) {
            try {
                if (existingMentor.profileImageUrl) {
                    // naive cleanup, ignoring errors
                    const path = existingMentor.profileImageUrl.split('/').pop();
                    if (path) try { await deleteFile(`mentors/profile-pictures/${path}`); } catch { }
                }
                const res = await uploadProfilePicture(profilePicture, sessionUserId);
                newProfileImageUrl = res.url;
            } catch (e: any) {
                return NextResponse.json({ success: false, error: 'Failed to upload profile picture: ' + e.message }, { status: 400 });
            }
        }

        // Handle Banner Image
        if (bannerImage && bannerImage.size > 0) {
            try {
                if (existingMentor.bannerImageUrl) {
                    const path = existingMentor.bannerImageUrl.split('/').pop();
                    if (path) try { await deleteFile(`mentors/banners/${path}`); } catch { }
                }
                const res = await uploadBannerImage(bannerImage, sessionUserId);
                newBannerImageUrl = res.url;
            } catch (e: any) {
                return NextResponse.json({ success: false, error: 'Failed to upload banner image: ' + e.message }, { status: 400 });
            }
        }

        // Handle Resume
        if (resume && resume.size > 0) {
            try {
                if (existingMentor.resumeUrl) {
                    const path = existingMentor.resumeUrl.split('/').slice(-2).join('/');
                    if (path) try { await deleteFile(path); } catch { }
                }
                const res = await uploadResume(resume, sessionUserId);
                newResumeUrl = res.url;
            } catch (e: any) {
                return NextResponse.json({ success: false, error: 'Failed to upload resume: ' + e.message }, { status: 400 });
            }
        }

        // URL fallbacks if JSON provided URL directly (e.g. from UI state)
        if (!profilePicture && updateData.profileImageUrl) newProfileImageUrl = updateData.profileImageUrl as string;
        if (!bannerImage && updateData.bannerImageUrl) newBannerImageUrl = updateData.bannerImageUrl as string;
        if (!resume && updateData.resumeUrl) newResumeUrl = updateData.resumeUrl as string;

        // Helper parsers
        const toNullableString = (v: any) => (v === undefined || v === null || String(v).trim() === '') ? null : String(v).trim();
        const toNullableNumber = (v: any) => {
            if (v === undefined || v === null || v === '') return null;
            const n = Number(v);
            return isNaN(n) ? null : n;
        };
        const parseBoolean = (v: any, fallback: boolean) => {
            if (typeof v === 'boolean') return v;
            if (v === 'true') return true;
            if (v === 'false') return false;
            return fallback;
        };

        const mentorUpdateData = {
            title: toNullableString(updateData.title),
            company: toNullableString(updateData.company),
            industry: toNullableString(updateData.industry),
            expertise: toNullableString(updateData.expertise),
            experience: toNullableNumber(updateData.experience),
            hourlyRate: toNullableString(updateData.hourlyRate),
            currency: toNullableString(updateData.currency) || existingMentor.currency || 'USD',
            headline: toNullableString(updateData.headline),
            about: toNullableString(updateData.about),
            linkedinUrl: toNullableString(updateData.linkedinUrl),
            githubUrl: toNullableString(updateData.githubUrl),
            websiteUrl: toNullableString(updateData.websiteUrl),
            fullName: toNullableString(updateData.fullName),
            email: toNullableString(updateData.email),
            phone: toNullableString(updateData.phone),
            city: toNullableString(updateData.city),
            state: toNullableString(updateData.state),
            country: toNullableString(updateData.country),
            availability: toNullableString(updateData.availability),
            maxMentees: toNullableNumber(updateData.maxMentees),
            profileImageUrl: newProfileImageUrl,
            bannerImageUrl: newBannerImageUrl,
            resumeUrl: newResumeUrl,
            verificationStatus: 'UPDATED_PROFILE' as const,
            verificationNotes: toNullableString(updateData.verificationNotes),
            isAvailable: parseBoolean(updateData.isAvailable, existingMentor.isAvailable !== false),
            updatedAt: new Date(),
        };

        const [updatedMentor] = await db
            .update(mentors)
            .set(mentorUpdateData)
            .where(eq(mentors.userId, sessionUserId))
            .returning();

        // Audit Log
        try {
            await db.insert(mentorsProfileAudit).values({
                mentorId: updatedMentor.id,
                userId: sessionUserId,
                previousData: previousProfileSnapshot,
                updatedData: serializeMentorRecord(updatedMentor),
                changedAt: new Date(),
            });
        } catch (e) {
            console.error('Failed to log audit:', e);
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedMentor
        });

    } catch (error: any) {
        console.error('Update Profile Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update profile: ' + error.message }, { status: 500 });
    }
}
