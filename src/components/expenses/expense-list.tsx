'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import { deleteExpense } from '@/lib/supabase/queries'
import { Button } from '@/components/ui/button'
import type { Expense } from '@/types'
import { Trash2, Pencil, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ExpenseListProps {
  expenses: Expense[]
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Padam entri ini?')) return

    try {
      await deleteExpense(id)
      router.refresh()
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('Ralat memadam entri')
    }
  }

  if (expenses.length === 0) {
    return <p className="text-gray-500 text-center py-8">Tiada rekod perbelanjaan.</p>
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between p-3 bg-white rounded-lg border"
        >
          <div className="flex items-center gap-3">
            {expense.jenis === 'Masuk' ? (
              <ArrowDownCircle className="w-8 h-8 text-green-600" />
            ) : (
              <ArrowUpCircle className="w-8 h-8 text-red-600" />
            )}
            <div>
              <p className="font-medium">
                {expense.jenis === 'Masuk' ? '+' : '-'}{formatCurrency(expense.jumlah)}
              </p>
              <p className="text-xs text-gray-500">
                {expense.users?.nama || 'Tidak diketahui'} • {formatDate(expense.created_at)}
              </p>
              {expense.nota && (
                <p className="text-sm text-gray-600">{expense.nota}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link href={`/expenses/${expense.id}/edit`}>
              <Button variant="ghost" size="icon">
                <Pencil className="w-4 h-4 text-gray-400" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(expense.id)}
            >
              <Trash2 className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}