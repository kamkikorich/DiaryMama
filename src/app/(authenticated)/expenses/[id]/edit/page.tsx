import { getExpenseById } from '@/lib/supabase/queries'
import { ExpenseForm } from '@/components/expenses/expense-form'
import { notFound } from 'next/navigation'

interface EditExpensePageProps {
  params: Promise<{ id: string }>
}

export default async function EditExpensePage({ params }: EditExpensePageProps) {
  const { id } = await params
  const expense = await getExpenseById(id)

  if (!expense) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-lg font-semibold p-4 border-b">Edit Perbelanjaan</h1>
      <ExpenseForm expense={expense} />
    </div>
  )
}