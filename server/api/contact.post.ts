import { Resend } from 'resend'
import { rateLimit } from '../utils/rateLimit'

interface ContactBody {
  name:    string
  email:   string
  subject: string
  message: string
}

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

export default defineEventHandler(async (event) => {
  // CSRF: reject requests from foreign origins
  const origin = getHeader(event, 'origin') ?? ''
  const allowed = ['https://1lifeproduction.com', 'http://localhost:3000', 'http://localhost:3001']
  if (origin && !allowed.some(o => origin.startsWith(o))) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  // Rate-limit: 3 requests / 60 s per IP
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const { allowed: ok, retryAfter } = rateLimit(ip, 3, 60_000)
  if (!ok) {
    setHeader(event, 'Retry-After', String(retryAfter))
    throw createError({ statusCode: 429, message: 'Trop de requêtes, réessayez dans une minute.' })
  }

  const config = useRuntimeConfig()
  if (!config.resendApiKey) {
    throw createError({ statusCode: 500, message: 'Erreur serveur, réessayez plus tard.' })
  }

  const body = await readBody<ContactBody>(event)
  const { name, email, subject, message } = body ?? {}

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    throw createError({ statusCode: 400, message: 'Tous les champs sont requis.' })
  }
  if (!EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, message: 'Adresse email invalide.' })
  }
  if (name.length > 120 || subject.length > 200 || message.length > 5000) {
    throw createError({ statusCode: 400, message: 'Un champ dépasse la taille maximale autorisée.' })
  }

  const resend = new Resend(config.resendApiKey)
  const to = config.resendTo || email

  const { error } = await resend.emails.send({
    from:    config.resendFrom,
    to:      [to],
    replyTo: email,
    subject: `[1LIFE] ${subject}`,
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
    throw createError({ statusCode: 502, message: 'Erreur lors de l\'envoi, réessayez plus tard.' })
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
