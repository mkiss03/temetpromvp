'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface LeadStatusUpdateProps {
  leadId: string
  currentStatus: string
}

const statusOptions = [
  { value: 'new', label: 'Új' },
  { value: 'in_progress', label: 'Folyamatban' },
  { value: 'waiting', label: 'Várakozik' },
  { value: 'closed', label: 'Lezárva' },
]

export function LeadStatusUpdate({ leadId, currentStatus }: LeadStatusUpdateProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  async function updateStatus(newStatus: string) {
    if (newStatus === currentStatus) return

    setIsUpdating(true)

    const supabase = createClient()

    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId)

    if (error) {
      console.error('Error updating status:', error)
      alert('Hiba történt a státusz frissítése során')
    } else {
      router.refresh()
    }

    setIsUpdating(false)
  }

  return (
    <div className="space-y-2">
      {statusOptions.map((option) => (
        <Button
          key={option.value}
          variant={currentStatus === option.value ? 'default' : 'outline'}
          className="w-full justify-start"
          onClick={() => updateStatus(option.value)}
          disabled={isUpdating || currentStatus === option.value}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
