import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentTenant } from '@/lib/auth/permissions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils'
import { Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react'

interface ClientDetailPageProps {
  params: {
    id: string
  }
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const tenant = await getCurrentTenant()

  if (!tenant) {
    return null
  }

  const supabase = await createClient()

  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .eq('tenant_id', tenant.id)
    .single()

  if (error || !client) {
    notFound()
  }

  // Get related lead if exists
  let relatedLead = null
  if (client.created_from_lead_id) {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('id', client.created_from_lead_id)
      .single()
    relatedLead = data
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{client.full_name}</h1>
        <p className="text-slate-600">Ügyfél részletei</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Client Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kapcsolattartási adatok</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {client.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-slate-500" />
                  <a href={`tel:${client.phone}`} className="text-slate-900 hover:underline">
                    {client.phone}
                  </a>
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-500" />
                  <a href={`mailto:${client.email}`} className="text-slate-900 hover:underline">
                    {client.email}
                  </a>
                </div>
              )}
              {(client.address || client.city) && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-slate-500" />
                  <span className="text-slate-900">
                    {client.address && <>{client.address}, </>}
                    {client.city} {client.postal_code}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-500" />
                <span className="text-slate-900">
                  Létrehozva: {formatDateTime(client.created_at)}
                </span>
              </div>
            </CardContent>
          </Card>

          {client.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Megjegyzések</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap">{client.notes}</p>
              </CardContent>
            </Card>
          )}

          {relatedLead && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900">Kapcsolódó megkeresés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-blue-800">
                  <div>
                    <span className="font-medium">Dátum:</span>{' '}
                    {formatDateTime(relatedLead.created_at)}
                  </div>
                  {relatedLead.message && (
                    <div>
                      <span className="font-medium">Eredeti üzenet:</span>
                      <p className="mt-1 whitespace-pre-wrap">{relatedLead.message}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>További információk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {client.tax_number && (
                <div>
                  <span className="text-slate-600">Adószám:</span>{' '}
                  <span className="font-medium">{client.tax_number}</span>
                </div>
              )}
              <div>
                <span className="text-slate-600">Utolsó módosítás:</span>{' '}
                <span className="font-medium">{formatDateTime(client.updated_at)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
