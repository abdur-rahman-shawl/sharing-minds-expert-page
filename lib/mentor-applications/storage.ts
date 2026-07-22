import 'server-only'

import { randomUUID } from 'node:crypto'

import { supabaseAdmin } from '@/lib/supabase'

import {
  MENTOR_APPLICATION_BUCKET,
  PROFILE_IMAGE_MAX_BYTES,
  RESUME_MAX_BYTES,
  SUPPORTING_DOCUMENT_MAX_BYTES,
} from './constants'
import { sha256Hex } from './security'

export type ApplicationFileKind =
  | 'PROFILE_IMAGE'
  | 'RESUME'
  | 'PORTFOLIO'
  | 'CASE_STUDY'
  | 'PRESENTATION'
  | 'AWARDS_CERTIFICATIONS'

export type UploadedApplicationFile = {
  storageBucket: string
  storagePath: string
  originalFileName: string
  mediaType: string
  sizeBytes: number
  checksumSha256: string
}

function startsWith(bytes: Uint8Array, signature: number[]): boolean {
  return signature.every((byte, index) => bytes[index] === byte)
}

function detectProfileImage(bytes: Uint8Array): { mediaType: string; extension: string } | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) {
    return { mediaType: 'image/jpeg', extension: 'jpg' }
  }
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { mediaType: 'image/png', extension: 'png' }
  }
  if (
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { mediaType: 'image/webp', extension: 'webp' }
  }
  return null
}

function detectResume(bytes: Uint8Array): { mediaType: string; extension: string } | null {
  return startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])
    ? { mediaType: 'application/pdf', extension: 'pdf' }
    : null
}

export class ApplicationFileValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApplicationFileValidationError'
  }
}

let privateBucketCheck: Promise<void> | null = null

async function assertPrivateApplicationBucket(): Promise<void> {
  if (!privateBucketCheck) {
    privateBucketCheck = (async () => {
      const { data, error } = await supabaseAdmin.storage.getBucket(
        MENTOR_APPLICATION_BUCKET,
      )
      if (error || !data) {
        throw new Error(
          `Mentor application storage bucket is unavailable: ${error?.message || 'not found'}`,
        )
      }
      if (data.public) {
        throw new Error(
          `Storage bucket "${MENTOR_APPLICATION_BUCKET}" must be private`,
        )
      }
    })()
  }

  return privateBucketCheck
}

export async function uploadApplicationFile(input: {
  applicationId: string
  kind: ApplicationFileKind
  file: File
}): Promise<UploadedApplicationFile> {
  await assertPrivateApplicationBucket()

  const { file, kind, applicationId } = input
  const maxSize =
    kind === 'PROFILE_IMAGE'
      ? PROFILE_IMAGE_MAX_BYTES
      : kind === 'RESUME'
        ? RESUME_MAX_BYTES
        : SUPPORTING_DOCUMENT_MAX_BYTES

  if (!file || file.size <= 0) {
    throw new ApplicationFileValidationError('The selected file is empty')
  }
  if (file.size > maxSize) {
    throw new ApplicationFileValidationError('The selected file exceeds the 5MB limit')
  }

  const bytes = new Uint8Array(await file.arrayBuffer())
  const detected =
    kind === 'PROFILE_IMAGE' ? detectProfileImage(bytes) : detectResume(bytes)
  if (!detected) {
    throw new ApplicationFileValidationError(
      kind === 'PROFILE_IMAGE'
        ? 'Profile image must be a valid JPEG, PNG, or WebP file'
        : 'Application documents must be valid PDF files',
    )
  }

  const declaredType = file.type.toLowerCase()
  const allowedDeclaredTypes =
    kind === 'PROFILE_IMAGE'
      ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/octet-stream']
      : ['application/pdf', 'application/octet-stream']
  if (declaredType && !allowedDeclaredTypes.includes(declaredType)) {
    throw new ApplicationFileValidationError('The selected file type is not allowed')
  }

  const storagePath = `${applicationId}/${kind.toLowerCase()}/${randomUUID()}.${detected.extension}`
  const { error } = await supabaseAdmin.storage
    .from(MENTOR_APPLICATION_BUCKET)
    .upload(storagePath, bytes, {
      cacheControl: '3600',
      contentType: detected.mediaType,
      upsert: false,
    })

  if (error) {
    throw new Error(`Private application file upload failed: ${error.message}`)
  }

  return {
    storageBucket: MENTOR_APPLICATION_BUCKET,
    storagePath,
    originalFileName: file.name.slice(0, 255),
    mediaType: detected.mediaType,
    sizeBytes: file.size,
    checksumSha256: sha256Hex(bytes),
  }
}

export async function deleteApplicationFiles(
  files: Array<Pick<UploadedApplicationFile, 'storageBucket' | 'storagePath'>>,
): Promise<void> {
  const byBucket = new Map<string, string[]>()
  for (const file of files) {
    const paths = byBucket.get(file.storageBucket) || []
    paths.push(file.storagePath)
    byBucket.set(file.storageBucket, paths)
  }

  await Promise.all(
    Array.from(byBucket, async ([bucket, paths]) => {
      const { error } = await supabaseAdmin.storage.from(bucket).remove(paths)
      if (error) console.error('[mentor-applications] Failed to clean uploaded files', error)
    }),
  )
}

export async function createApplicationFileSignedUrl(input: {
  storageBucket: string
  storagePath: string
  expiresInSeconds?: number
}): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(input.storageBucket)
    .createSignedUrl(input.storagePath, input.expiresInSeconds || 60)

  if (error || !data?.signedUrl) {
    throw new Error(`Unable to authorize application file: ${error?.message || 'unknown error'}`)
  }

  return data.signedUrl
}
