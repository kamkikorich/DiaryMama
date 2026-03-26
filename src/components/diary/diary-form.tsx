'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createDiary, updateDiary, getUsers } from '@/lib/supabase/queries'
import type { Diary, User } from '@/types'

interface DiaryFormProps {
  diary?: Diary | null
}

export function DiaryForm({ diary }: DiaryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState({
    user_id: diary?.user_id || '',
    tarikh: diary?.tarikh || new Date().toISOString().split('T')[0],
    masa: diary?.masa || '',
    lokasi: diary?.lokasi || '',
    status_kejadian: diary?.status_kejadian || '',
    catatan: diary?.catatan || '',
    pautan_dokumen: diary?.pautan_dokumen || '',
  })

  useEffect(() => {
    getUsers().then(setUsers)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (diary) {
        await updateDiary(diary.id, formData)
      } else {
        await createDiary(formData)
      }
      router.push('/diary')
      router.refresh()
    } catch (error) {
      console.error('Error saving diary:', error)
      alert('Ralat menyimpan diari')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <Label htmlFor="user_id">Nama</Label>
        <Select
          id="user_id"
          value={formData.user_id}
          onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
          options={[
            { value: '', label: 'Pilih nama...' },
            ...users.map((u) => ({ value: u.id, label: u.nama })),
          ]}
          className="mt-1"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tarikh">Tarikh</Label>
          <Input
            id="tarikh"
            type="date"
            value={formData.tarikh}
            onChange={(e) => setFormData({ ...formData, tarikh: e.target.value })}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="masa">Masa</Label>
          <Input
            id="masa"
            type="time"
            value={formData.masa}
            onChange={(e) => setFormData({ ...formData, masa: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="lokasi">Lokasi</Label>
        <Input
          id="lokasi"
          value={formData.lokasi}
          onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
          placeholder="Hospital, Klinik, Rumah..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="status_kejadian">Status/Kejadian</Label>
        <Input
          id="status_kejadian"
          value={formData.status_kejadian}
          onChange={(e) => setFormData({ ...formData, status_kejadian: e.target.value })}
          placeholder="Check-up, Rawatan, Kejadian..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="catatan">Catatan</Label>
        <Textarea
          id="catatan"
          value={formData.catatan}
          onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
          placeholder="Catatan rawatan..."
          className="mt-1"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="pautan_dokumen">Pautan Dokumen (URL)</Label>
        <Input
          id="pautan_dokumen"
          type="url"
          value={formData.pautan_dokumen}
          onChange={(e) => setFormData({ ...formData, pautan_dokumen: e.target.value })}
          placeholder="https://..."
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