import { getDiaries } from '@/lib/supabase/queries'
import { DiaryCard } from '@/components/diary/diary-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function DiaryPage() {
  const diaries = await getDiaries()

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Diari Rawatan</h2>
        <Link href="/diary/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Baru
          </Button>
        </Link>
      </div>

      {diaries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Tiada entri diari lagi.</p>
          <Link href="/diary/new">
            <Button className="mt-4">Tambah Diari</Button>
          </Link>
        </div>
      ) : (
        <div>
          {diaries.map((diary) => (
            <DiaryCard key={diary.id} diary={diary} />
          ))}
        </div>
      )}
    </div>
  )
}