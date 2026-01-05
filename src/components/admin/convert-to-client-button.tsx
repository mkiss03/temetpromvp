'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface ConvertToClientButtonProps {
  leadId: string
  leadData: any
}

export function ConvertToClientButton({ leadId, leadData }: ConvertToClientButtonProps) {
  const router = useRouter()
  const [isConverting, setIsConverting] = useState(false)

  async function handleConvert() {
    if (!confirm('Biztosan ügyféllé szeretné konvertálni ezt a megkeresést?')) {
      return
    }

    setIsConverting(true)

    const supabase = createClient()

    // Create client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({
        tenant_id: leadData.tenant_id,
        full_name: leadData.full_name,
        email: leadData.email,
        phone: leadData.phone,
        city: leadData.city,
        created_from_lead_id: leadId,
      })
      .select()
      .single()

    if (clientError) {
      console.error('Error creating client:', clientError)
      alert('Hiba történt az ügyfél létrehozása során')
      setIsConverting(false)
      return
    }

    // Update lead with client reference
    const { error: leadError } = await supabase
      .from('leads')
      .update({
        converted_to_client_id: client.id,
        status: 'closed',
      })
      .eq('id', leadId)

    if (leadError) {
      console.error('Error updating lead:', leadError)
      alert('Hiba történt a megkeresés frissítése során')
      setIsConverting(false)
      return
    }

    router.push(`/admin/clients/${client.id}`)
    router.refresh()
  }

  return (
    <Button onClick={handleConvert} disabled={isConverting}>
      {isConverting ? 'Konvertálás...' : 'Konvertálás ügyféllé'}
    </Button>
  )
}
