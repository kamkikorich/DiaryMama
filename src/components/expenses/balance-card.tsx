import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { Wallet } from 'lucide-react'

interface BalanceCardProps {
  balance: number
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const isPositive = balance >= 0

  return (
    <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white border-0">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-full">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm opacity-80">Baki Semasa</p>
            <p className={`text-2xl font-bold ${isPositive ? '' : 'text-red-300'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}