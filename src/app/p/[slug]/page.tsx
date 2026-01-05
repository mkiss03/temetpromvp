import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LeadForm } from "@/components/public/lead-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

interface PartnerPageProps {
  params: {
    slug: string
  }
}

export default async function PartnerPage({ params }: PartnerPageProps) {
  const supabase = await createClient()

  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (error || !tenant) {
    notFound()
  }

  const openingHours = tenant.opening_hours as any || {}

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost">← Vissza a főoldalra</Button>
          </Link>
        </div>
      </header>

      {/* Partner Info */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Partner Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{tenant.name}</h1>
              <p className="text-lg text-slate-600">{tenant.city}</p>
            </div>

            {tenant.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Bemutatkozás</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 whitespace-pre-wrap">{tenant.description}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Elérhetőség</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tenant.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-slate-500" />
                    <a href={`tel:${tenant.phone}`} className="text-slate-900 hover:underline">
                      {tenant.phone}
                    </a>
                  </div>
                )}
                {tenant.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-slate-500" />
                    <a href={`mailto:${tenant.email}`} className="text-slate-900 hover:underline">
                      {tenant.email}
                    </a>
                  </div>
                )}
                {tenant.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-slate-500" />
                    <p className="text-slate-900">
                      {tenant.address}, {tenant.city} {tenant.postal_code}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {Object.keys(openingHours).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Nyitvatartás</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-slate-500 mt-1" />
                    <div className="space-y-1">
                      {Object.entries(openingHours).map(([day, hours]) => (
                        <div key={day} className="flex gap-2">
                          <span className="font-medium text-slate-700 w-24">{day}:</span>
                          <span className="text-slate-600">{hours as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Lead Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Érdeklődés</CardTitle>
                <CardDescription>
                  Töltse ki az alábbi űrlapot, és hamarosan felvesszük Önnel a kapcsolatot.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LeadForm tenantId={tenant.id} tenantName={tenant.name} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
