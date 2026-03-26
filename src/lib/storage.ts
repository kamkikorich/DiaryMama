import { createClient } from './supabase/client'

const BUCKET_NAME = 'documents'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export interface FileValidation {
  valid: boolean
  error?: string
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): FileValidation {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Format tidak disokong. Gunakan JPG, PNG, WEBP atau PDF.'
    }
  }

  if (file.size > MAX_FILE_SIZE * 2) {
    // Allow up to 10MB before compression
    return {
      valid: false,
      error: 'Fail terlalu besar. Maksimum 10MB.'
    }
  }

  return { valid: true }
}

/**
 * Compress image file using canvas
 */
export async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  // Only compress images
  if (file.type === 'application/pdf') {
    return file
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      // Calculate new dimensions
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        file.type,
        quality
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Upload document to Supabase Storage
 */
export async function uploadDocument(file: File): Promise<UploadResult> {
  try {
    // Validate
    const validation = validateFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Compress if image
    let processedFile = file
    if (file.type.startsWith('image/')) {
      processedFile = await compressImage(file)
    }

    // Check size after compression
    if (processedFile.size > MAX_FILE_SIZE) {
      return { success: false, error: `Fail masih melebihi ${MAX_FILE_SIZE / 1024 / 1024}MB selepas pemampatan.` }
    }

    const supabase = createClient()

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    const ext = file.name.split('.').pop()
    const filename = `receipts/${timestamp}-${randomStr}.${ext}`

    // Upload
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, processedFile, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return { success: false, error: 'Gagal memuat naik fail.' }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    return { success: true, url: urlData.publicUrl }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Ralat memuat naik fail.' }
  }
}

/**
 * Delete document from Supabase Storage
 */
export async function deleteDocument(url: string): Promise<boolean> {
  try {
    if (!url) return true

    const supabase = createClient()

    // Extract path from URL
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/documents\/(.+)/)

    if (!pathMatch) return false

    const path = pathMatch[1]

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path])

    return !error
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

/**
 * Get file extension from URL or filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * Check if file is an image
 */
export function isImageFile(url: string): boolean {
  const ext = getFileExtension(url)
  return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)
}

/**
 * Check if file is a PDF
 */
export function isPdfFile(url: string): boolean {
  const ext = getFileExtension(url)
  return ext === 'pdf'
}