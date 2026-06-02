<script setup lang="ts">
import projectsData from '~/data/projects.json'
import heroImg from '~/assets/images/imgHeader.png'

const categories = [
  {
    value: 'produits',
    label: 'Produits',
    desc: 'Nous mettons en valeur vos produits à travers une direction artistique soignée. Chaque détail est pensé pour sublimer la matière, la forme et l\'identité de marque avec une image nette et impactante.',
  },
  {
    value: 'films',
    label: 'Films',
    desc: 'Des films de marque à la narration cinématographique, conçus pour ancrer votre identité dans l\'imaginaire de votre audience. Nous construisons des récits visuels qui donnent du sens à votre univers.',
  },
  {
    value: 'publicites',
    label: 'Publicités',
    desc: 'Des spots publicitaires percutants pour diffuser votre message sur tous les écrans. Concept, tournage, montage : nous prenons en charge chaque étape pour livrer une publicité mémorable et efficace.',
  },
  {
    value: 'podcasts',
    label: 'Podcasts',
    desc: 'Captation vidéo de vos podcasts et émissions avec une mise en image professionnelle. Son soigné, cadrage dynamique et post-production adaptée pour valoriser vos contenus sur toutes les plateformes.',
  },
  {
    value: 'portraits',
    label: 'Portraits',
    desc: 'Portraits de dirigeants, créateurs ou talents à mettre en lumière. Nous créons des formats courts et forts qui humanisent votre marque et donnent la parole à ceux qui la font vivre.',
  },
]

const route = useRoute()

const allProjects = projectsData.filter(p => p.section === 'commercial')

function getCategoryThumb(cat: string) {
  return allProjects.find(p => p.category === cat)?.thumbnail ?? null
}

const activeCategory = computed(() => {
  const val = route.query.category as string
  return val ? (categories.find(c => c.value === val) ?? null) : null
})

const filteredProjects = computed(() =>
  activeCategory.value
    ? allProjects.filter(p => p.category === activeCategory.value!.value)
    : []
)

useHead(computed(() => ({
  title: activeCategory.value
    ? `${activeCategory.value.label} — Commercial — 1LIFE PRODUCTION`
    : 'Commercial — 1LIFE PRODUCTION',
})))
usePageTheme('light')
</script>

<template>
  <div class="evnt-page">

    <!-- Hero -->
    <section class="evnt-hero" data-nav-theme="dark">
      <img :src="heroImg" alt="" class="evnt-hero__img" aria-hidden="true" fetchpriority="high" />
      <div class="evnt-hero__overlay" aria-hidden="true"></div>
      <div class="evnt-hero__bottom">
        <div>
          <NuxtLink v-if="activeCategory" to="/commercial" class="evnt-hero__title">Commercial</NuxtLink>
          <h1 v-else class="evnt-hero__title">Commercial</h1>
          <p v-if="activeCategory" class="evnt-hero__subtitle">{{ activeCategory.label }}</p>
        </div>
        <p v-if="!activeCategory" class="evnt-hero__desc">
          Nous concevons des contenus sur-mesure pour donner à votre marque une présence
          visuelle forte et cohérente. Du produit au portrait, chaque projet est pensé
          pour engager, convaincre et durer.
        </p>
      </div>
    </section>

    <!-- Vue sous-catégorie : liste de projets -->
    <div v-if="activeCategory" class="cat-list" data-nav-theme="light">
      <NuxtLink
        v-for="p in filteredProjects"
        :key="p.id"
        :to="`/projects/${p.id}`"
        class="cat-list__item"
      >
        <div class="cat-list__thumb">
          <img v-if="p.thumbnail" :src="p.thumbnail" :alt="p.title" class="cat-list__img" />
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
      </NuxtLink>
      <div v-if="!filteredProjects.length" class="empty-state">Aucun projet dans cette catégorie</div>
    </div>

    <!-- Vue overview : sections éditoriales -->
    <div v-else class="evnt-cats grid-bg" data-nav-theme="light">
      <section
        v-for="(cat, i) in categories"
        :key="cat.value"
        :class="['evnt-cat', i % 2 !== 0 && 'evnt-cat--reversed']"
      >
        <div class="evnt-cat__text">
          <h2 class="evnt-cat__title">{{ cat.label }}</h2>
          <p class="evnt-cat__desc">{{ cat.desc }}</p>
        </div>
        <NuxtLink :to="`/commercial?category=${cat.value}`" class="evnt-cat__media">
          <img
            v-if="getCategoryThumb(cat.value)"
            :src="getCategoryThumb(cat.value)!"
            :alt="cat.label"
            class="evnt-cat__img"
          />
          <div v-else class="evnt-cat__placeholder" />
        </NuxtLink>
      </section>
    </div>

  </div>
</template>
