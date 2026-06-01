import { readFileSync } from 'fs'
import { resolve } from 'path'

const projects: { id: string }[] = JSON.parse(
  readFileSync(resolve('./data/projects.json'), 'utf-8')
)

export default defineNuxtConfig({
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: '1LIFE PRODUCTION',
      meta: [
        { name: 'description', content: 'Collectif de vidéastes indépendants — Événementiel & Commercial' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
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
    public: {
      web3formsKey: process.env.WEB3FORMS_ACCESS_KEY || '',
    },
  },

  nitro: {
    prerender: {
      routes: projects.map(p => `/projects/${p.id}`),
    },
  },

  compatibilityDate: '2024-11-01',
})
