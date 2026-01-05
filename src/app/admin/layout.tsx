import { redirect } from 'next/navigation'
import { getCurrentUser, getUserMemberships } from '@/lib/auth/permissions'
import { AdminNav } from '@/components/admin/admin-nav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  // If no user, redirect to login (except for login page itself)
  if (!user) {
    redirect('/admin/login')
  }

  const memberships = await getUserMemberships(user.id)

  if (memberships.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Nincs hozzáférése</h1>
          <p className="text-slate-600">Nem tartozik egyetlen vállalathoz sem.</p>
        </div>
      </div>
    )
  }

  const currentTenant = memberships[0].tenants

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav user={user} tenant={currentTenant} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
