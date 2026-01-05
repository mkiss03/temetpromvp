interface LeadNotificationParams {
  leadId: string
  leadName: string
  leadEmail: string | null
  leadPhone: string
  leadMessage: string
  tenantName: string
  tenantEmail: string | null
}

export async function sendLeadNotificationEmails({
  leadId,
  leadName,
  leadEmail,
  leadPhone,
  leadMessage,
  tenantName,
  tenantEmail,
}: LeadNotificationParams) {
  const isDev = process.env.NODE_ENV === 'development'

  // Email to tenant (partner notification)
  if (tenantEmail) {
    const tenantEmailContent = {
      to: tenantEmail,
      subject: `Új érdeklődés érkezett - ${leadName}`,
      html: `
        <h2>Új érdeklődés érkezett</h2>
        <p>Kedves ${tenantName}!</p>
        <p>Új érdeklődés érkezett a weboldalon keresztül:</p>
        <ul>
          <li><strong>Név:</strong> ${leadName}</li>
          <li><strong>Telefonszám:</strong> ${leadPhone}</li>
          ${leadEmail ? `<li><strong>E-mail:</strong> ${leadEmail}</li>` : ''}
          ${leadMessage ? `<li><strong>Üzenet:</strong> ${leadMessage}</li>` : ''}
        </ul>
        <p>Kérjük, minél hamarabb vegye fel a kapcsolatot az érdeklődővel!</p>
        <p>Az üzenetet a TemetkezésPro adminisztrációs felületén is megtekintheti.</p>
      `,
    }

    if (isDev) {
      console.log('[DEV] Email to tenant:', tenantEmailContent)
    } else {
      await sendEmail(tenantEmailContent)
    }
  }

  // Email to lead (customer confirmation)
  if (leadEmail) {
    const leadEmailContent = {
      to: leadEmail,
      subject: `Visszaigazolás - ${tenantName}`,
      html: `
        <h2>Köszönjük megkeresését!</h2>
        <p>Kedves ${leadName}!</p>
        <p>Megkeresését megkaptuk és továbbítottuk a(z) ${tenantName} részére.</p>
        <p>Kollégáink hamarosan felveszik Önnel a kapcsolatot a megadott elérhetőségeken.</p>
        <p>Üdvözlettel,<br>${tenantName}</p>
      `,
    }

    if (isDev) {
      console.log('[DEV] Email to lead:', leadEmailContent)
    } else {
      await sendEmail(leadEmailContent)
    }
  }
}

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  // If Resend API key is not configured, skip
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email send')
    return
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@temetkezespro.com',
      to,
      subject,
      html,
    })

    console.log(`Email sent to ${to}`)
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}
