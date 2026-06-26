<script setup lang="ts">
import projectsData from '~/data/projects.json'
import heroImg from '~/assets/images/imgHeader.png'
import { getGroup, getSubCategory, nextSubCategory, categoryHref } from '~/data/categories'

const SECTION = 'evenementiel' as const
const route   = useRoute()
const group   = getGroup(SECTION)!

const allProjects = projectsData.filter(p => p.section === SECTION)

function getCategoryThumb(slug: string) {
  return allProjects.find(p => p.category === slug)?.thumbnail ?? null
}

/** Copy éditoriale, sinon placeholder balisé à fournir. */
function copyOf(sub: { desc?: string; copyKey: string }) {
  return sub.desc ?? `{{${sub.copyKey}}}`
}

/* Placeholder copy d'intro de page (évite les accolades littérales en template) */
const sectionCopy = `{{${group.copyKey}}}`

const activeSub = computed(() => {
  const val = route.query.category as string
  return val ? (getSubCategory(val) ?? null) : null
})

const nextSub = computed(() => activeSub.value ? nextSubCategory(activeSub.value.slug) : null)

const filteredProjects = computed(() =>
  activeSub.value
    ? allProjects.filter(p => p.category === activeSub.value!.slug)
    : []
)

useHead(computed(() => ({
  title: '1LIFE PRODUCTION',
  meta: [
    { name: 'description',        content: 'Captations, livestreams, lives sessions et afterfilms. 1LIFE PRODUCTION capture l\'énergie de vos événements avec un regard cinématographique.' },
    { property: 'og:description', content: 'Captations, livestreams, lives sessions et afterfilms. 1LIFE PRODUCTION capture l\'énergie de vos événements avec un regard cinématographique.' },
  ],
})))
</script>

<template>
  <div class="evnt-page">

    <!-- Hero -->
    <section class="evnt-hero" data-nav-theme="dark">
      <img :src="heroImg" alt="" class="evnt-hero__img" aria-hidden="true" fetchpriority="high" />
      <div class="evnt-hero__overlay" aria-hidden="true"></div>
      <div class="evnt-hero__bottom">
        <div data-reveal style="--reveal-delay:100ms">
          <!-- Vue sous-catégorie : la sous-catégorie devient le titre -->
          <template v-if="activeSub">
            <NuxtLink to="/evenementiel" class="evnt-hero__back">← {{ group.label }}</NuxtLink>
            <h1 class="evnt-hero__title">{{ activeSub.label }}</h1>
          </template>
          <!-- Vue overview -->
          <h1 v-else class="evnt-hero__title">{{ group.label }}</h1>
        </div>
        <!-- Copy d'intro (placeholder à fournir) -->
        <p v-if="activeSub" class="evnt-hero__desc" data-reveal style="--reveal-delay:250ms">
          {{ copyOf(activeSub) }}
        </p>
        <p v-else class="evnt-hero__desc" data-reveal style="--reveal-delay:250ms">
          {{ sectionCopy }}
        </p>
      </div>
    </section>

    <!-- Vue sous-catégorie : liste de projets -->
    <div v-if="activeSub" class="cat-list grid-bg" data-nav-theme="dark">
      <div
        v-for="(p, i) in filteredProjects"
        :key="p.id"
        class="cat-list__item"
        data-reveal
        :style="`--reveal-delay:${i * 80}ms`"
      >
        <div class="cat-list__thumb">
          <VimeoEmbed v-if="p.vimeo_url" :url="p.vimeo_url" :title="p.title" />
          <img v-else-if="p.thumbnail" :src="p.thumbnail" :alt="p.title" class="cat-list__img" />
          <div v-else class="cat-list__placeholder" />
        </div>
        <div class="cat-list__info">
          <h2 class="cat-list__title">{{ p.title }}</h2>
          <p class="cat-list__desc">{{ p.description }}</p>
          <div class="cat-list__meta">
            <span>{{ p.year }}</span>
            <span>{{ p.client }}</span>
          </div>
        </div>
      </div>
      <div v-if="!filteredProjects.length" class="empty-state">Aucun projet dans cette catégorie</div>

      <!-- Navigation vers la sous-catégorie suivante -->
      <nav v-if="nextSub" class="subcat-nav" aria-label="Sous-catégorie suivante">
        <NuxtLink :to="categoryHref(SECTION, nextSub.slug)" class="subcat-nav__next">
          <span class="subcat-nav__label">{{ nextSub.label }}</span>
          <svg class="subcat-nav__arrow" viewBox="0 0 40 16" aria-hidden="true">
            <path d="M0 8h38M32 2l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </NuxtLink>
      </nav>
    </div>

    <!-- Vue overview : sections éditoriales -->
    <div v-else class="evnt-cats grid-bg" data-nav-theme="dark">
      <section
        v-for="(cat, i) in group.children"
        :key="cat.slug"
        :class="['evnt-cat', i % 2 !== 0 && 'evnt-cat--reversed']"
      >
        <div class="evnt-cat__text" :data-reveal="i % 2 !== 0 ? 'right' : 'left'">
          <h2 class="evnt-cat__title">{{ cat.label }}</h2>
          <p class="evnt-cat__desc">{{ copyOf(cat) }}</p>
        </div>
        <NuxtLink :to="categoryHref(SECTION, cat.slug)" class="evnt-cat__media" :data-reveal="i % 2 !== 0 ? 'left' : 'right'" style="--reveal-delay:120ms">
          <img
            v-if="getCategoryThumb(cat.slug)"
            :src="getCategoryThumb(cat.slug)!"
            :alt="cat.label"
            class="evnt-cat__img"
          />
          <div v-else class="evnt-cat__placeholder" />
        </NuxtLink>
      </section>
    </div>

  </div>
</template>
