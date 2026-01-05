import { createClient } from '@/lib/supabase/server'
import { getCurrentTenant } from '@/lib/auth/permissions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatDateTime } from '@/lib/utils'

export default async function LeadsPage() {
  const tenant = await getCurrentTenant()

  if (!tenant) {
    return null
  }

  const supabase = await createClient()

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('tenant_id', tenant.id)
    .is('archived_at', null)
    .order('created_at', { ascending: false })

  const statusLabels: Record<string, string> = {
    new: 'Új',
    in_progress: 'Folyamatban',
    waiting: 'Várakozik',
    closed: 'Lezárva',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Megkeresések</h1>
        <p className="text-slate-600">Az összes beérkezett érdeklődés</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Összes megkeresés ({leads?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {leads && leads.length > 0 ? (
            <div className="space-y-2">
              {leads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="block p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-lg">{lead.full_name}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        {lead.phone}
                        {lead.email && <> • {lead.email}</>}
                        {lead.city && <> • {lead.city}</>}
                      </div>
                      {lead.message && (
                        <div className="text-sm text-slate-500 mt-2 line-clamp-2">
                          {lead.message}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <Badge
                        variant={
                          lead.status === 'new'
                            ? 'default'
                            : lead.status === 'closed'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {statusLabels[lead.status]}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {formatDateTime(lead.created_at)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Még nincsenek megkeresések
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
