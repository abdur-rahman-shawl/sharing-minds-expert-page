import { supabase } from '@/lib/supabase'

export interface UploadResult {
  url: string
  path: string
  size: number
  contentType: string
}

export interface UploadOptions {
  maxSize?: number
  allowedTypes?: string[]
  contentType?: string
}

// Upload profile picture to Supabase Storage
export async function uploadProfilePicture(file: File, userId: string): Promise<UploadResult> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  const filePath = `mentors/profile-pictures/${fileName}`

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds 5MB limit')
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed')
  }

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath)

  return {
    url: publicUrl,
    path: data.path,
    size: file.size,
    contentType: file.type
  }
}

// Upload banner image to Supabase Storage
export async function uploadBannerImage(file: File, userId: string): Promise<UploadResult> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  const filePath = `mentors/banners/${fileName}`

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds 5MB limit')
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed')
  }

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath)

  return {
    url: publicUrl,
    path: data.path,
    size: file.size,
    contentType: file.type
  }
}

// Upload resume to Supabase Storage
export async function uploadResume(file: File, userId: string): Promise<UploadResult> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  const filePath = `mentors/resumes/${fileName}`

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size exceeds 10MB limit')
  }

  // Validate file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  const allowedExtensions = ['pdf', 'doc', 'docx']

  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExt?.toLowerCase() || '')) {
    throw new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed')
  }

  // Determine content type
  let contentType = file.type
  if (fileExt === 'pdf') {
    contentType = 'application/pdf'
  } else if (fileExt === 'doc') {
    contentType = 'application/msword'
  } else if (fileExt === 'docx') {
    contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file, {
      contentType,
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath)

  return {
    url: publicUrl,
    path: data.path,
    size: file.size,
    contentType
  }
}

// Delete file from Supabase Storage
export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from('uploads')
    .remove([path])

  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}

// Upload content file (video, PDF, document, image, PPT) to Supabase Storage
const CONTENT_ALLOWED_TYPES = [
  'video/mp4', 'video/webm', 'video/quicktime', 'video/avi',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'text/plain',
]
const CONTENT_MAX_SIZE = 100 * 1024 * 1024 // 100MB

export async function uploadContentFile(
  file: File,
  userId: string,
  type: string = 'content'
): Promise<UploadResult> {
  if (file.size > CONTENT_MAX_SIZE) {
    throw new Error('File size exceeds 100MB limit')
  }

  if (!CONTENT_ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`)
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const fileName = `${userId}-${Date.now()}-${cleanName}`
  const filePath = `mentors/content/${type}/${fileName}`

  // Attempt upload with original MIME type
  let uploadResult = await supabase.storage
    .from('uploads')
    .upload(filePath, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    })

  // Fallback: retry with generic content type
  if (uploadResult.error) {
    uploadResult = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        contentType: 'application/octet-stream',
        cacheControl: '3600',
        upsert: false,
      })
  }

  if (uploadResult.error) {
    throw new Error(`Upload failed: ${uploadResult.error.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath)

  return {
    url: publicUrl,
    path: uploadResult.data.path,
    size: file.size,
    contentType: file.type,
  }
}
