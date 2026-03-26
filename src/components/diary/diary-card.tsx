'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate, formatTime } from '@/lib/utils'
import { deleteDiary } from '@/lib/supabase/queries'
import type { Diary } from '@/types'
import { Calendar, MapPin, Clock, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DiaryCardProps {
  diary: Diary
}

export function DiaryCard({ diary }: DiaryCardProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Padam entri diari ini?')) return

    try {
      await deleteDiary(diary.id)
      router.refresh()
    } catch (error) {
      console.error('Error deleting diary:', error)
      alert('Ralat memadam diari')
    }
  }

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold">{diary.users?.nama || 'Tidak diketahui'}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(diary.tarikh)}
              </span>
              {diary.masa && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(diary.masa)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {diary.status_kejadian && (
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full mr-2">
                {diary.status_kejadian}
              </span>
            )}
            <Link href={`/diary/${diary.id}/edit`}>
              <Button variant="ghost" size="icon">
                <Pencil className="w-4 h-4 text-gray-400" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </div>

        {diary.lokasi && (
          <p className="flex items-center gap-1 text-sm text-gray-500 mt-2">
            <MapPin className="w-4 h-4" />
            {diary.lokasi}
          </p>
        )}

        {diary.catatan && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{diary.catatan}</p>
        )}
      </CardContent>
    </Card>
  )
}