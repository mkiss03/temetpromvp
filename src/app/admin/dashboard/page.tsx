import { createClient } from '@/lib/supabase/server'
import { getCurrentTenant, getCurrentUser } from '@/lib/auth/permissions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const tenant = await getCurrentTenant()

  if (!user || !tenant) {
    return null
  }

  const supabase = await createClient()

  // Get lead statistics
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('tenant_id', tenant.id)
    .is('archived_at', null)

  const newLeads = leads?.filter(l => l.status === 'new') || []
  const inProgressLeads = leads?.filter(l => l.status === 'in_progress') || []

  // Get client count
  const { count: clientCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenant.id)
    .is('archived_at', null)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-slate-600">Üdvözöljük, {tenant.name}!</p>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Új megkeresések</CardTitle>
            <CardDescription>Még nem feldolgozott</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{newLeads.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Folyamatban</CardTitle>
            <CardDescription>Aktív megkeresések</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inProgressLeads.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ügyfelek</CardTitle>
            <CardDescription>Összes aktív ügyfél</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clientCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Legutóbbi megkeresések</CardTitle>
              <CardDescription>Az elmúlt napok megkeresései</CardDescription>
            </div>
            <Link href="/admin/leads">
              <Button variant="outline">Összes megtekintése</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {leads && leads.length > 0 ? (
            <div className="space-y-4">
              {leads.slice(0, 5).map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="block p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{lead.full_name}</div>
                      <div className="text-sm text-slate-600">{lead.phone}</div>
                      {lead.message && (
                        <div className="text-sm text-slate-500 mt-1 line-clamp-1">
                          {lead.message}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant={
                          lead.status === 'new'
                            ? 'default'
                            : lead.status === 'closed'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {lead.status === 'new'
                          ? 'Új'
                          : lead.status === 'in_progress'
                          ? 'Folyamatban'
                          : lead.status === 'waiting'
                          ? 'Várakozik'
                          : 'Lezárva'}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {new Date(lead.created_at).toLocaleDateString('hu-HU')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              Még nincsenek megkeresések
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
