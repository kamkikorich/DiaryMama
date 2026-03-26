import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'
import { BottomNav } from '@/components/layout/bottom-nav'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pb-nav">{children}</main>
      <BottomNav />
    </div>
  )
}