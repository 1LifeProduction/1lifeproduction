<script setup lang="ts">
/* URL profonde d'un projet : affiche la page de sa catégorie avec la modale
   du projet DÉJÀ OUVERTE par-dessus (voir initialProjectId dans
   CategoryPage.vue). Pour le visiteur c'est la modale habituelle ; pour
   Google c'est une vraie page pré-générée avec son titre, sa description et
   ses données VideoObject. Les 41 routes sont pré-rendues au build
   (nitro.prerender dans nuxt.config.ts) et listées dans le sitemap. */
import projectsData from '~/data/projects.json'
import { getGroup, type Section } from '~/data/categories'

const route = useRoute()
const slug = route.params.slug as string

const project = projectsData.find(p => p.id === slug)
if (!project) {
  throw createError({ statusCode: 404, statusMessage: 'Projet introuvable', fatal: true })
}

const section = project.section as Section
const group = getGroup(section)!

const SITE_URL = 'https://1lifeproduction.com'
/* Client ajouté au titre seulement s'il apporte une info (pas "CHARLATTE · Charlatte") */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
const clientInTitle = project.client && !norm(project.title).includes(norm(project.client))
const pageTitle = `${project.title}${clientInTitle ? ` · ${project.client}` : ''} | 1LIFE PRODUCTION`
/* Description : le champ "description" peut n'être qu'un crédit court
   ("© …") → on ne l'utilise en meta que s'il fait une vraie phrase. */
const subLabel = group.children.find(c => c.slug === project.category)?.label ?? group.label
const customDesc = project.description?.trim() ?? ''
const description = customDesc.length >= 50
  ? customDesc
  : `${project.title}${clientInTitle ? ` pour ${project.client}` : ''} — ${subLabel} (${group.label}) par 1LIFE PRODUCTION, studio de production audiovisuelle à Paris.`

/* URL d'embed pour le JSON-LD — Vimeo ou YouTube (même logique que
   VimeoEmbed.vue) ; null si le lien n'est reconnu par aucune des deux. */
function toEmbedUrl(url: string): string | null {
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  )
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`
  const playlist = url.match(/[?&]list=([A-Za-z0-9_-]+)/)
  if (playlist) return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlist[1]}`
  return null
}
const embedUrl = project.vimeo_url ? toEmbedUrl(project.vimeo_url) : null

/* VideoObject uniquement si on a de la matière (vidéo ou vignette) */
const videoLd = (project.vimeo_url || project.thumbnail)
  ? [{
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: project.title,
        description,
        ...(project.thumbnail ? { thumbnailUrl: `${SITE_URL}${project.thumbnail}` } : {}),
        ...(embedUrl ? { embedUrl } : {}),
        ...('year' in project && project.year ? { uploadDate: `${project.year}-01-01` } : {}),
        publisher: { '@type': 'Organization', name: '1LIFE PRODUCTION', url: SITE_URL },
      }),
    }]
  : []

useHead({
  title: pageTitle,
  meta: [
    { name: 'description',        content: description },
    { property: 'og:title',       content: pageTitle },
    { property: 'og:description', content: description },
    ...(project.thumbnail
      ? [{ property: 'og:image', content: `${SITE_URL}${project.thumbnail}` }]
      : []),
  ],
  script: videoLd,
})
</script>

<template>
  <CategoryPage :section="section" :initial-project-id="project!.id" />
</template>
