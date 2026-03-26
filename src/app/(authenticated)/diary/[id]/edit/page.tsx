import { getDiaryById } from '@/lib/supabase/queries'
import { DiaryForm } from '@/components/diary/diary-form'
import { notFound } from 'next/navigation'

interface EditDiaryPageProps {
  params: Promise<{ id: string }>
}

export default async function EditDiaryPage({ params }: EditDiaryPageProps) {
  const { id } = await params
  const diary = await getDiaryById(id)

  if (!diary) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-lg font-semibold p-4 border-b">Edit Diari</h1>
      <DiaryForm diary={diary} />
    </div>
  )
}