import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendLeadNotificationEmails } from '@/lib/email/notifications'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { tenant_id, full_name, email, phone, city, message, gdpr_consent } = body

    // Validation
    if (!tenant_id || !full_name || !phone) {
      return NextResponse.json(
        { error: 'Hiányzó kötelező mezők' },
        { status: 400 }
      )
    }

    if (!gdpr_consent) {
      return NextResponse.json(
        { error: 'Az adatkezelési tájékoztató elfogadása kötelező' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Create lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        tenant_id,
        full_name,
        email,
        phone,
        city,
        message,
        gdpr_consent,
        gdpr_consent_at: new Date().toISOString(),
        status: 'new',
        source: 'website',
      })
      .select()
      .single()

    if (leadError) {
      console.error('Error creating lead:', leadError)
      return NextResponse.json(
        { error: 'Hiba történt az űrlap feldolgozása során' },
        { status: 500 }
      )
    }

    // Get tenant info for emails
    const { data: tenant } = await supabase
      .from('tenants')
      .select('name, email')
      .eq('id', tenant_id)
      .single()

    // Send notification emails (non-blocking)
    if (tenant) {
      sendLeadNotificationEmails({
        leadId: lead.id,
        leadName: full_name,
        leadEmail: email,
        leadPhone: phone,
        leadMessage: message || '',
        tenantName: tenant.name,
        tenantEmail: tenant.email,
      }).catch(err => {
        console.error('Failed to send notification emails:', err)
      })
    }

    return NextResponse.json({ success: true, leadId: lead.id })
  } catch (error) {
    console.error('Unexpected error in POST /api/leads:', error)
    return NextResponse.json(
      { error: 'Váratlan hiba történt' },
      { status: 500 }
    )
  }
}
