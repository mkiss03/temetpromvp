'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

interface LeadFormProps {
  tenantId: string
  tenantName: string
}

export function LeadForm({ tenantId, tenantName }: LeadFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      tenant_id: tenantId,
      full_name: formData.get('full_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      city: formData.get('city') as string,
      message: formData.get('message') as string,
      gdpr_consent: formData.get('gdpr_consent') === 'on',
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Hiba történt az űrlap beküldése során')
      }

      router.push('/thanks')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hiba történt')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Név *</Label>
        <Input
          id="full_name"
          name="full_name"
          required
          placeholder="Teljes név"
        />
      </div>

      <div>
        <Label htmlFor="phone">Telefonszám *</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="+36 30 123 4567"
        />
      </div>

      <div>
        <Label htmlFor="email">E-mail cím</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="pelda@email.hu"
        />
      </div>

      <div>
        <Label htmlFor="city">Település</Label>
        <Input
          id="city"
          name="city"
          placeholder="Budapest"
        />
      </div>

      <div>
        <Label htmlFor="message">Üzenet</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Kérem, írja le, miben segíthetünk..."
          rows={4}
        />
      </div>

      <div className="flex items-start gap-2">
        <Checkbox id="gdpr_consent" name="gdpr_consent" required />
        <Label htmlFor="gdpr_consent" className="text-sm leading-tight cursor-pointer">
          Elfogadom az{' '}
          <a href="/privacy" className="underline hover:text-primary" target="_blank">
            adatkezelési tájékoztatót
          </a>{' '}
          és hozzájárulok adataim kezeléséhez.
        </Label>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Küldés...' : 'Érdeklődés beküldése'}
      </Button>

      <p className="text-xs text-slate-500 text-center">
        A megkeresés közvetlenül a(z) {tenantName} részére kerül elküldésre.
      </p>
    </form>
  )
}
