export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: '1LIFE PRODUCTION',
      meta: [
        { name: 'viewport',    content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Collectif créatif spécialisé dans la production audiovisuelle — photographes, vidéastes, motion designers et experts VFX.' },
        { name: 'robots',      content: 'index, follow' },
        // Open Graph
        { property: 'og:type',        content: 'website' },
        { property: 'og:site_name',   content: '1LIFE PRODUCTION' },
        { property: 'og:title',       content: '1LIFE PRODUCTION' },
        { property: 'og:description', content: 'Collectif créatif spécialisé dans la production audiovisuelle — photographes, vidéastes, motion designers et experts VFX.' },
        { property: 'og:image',       content: '/og-image.jpg' },
        // Twitter Card
        { name: 'twitter:card',        content: 'summary_large_image' },
        { name: 'twitter:title',       content: '1LIFE PRODUCTION' },
        { name: 'twitter:description', content: 'Collectif créatif spécialisé dans la production audiovisuelle — photographes, vidéastes, motion designers et experts VFX.' },
        { name: 'twitter:image',       content: '/og-image.jpg' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Montserrat:wght@300&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
    resendApiKey: process.env.RESEND_API_KEY || '',
    resendFrom:   process.env.RESEND_FROM   || 'onboarding@resend.dev',
    resendTo:     process.env.RESEND_TO     || '',
  },

  compatibilityDate: '2024-11-01',
})
