import { ExpenseForm } from '@/components/expenses/expense-form'

export default function NewExpensePage() {
  return (
    <div>
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-semibold">Perbelanjaan Baru</h2>
      </div>
      <ExpenseForm />
    </div>
  )
}