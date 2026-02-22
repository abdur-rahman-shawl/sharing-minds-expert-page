'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// ── TypeScript interfaces ──

export interface MentorContent {
    id: string
    title: string
    description?: string | null
    type: 'COURSE' | 'FILE' | 'URL'
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    mimeType?: string | null
    url?: string | null
    urlTitle?: string | null
    urlDescription?: string | null
    createdAt: string
    updatedAt: string
    course?: Course | null
}

export interface Course {
    id: string
    contentId: string
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
    duration?: number | null
    price?: string | null
    currency: string
    thumbnailUrl?: string | null
    category?: string | null
    tags?: string | null
    prerequisites?: string | null
    learningOutcomes?: string | null
    enrollmentCount: number
    createdAt: string
    updatedAt: string
    modules?: CourseModule[]
}

export interface CourseModule {
    id: string
    courseId: string
    title: string
    description?: string | null
    orderIndex: number
    learningObjectives?: string | null
    estimatedDurationMinutes?: number | null
    sections?: CourseSection[]
    createdAt: string
    updatedAt: string
}

export interface CourseSection {
    id: string
    moduleId: string
    title: string
    description?: string | null
    orderIndex: number
    contentItems?: ContentItem[]
    createdAt: string
    updatedAt: string
}

export interface ContentItem {
    id: string
    sectionId: string
    title: string
    description?: string | null
    type: 'VIDEO' | 'PDF' | 'DOCUMENT' | 'URL' | 'TEXT'
    orderIndex: number
    content?: string | null
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    mimeType?: string | null
    duration?: number | null
    isPreview: boolean
    createdAt: string
    updatedAt: string
}

export interface UploadResult {
    success: boolean
    fileUrl: string
    fileName: string
    fileSize: number
    mimeType: string
    originalName: string
    storagePath: string
}

// ── Query hooks ──

/**
 * Fetch all content items for the authenticated mentor.
 */
export function useContentList() {
    return useQuery<MentorContent[]>({
        queryKey: ['mentor-content'],
        queryFn: async () => {
            const res = await fetch('/api/mentors/content')
            if (!res.ok) throw new Error('Failed to fetch content')
            return res.json()
        },
    })
}

/**
 * Fetch a single content item (with nested course tree for COURSE type).
 */
export function useContent(contentId: string | undefined) {
    return useQuery<MentorContent>({
        queryKey: ['mentor-content', contentId],
        queryFn: async () => {
            const res = await fetch(`/api/mentors/content/${contentId}`)
            if (!res.ok) throw new Error('Failed to fetch content')
            return res.json()
        },
        enabled: !!contentId,
    })
}

// ── Mutation hooks ──

/**
 * Create a new content item.
 */
export function useCreateContent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: {
            title: string
            type: 'COURSE' | 'FILE' | 'URL'
            description?: string
            status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
            fileUrl?: string
            fileName?: string
            fileSize?: number
            mimeType?: string
            url?: string
            urlTitle?: string
            urlDescription?: string
        }) => {
            const res = await fetch('/api/mentors/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error || 'Failed to create content')
            }
            return res.json() as Promise<MentorContent>
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mentor-content'] })
        },
    })
}

/**
 * Update an existing content item (auto-save or manual save).
 */
export function useUpdateContent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({
            id,
            ...data
        }: {
            id: string
            title?: string
            description?: string
            status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
            fileUrl?: string
            fileName?: string
            fileSize?: number
            mimeType?: string
            url?: string
            urlTitle?: string
            urlDescription?: string
        }) => {
            const res = await fetch(`/api/mentors/content/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error || 'Failed to update content')
            }
            return res.json() as Promise<MentorContent>
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['mentor-content'] })
            queryClient.invalidateQueries({ queryKey: ['mentor-content', variables.id] })
        },
    })
}

/**
 * Delete a content item (cascades to all course data).
 */
export function useDeleteContent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/mentors/content/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete content')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mentor-content'] })
        },
    })
}

/**
 * Create a course row for a COURSE-type content item.
 */
export function useCreateCourse() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({
            contentId,
            ...data
        }: {
            contentId: string
            difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
            duration?: number
            price?: string
            currency?: string
            category?: string
            tags?: string[]
            prerequisites?: string[]
            learningOutcomes?: string[]
        }) => {
            const res = await fetch(`/api/mentors/content/${contentId}/course`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error || 'Failed to create course')
            }
            return res.json() as Promise<Course>
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['mentor-content', variables.contentId] })
        },
    })
}

/**
 * Upload a file to Supabase via the upload API.
 */
export function useUploadFile() {
    return useMutation({
        mutationFn: async ({ file, type = 'content' }: { file: File; type?: string }) => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', type)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error || 'Upload failed')
            }
            return res.json() as Promise<UploadResult>
        },
    })
}
