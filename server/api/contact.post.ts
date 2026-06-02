import { Resend } from 'resend'

interface ContactBody {
  name:    string
  email:   string
  subject: string
  message: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.resendApiKey) {
    console.error('[contact] RESEND_API_KEY manquante dans .env')
    throw createError({ statusCode: 500, statusMessage: 'RESEND_API_KEY non configurée', message: 'RESEND_API_KEY non configurée' })
  }

  const body = await readBody<ContactBody>(event)

  // Validation
  const { name, email, subject, message } = body ?? {}
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    throw createError({ statusCode: 400, message: 'Tous les champs sont requis' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, message: 'Adresse email invalide' })
  }

  const resend = new Resend(config.resendApiKey)

  const to = config.resendTo || email

  const { error } = await resend.emails.send({
    from:     config.resendFrom,
    to:       [to],
    replyTo:  email,
    subject:  `[1LIFE] ${subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
        <h2 style="margin-bottom:1.5rem">Nouveau message via le site</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:0.75rem 1rem;background:#f5f5f5;font-weight:600;width:120px">Nom</td>
            <td style="padding:0.75rem 1rem;border-bottom:1px solid #e5e5e5">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding:0.75rem 1rem;background:#f5f5f5;font-weight:600">Email</td>
            <td style="padding:0.75rem 1rem;border-bottom:1px solid #e5e5e5">
              <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:0.75rem 1rem;background:#f5f5f5;font-weight:600">Objet</td>
            <td style="padding:0.75rem 1rem;border-bottom:1px solid #e5e5e5">${escapeHtml(subject)}</td>
          </tr>
          <tr>
            <td style="padding:0.75rem 1rem;background:#f5f5f5;font-weight:600;vertical-align:top">Message</td>
            <td style="padding:0.75rem 1rem;white-space:pre-wrap">${escapeHtml(message)}</td>
          </tr>
        </table>
      </div>
    `,
  })

  if (error) {
    console.error('[contact] Resend error:', error)
    throw createError({ statusCode: 502, statusMessage: error.message, message: error.message })
  }

  return { success: true }
})

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
