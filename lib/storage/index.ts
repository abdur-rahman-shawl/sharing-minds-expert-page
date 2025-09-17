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