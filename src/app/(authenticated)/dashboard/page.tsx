import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BalanceCard } from '@/components/expenses/balance-card'
import { getCurrentBalance, getDiaries, getGallery } from '@/lib/supabase/queries'
import { formatDate } from '@/lib/utils'
import { BookOpen, Image, PlusCircle } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const [balance, diaries, gallery] = await Promise.all([
    getCurrentBalance(),
    getDiaries(5),
    getGallery(6),
  ])

  return (
    <div className="p-4 space-y-6">
      {/* Balance Card */}
      <BalanceCard balance={balance} />

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Link
          href="/diary/new"
          className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
        >
          <BookOpen className="w-6 h-6 text-primary-600 mb-2" />
          <span className="text-xs text-gray-600">Diari Baru</span>
        </Link>
        <Link
          href="/expenses/new"
          className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
        >
          <PlusCircle className="w-6 h-6 text-green-600 mb-2" />
          <span className="text-xs text-gray-600">Perbelanjaan</span>
        </Link>
        <Link
          href="/gallery/new"
          className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
        >
          <Image className="w-6 h-6 text-purple-600 mb-2" />
          <span className="text-xs text-gray-600">Gambar Baru</span>
        </Link>
      </div>

      {/* Recent Diaries */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Diari Terkini</CardTitle>
        </CardHeader>
        <CardContent>
          {diaries.length === 0 ? (
            <p className="text-gray-500 text-sm">Tiada entri diari lagi.</p>
          ) : (
            <div className="space-y-3">
              {diaries.map((diary) => (
                <div key={diary.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {diary.users?.nama || 'Tidak diketahui'}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(diary.tarikh)}</p>
                    {diary.catatan && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {diary.catatan}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Gallery */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Gambar Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {gallery.length === 0 ? (
            <p className="text-gray-500 text-sm">Tiada gambar lagi.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                >
                  {item.pautan_gambar && (
                    <img
                      src={item.pautan_gambar}
                      alt={item.keterangan || 'Gallery image'}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}