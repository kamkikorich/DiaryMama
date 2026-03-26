import { DiaryForm } from '@/components/diary/diary-form'

export default function NewDiaryPage() {
  return (
    <div>
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-semibold">Diari Baru</h2>
      </div>
      <DiaryForm />
    </div>
  )
}