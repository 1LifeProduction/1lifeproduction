import { Resend } from 'resend'
import { rateLimit } from '../utils/rateLimit'

interface ContactBody {
  name:        string
  company?:    string
  email:       string
  phone?:      string
  projectType: string
  budget:      string
  message:     string
}

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

const PROJECT_TYPES: Record<string, string> = {
  live:         'Live',
  documentaire: 'Documentaire',
  marque:       'Marque',
  evenementiel: 'Événementiel',
  autre:        'Autre',
}

const BUDGETS: Record<string, string> = {
  '1-3k':       '1 000 à 3 000 €',
  '3-5k':       '3 000 à 5 000 €',
  '5-10k':      '5 000 à 10 000 €',
  '10k+':       'Plus de 10 000 €',
  'determiner': 'À déterminer',
}

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
  const { name, company, email, phone, projectType, budget, message } = body ?? {}

  if (!name?.trim() || !email?.trim() || !projectType?.trim() || !budget?.trim() || !message?.trim()) {
    throw createError({ statusCode: 400, message: 'Merci de compléter les champs obligatoires.' })
  }
  if (!EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, message: 'Adresse email invalide.' })
  }
  if (!PROJECT_TYPES[projectType]) {
    throw createError({ statusCode: 400, message: 'Type de projet invalide.' })
  }
  if (!BUDGETS[budget]) {
    throw createError({ statusCode: 400, message: 'Budget invalide.' })
  }
  if (name.length > 120 || (company?.length ?? 0) > 160 || (phone?.length ?? 0) > 40 || message.length > 5000) {
    throw createError({ statusCode: 400, message: 'Un champ dépasse la taille maximale autorisée.' })
  }

  const resend = new Resend(config.resendApiKey)
  const to = config.resendTo || email

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:0.75rem 1rem;background:#f5f5f5;font-weight:600;width:140px;vertical-align:top">${label}</td>
      <td style="padding:0.75rem 1rem;border-bottom:1px solid #e5e5e5;white-space:pre-wrap">${escapeHtml(value)}</td>
    </tr>`

  const { error } = await resend.emails.send({
    from:    config.resendFrom,
    to:      [to],
    replyTo: email,
    subject: `[1LIFE] Nouveau projet — ${PROJECT_TYPES[projectType]}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
        <h2 style="margin-bottom:1.5rem">Nouvelle demande de devis via le site</h2>
        <table style="width:100%;border-collapse:collapse">
          ${row('Nom', name)}
          ${company?.trim() ? row('Société', company) : ''}
          ${row('Email', email)}
          ${phone?.trim() ? row('Téléphone', phone) : ''}
          ${row('Type de projet', PROJECT_TYPES[projectType])}
          ${row('Budget', BUDGETS[budget])}
          ${row('Message', message)}
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
