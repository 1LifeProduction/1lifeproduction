<script setup lang="ts">
/* Page légale (mentions légales / politique de confidentialité).
   Textes : content/legal.json — le client fournira le contenu. Tant que
   'sections' est vide, la page affiche un texte d'attente et reste en noindex
   (elle est aussi à retirer de sitemap.exclude dans nuxt.config.ts une fois
   remplie). Reprend les styles du hero contact, pas de nouvelle DA. */
import legal from '~/content/legal.json'

type LegalKey = 'mentions-legales' | 'politique-de-confidentialite'
interface LegalSection { titre: string; paragraphes: string[] }

const props = defineProps<{ page: LegalKey }>()

const content    = legal[props.page]
const titleLines = content.titre.split('\n')
const sections   = content.sections as LegalSection[]

useHead({
  title: content.seo.titre,
  meta: [
    { name: 'description',        content: content.seo.description },
    { property: 'og:title',       content: content.seo.titre },
    { property: 'og:description', content: content.seo.description },
    ...(sections.length ? [] : [{ name: 'robots', content: 'noindex' }]),
  ],
})
</script>

<template>
  <div class="contact-page grid-bg">

    <section class="contact-hero">
      <h1 class="contact-hero__title" data-reveal>
        <template v-for="(line, i) in titleLines" :key="i">
          <br v-if="i > 0">{{ line }}
        </template>
      </h1>
      <p v-if="!sections.length" class="contact-hero__sub" data-reveal style="--reveal-delay:120ms">
        {{ legal.aVenir }}
      </p>
    </section>

    <section v-if="sections.length" class="legal-body">
      <div v-for="s in sections" :key="s.titre" class="legal-body__section" data-reveal>
        <h2 class="legal-body__title">{{ s.titre }}</h2>
        <p v-for="(p, i) in s.paragraphes" :key="i" class="legal-body__text" v-html="boldify(p)"></p>
      </div>
    </section>

  </div>
</template>
