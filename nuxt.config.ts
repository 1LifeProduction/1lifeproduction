import { readdirSync } from 'node:fs'
import projects from './data/projects.json'

/* Logos réellement présents dans public/clients/ : lus AU BUILD et exposés
   via appConfig → serveur et client voient exactement la même liste (un
   import.meta.glob côté composant pouvait diverger entre les deux bundles
   en dev → erreurs d'hydratation). BrandMarquee ignore les logos de
   content/clients.json dont le fichier manque. */
const clientLogos = readdirSync(new URL('./public/clients', import.meta.url))

/* URLs profondes des projets (/projets/<id>) : pré-rendues au build et
   ajoutées au sitemap — le générateur ne peut pas les découvrir en crawlant
   (les modales s'ouvrent via des <button>, pas des liens). */
const projectRoutes = projects.map(p => `/projets/${p.id}`)

export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  /* Sitemap généré automatiquement à chaque build (avec lastmod) : remplace
     l'ancien public/sitemap.xml maintenu à la main. Les stubs de redirection
     noindex (/a-propos, /commercial) en sont exclus. */
  modules: ['@nuxtjs/sitemap'],
  site: {
    url: 'https://1lifeproduction.com',
    name: '1LIFE PRODUCTION',
  },
  sitemap: {
    exclude: ['/a-propos', '/commercial', '/404'],
    urls: projectRoutes,
  },

  /* Build = "nuxt build" (Vercel) : TOUTES les pages sont pré-rendues en HTML
     statique au build (routeRules '/**' + crawl) — même résultat qu'un
     generate pour le visiteur et le SEO — et seule la route serveur
     /api/contact (formulaire → Resend) tourne en fonction serverless.
     Un "nuxt generate" (script npm run generate) reste possible pour un
     hébergement 100 % statique, mais sans formulaire. */
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', ...projectRoutes],
    },
  },

  /* Anciennes URLs → redirections 301 déclarées au niveau du routeur serveur
     (remplace les anciennes pages "stub" qui redirigeaient en JS client).
     En dev/SSR : vrai 301. En statique : page meta-refresh instantanée,
     signal de redirection permanente pour Google. Le 301 serveur chez
     l'hébergeur reste le complément idéal (voir PDF client, point 5). */
  routeRules: {
    '/**':         { prerender: true },
    '/api/**':     { prerender: false },
    '/a-propos':   { redirect: { to: '/equipe', statusCode: 301 } },
    '/commercial': { redirect: { to: '/marque', statusCode: 301 } },
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      /* Le site est en français — indispensable pour l'indexation linguistique
         et les lecteurs d'écran. */
      htmlAttrs: { lang: 'fr' },
      title: '1LIFE PRODUCTION',
      meta: [
        { name: 'viewport',    content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Collectif créatif spécialisé dans la production audiovisuelle — photographes, vidéastes, motion designers et experts VFX.' },
        { name: 'robots',      content: 'index, follow' },
        /* Open Graph — valeurs PAR DÉFAUT : chaque page surcharge og:title et
           og:description (dédupliqué par `property`), app.vue pose og:url.
           Twitter : PAS de twitter:title/description ici — en leur absence,
           les cartes retombent sur les og:* de la page (les valeurs globales
           écraseraient les titres par page). */
        { property: 'og:type',        content: 'website' },
        { property: 'og:site_name',   content: '1LIFE PRODUCTION' },
        { property: 'og:locale',      content: 'fr_FR' },
        { property: 'og:title',       content: '1LIFE PRODUCTION' },
        { property: 'og:description', content: 'Collectif créatif spécialisé dans la production audiovisuelle — photographes, vidéastes, motion designers et experts VFX.' },
        { property: 'og:image',       content: 'https://1lifeproduction.com/og-image.jpg' },
        { name: 'twitter:card',       content: 'summary_large_image' },
        { name: 'theme-color',        content: '#000000' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          /* Montserrat 300 (texte courant) + 700 (bulles .xp-pill en gras —
             sans cette graisse le navigateur simulerait un faux gras).
             Inter (6 graisses !) n'était utilisé par aucune règle CSS —
             c'était ~100 Ko de police render-blocking pour rien. Il reste en
             simple fallback système dans --font. */
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;700&display=swap',
        },
      ],
    },
  },

  appConfig: {
    clientLogos,
  },

  runtimeConfig: {
    resendApiKey: process.env.RESEND_API_KEY || '',
    resendFrom:   process.env.RESEND_FROM   || 'onboarding@resend.dev',
    resendTo:     process.env.RESEND_TO     || '',
  },

  compatibilityDate: '2024-11-01',
})
