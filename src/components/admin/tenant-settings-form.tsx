'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'

interface TenantSettingsFormProps {
  tenant: any
}

export function TenantSettingsForm({ tenant }: TenantSettingsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

    const updates = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      postal_code: formData.get('postal_code') as string,
      description: formData.get('description') as string,
      website_url: formData.get('website_url') as string,
    }

    const supabase = createClient()

    const { error: updateError } = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', tenant.id)

    if (updateError) {
      console.error('Error updating tenant:', updateError)
      setError('Hiba történt a mentés során')
    } else {
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Vállalat neve *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={tenant.name}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">E-mail cím</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={tenant.email || ''}
          />
        </div>

        <div>
          <Label htmlFor="phone">Telefonszám</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={tenant.phone || ''}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Cím</Label>
        <Input
          id="address"
          name="address"
          defaultValue={tenant.address || ''}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">Város</Label>
          <Input
            id="city"
            name="city"
            defaultValue={tenant.city || ''}
          />
        </div>

        <div>
          <Label htmlFor="postal_code">Irányítószám</Label>
          <Input
            id="postal_code"
            name="postal_code"
            defaultValue={tenant.postal_code || ''}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="website_url">Weboldal URL</Label>
        <Input
          id="website_url"
          name="website_url"
          type="url"
          defaultValue={tenant.website_url || ''}
          placeholder="https://"
        />
      </div>

      <div>
        <Label htmlFor="description">Bemutatkozás</Label>
        <Textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={tenant.description || ''}
          placeholder="Írjon néhány mondatot a vállalkozásról..."
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
          A változtatások sikeresen mentve!
        </div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Mentés...' : 'Módosítások mentése'}
      </Button>
    </form>
  )
}
