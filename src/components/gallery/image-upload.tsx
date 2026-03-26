'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { createGallery, updateGallery, getUsers } from '@/lib/supabase/queries'
import { uploadImage, validateImageFile } from '@/lib/storage'
import type { Gallery, User } from '@/types'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  image?: Gallery | null
}

export function ImageUpload({ image }: ImageUploadProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [imageUrl, setImageUrl] = useState(image?.pautan_gambar || '')
  const [formData, setFormData] = useState({
    user_id: image?.user_id || '',
    keterangan: image?.keterangan || '',
    tags: image?.tags || '',
  })
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getUsers().then(setUsers)
  }, [])

  const handleUpload = useCallback(async (file: File) => {
    setError(null)

    // Validate image
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Fail tidak sah')
      return
    }

    setUploading(true)

    try {
      const result = await uploadImage(file)
      if (result.success && result.url) {
        setImageUrl(result.url)
      } else {
        setError(result.error || 'Gagal memuat naik gambar')
      }
    } catch {
      setError('Ralat memuat naik gambar')
    } finally {
      setUploading(false)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
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
    setImageUrl('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageUrl) {
      setError('Sila muat naik gambar')
      return
    }

    setLoading(true)

    try {
      const data = {
        user_id: formData.user_id || null,
        keterangan: formData.keterangan || null,
        tags: formData.tags || null,
        pautan_gambar: imageUrl,
        file_id: null,
      }

      if (image) {
        await updateGallery(image.id, data)
      } else {
        await createGallery(data)
      }
      router.push('/gallery')
      router.refresh()
    } catch (error) {
      console.error('Error saving image:', error)
      alert('Ralat menyimpan gambar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {/* Image Upload Area */}
      <div>
        <Label>Gambar</Label>
        {imageUrl ? (
          <div className="mt-1 relative rounded-lg overflow-hidden border bg-gray-50">
            <div className="aspect-video relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            className={`
              mt-1 relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors min-h-[200px] flex flex-col items-center justify-center
              ${dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                <p className="text-sm text-gray-600">Memuat naik & memampatkan gambar...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    <span className="text-primary-600">Klik untuk upload</span> atau drag & drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, WEBP (maks. 5MB)
                  </p>
                </div>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileSelect}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        )}
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>

      <div>
        <Label htmlFor="user_id">Nama (Pilihan)</Label>
        <Select
          id="user_id"
          value={formData.user_id}
          onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
          options={[
            { value: '', label: 'Pilih nama...' },
            ...users.map((u) => ({ value: u.id, label: u.nama })),
          ]}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="keterangan">Keterangan</Label>
        <Textarea
          id="keterangan"
          value={formData.keterangan}
          onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
          placeholder="Keterangan gambar..."
          className="mt-1"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="rawatan, hospital, family"
          className="mt-1"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          Batal
        </Button>
        <Button type="submit" disabled={loading || uploading} className="flex-1">
          {loading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  )
}