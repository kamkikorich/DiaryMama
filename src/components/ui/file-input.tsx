'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { uploadDocument, validateFile, isImageFile, isPdfFile } from '@/lib/storage'
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react'

interface FileInputProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  accept?: string
  maxSize?: number
  disabled?: boolean
}

export function FileInput({
  value,
  onChange,
  onRemove,
  accept = '.jpg,.jpeg,.png,.webp,.pdf',
  disabled = false
}: FileInputProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(async (file: File) => {
    setError(null)

    // Validate
    const validation = validateFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Fail tidak sah')
      return
    }

    setUploading(true)

    try {
      const result = await uploadDocument(file)
      if (result.success && result.url) {
        onChange(result.url)
      } else {
        setError(result.error || 'Gagal memuat naik fail')
      }
    } catch {
      setError('Ralat memuat naik fail')
    } finally {
      setUploading(false)
    }
  }, [onChange])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleRemove = () => {
    onChange('')
    onRemove?.()
  }

  // Show preview if file exists
  if (value) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Resit / Dokumen</label>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
          {isImageFile(value) ? (
            <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : isPdfFile(value) ? (
            <div className="w-16 h-16 rounded bg-red-100 flex items-center justify-center">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {isPdfFile(value) ? 'Dokumen PDF' : 'Gambar Resit'}
            </p>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-600 hover:underline"
            >
              Lihat dokumen →
            </a>
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
            >
              <X className="w-4 h-4 text-gray-400" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Resit / Dokumen</label>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors
          ${dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            <p className="text-sm text-gray-600">Memuat naik...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              <span className="text-primary-600 font-medium">Klik untuk upload</span> atau drag & drop
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, WEBP atau PDF (maks. 5MB)
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}