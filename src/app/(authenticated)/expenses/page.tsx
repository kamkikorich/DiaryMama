import { getExpenses, getCurrentBalance } from '@/lib/supabase/queries'
import { BalanceCard } from '@/components/expenses/balance-card'
import { ExpenseList } from '@/components/expenses/expense-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function ExpensesPage() {
  const [expenses, balance] = await Promise.all([
    getExpenses(),
    getCurrentBalance(),
  ])

  return (
    <div className="p-4 space-y-4">
      <BalanceCard balance={balance} />

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Rekod Perbelanjaan</h2>
        <Link href="/expenses/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Baru
          </Button>
        </Link>
      </div>

      <ExpenseList expenses={expenses} />
    </div>
  )
}