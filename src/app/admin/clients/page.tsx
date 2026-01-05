import { createClient } from '@/lib/supabase/server'
import { getCurrentTenant } from '@/lib/auth/permissions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { formatDateTime } from '@/lib/utils'

export default async function ClientsPage() {
  const tenant = await getCurrentTenant()

  if (!tenant) {
    return null
  }

  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('tenant_id', tenant.id)
    .is('archived_at', null)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Ügyfelek</h1>
        <p className="text-slate-600">Az összes aktív ügyfél</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Összes ügyfél ({clients?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {clients && clients.length > 0 ? (
            <div className="space-y-2">
              {clients.map((client) => (
                <Link
                  key={client.id}
                  href={`/admin/clients/${client.id}`}
                  className="block p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-lg">{client.full_name}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        {client.phone && <>{client.phone}</>}
                        {client.email && <> • {client.email}</>}
                        {client.city && <> • {client.city}</>}
                      </div>
                      {client.notes && (
                        <div className="text-sm text-slate-500 mt-2 line-clamp-1">
                          {client.notes}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex-shrink-0">
                      {formatDateTime(client.created_at)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Még nincsenek ügyfelek
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
