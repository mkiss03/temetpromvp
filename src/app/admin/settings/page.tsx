import { createClient } from '@/lib/supabase/server'
import { getCurrentTenant, requireAuth } from '@/lib/auth/permissions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TenantSettingsForm } from '@/components/admin/tenant-settings-form'

export default async function SettingsPage() {
  const user = await requireAuth()
  const tenant = await getCurrentTenant()

  if (!tenant) {
    return null
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Beállítások</h1>
        <p className="text-slate-600">Vállalat profiljának szerkesztése</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vállalat adatai</CardTitle>
          <CardDescription>
            Ezek az adatok jelennek meg a nyilvános profil oldalon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TenantSettingsForm tenant={tenant} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modulok</CardTitle>
          <CardDescription>
            Elérhető funkciók kezelése (hamarosan)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            A modulok kezelése hamarosan elérhető lesz.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
