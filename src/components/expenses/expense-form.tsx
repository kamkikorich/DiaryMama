'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createExpense, getUsers } from '@/lib/supabase/queries'
import type { User } from '@/types'

export function ExpenseForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState({
    user_id: '',
    jenis: 'Keluar' as 'Masuk' | 'Keluar',
    jumlah: '',
    nota: '',
    pautan_resit: '',
  })

  useEffect(() => {
    getUsers().then(setUsers)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createExpense({
        user_id: formData.user_id || null,
        jenis: formData.jenis,
        jumlah: parseFloat(formData.jumlah),
        nota: formData.nota || null,
        pautan_resit: formData.pautan_resit || null,
      })
      router.push('/expenses')
      router.refresh()
    } catch (error) {
      console.error('Error saving expense:', error)
      alert('Ralat menyimpan perbelanjaan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <Label htmlFor="jenis">Jenis</Label>
        <Select
          id="jenis"
          value={formData.jenis}
          onChange={(e) => setFormData({ ...formData, jenis: e.target.value as 'Masuk' | 'Keluar' })}
          options={[
            { value: 'Keluar', label: 'Keluar (Perbelanjaan)' },
            { value: 'Masuk', label: 'Masuk (Pendapatan)' },
          ]}
          className="mt-1"
          required
        />
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
        <Label htmlFor="jumlah">Jumlah (RM)</Label>
        <Input
          id="jumlah"
          type="number"
          step="0.01"
          min="0"
          value={formData.jumlah}
          onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
          placeholder="0.00"
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="nota">Nota/Tujuan</Label>
        <Textarea
          id="nota"
          value={formData.nota}
          onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
          placeholder="Keterangan perbelanjaan..."
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="pautan_resit">Pautan Resit (URL)</Label>
        <Input
          id="pautan_resit"
          type="url"
          value={formData.pautan_resit}
          onChange={(e) => setFormData({ ...formData, pautan_resit: e.target.value })}
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