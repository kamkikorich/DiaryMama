'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { createGallery, getUsers } from '@/lib/supabase/queries'
import type { User } from '@/types'

export function ImageUpload() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [imageUrl, setImageUrl] = useState('')
  const [formData, setFormData] = useState({
    user_id: '',
    keterangan: '',
    tags: '',
  })

  useEffect(() => {
    getUsers().then(setUsers)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageUrl) {
      alert('Sila masukkan URL gambar')
      return
    }

    setLoading(true)

    try {
      await createGallery({
        user_id: formData.user_id || null,
        keterangan: formData.keterangan || null,
        tags: formData.tags || null,
        pautan_gambar: imageUrl,
        file_id: null,
      })
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
      <div>
        <Label htmlFor="imageUrl">URL Gambar</Label>
        <Input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://drive.google.com/..."
          className="mt-1"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Masukkan URL gambar dari Google Drive atau sumber lain
        </p>
      </div>

      {imageUrl && (
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        </div>
      )}

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
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  )
}