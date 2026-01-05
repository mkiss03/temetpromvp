import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentTenant, requireTenantAccess } from '@/lib/auth/permissions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LeadStatusUpdate } from '@/components/admin/lead-status-update'
import { ConvertToClientButton } from '@/components/admin/convert-to-client-button'
import { formatDateTime } from '@/lib/utils'
import { Mail, Phone, MapPin, Calendar } from 'lucide-react'

interface LeadDetailPageProps {
  params: {
    id: string
  }
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const tenant = await getCurrentTenant()

  if (!tenant) {
    return null
  }

  const supabase = await createClient()

  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', params.id)
    .eq('tenant_id', tenant.id)
    .single()

  if (error || !lead) {
    notFound()
  }

  const statusLabels: Record<string, string> = {
    new: 'Új',
    in_progress: 'Folyamatban',
    waiting: 'Várakozik',
    closed: 'Lezárva',
  }

  const isConverted = !!lead.converted_to_client_id

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{lead.full_name}</h1>
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
        </div>
        {!isConverted && <ConvertToClientButton leadId={lead.id} leadData={lead} />}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lead Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kapcsolattartási adatok</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-slate-500" />
                  <a href={`tel:${lead.phone}`} className="text-slate-900 hover:underline">
                    {lead.phone}
                  </a>
                </div>
              )}
              {lead.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-500" />
                  <a href={`mailto:${lead.email}`} className="text-slate-900 hover:underline">
                    {lead.email}
                  </a>
                </div>
              )}
              {lead.city && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-slate-500" />
                  <span className="text-slate-900">{lead.city}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-500" />
                <span className="text-slate-900">{formatDateTime(lead.created_at)}</span>
              </div>
            </CardContent>
          </Card>

          {lead.message && (
            <Card>
              <CardHeader>
                <CardTitle>Üzenet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap">{lead.message}</p>
              </CardContent>
            </Card>
          )}

          {isConverted && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <p className="text-green-800 font-medium">
                  Ez a megkeresés már ügyféllé lett konvertálva.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Státusz frissítése</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadStatusUpdate leadId={lead.id} currentStatus={lead.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Információk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-slate-600">Forrás:</span>{' '}
                <span className="font-medium">{lead.source || 'website'}</span>
              </div>
              <div>
                <span className="text-slate-600">GDPR hozzájárulás:</span>{' '}
                <span className="font-medium">{lead.gdpr_consent ? 'Igen' : 'Nem'}</span>
              </div>
              {lead.gdpr_consent_at && (
                <div className="text-xs text-slate-500">
                  {formatDateTime(lead.gdpr_consent_at)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
