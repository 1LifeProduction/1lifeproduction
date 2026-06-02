<script setup lang="ts">
import projectsData from '~/data/projects.json'
import heroImg from '~/assets/images/imgHeader.png'

const route = useRoute()

const categories = [
  {
    value: 'captations',
    label: 'Captations',
    desc: 'Nous capturons vos événements avec précision pour en retranscrire toute l\'énergie. Conférences, lancements, performances ou soirées : chaque moment est pensé pour être documenté avec justesse et impact.',
  },
  {
    value: 'afterfilms',
    label: 'Aftermovies',
    desc: 'Des images pensées pour prolonger l\'expérience au-delà de l\'événement. Nous réalisons des afterfilms immersifs qui retranscrivent l\'ambiance, l\'intensité et les temps forts avec un regard cinématographique.',
  },
  {
    value: 'reportages',
    label: 'Reportages',
    desc: 'Un format vivant et authentique pour raconter votre événement de l\'intérieur. Entre images de terrain, débats et interviews, nous construisons un récit fidèle à votre univers.',
  },
  {
    value: 'livestreams',
    label: 'Livestreams',
    desc: 'Diffusez vos événements en direct avec une qualité de production professionnelle. Nous assurons une diffusion sur les plateformes adaptées pour toucher votre audience en temps réel.',
  },
  {
    value: 'interviews',
    label: 'Interviews',
    desc: 'Interviews, témoignages, collaborateurs ou prises de parole : nous obtenons des formats sobres, dynamiques et engageants pour valoriser votre message auprès de votre public et ceux qui le portent.',
  },
]

const allProjects = projectsData.filter(p => p.section === 'evenementiel')

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
  title: '1LIFE PRODUCTION',
  meta: [
    { name: 'description',        content: 'Captations, aftermovies, reportages, livestreams et interviews. 1LIFE PRODUCTION capture l\'énergie de vos événements avec un regard cinématographique.' },
    { property: 'og:description', content: 'Captations, aftermovies, reportages, livestreams et interviews. 1LIFE PRODUCTION capture l\'énergie de vos événements avec un regard cinématographique.' },
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
          <NuxtLink v-if="activeCategory" to="/evenementiel" class="evnt-hero__title">Événementiel</NuxtLink>
          <h1 v-else class="evnt-hero__title">Événementiel</h1>
          <p v-if="activeCategory" class="evnt-hero__subtitle">{{ activeCategory.label }}</p>
        </div>
        <p v-if="!activeCategory" class="evnt-hero__desc" data-reveal style="--reveal-delay:250ms">
          Nous produisons des contenus live qui capturent l'essence de vos événements.
          De la mise en place à la diffusion, chaque projet est géré avec précision
          pour délivrer l'instant avec justesse et créer une expérience mémorable à travers l'image.
        </p>
      </div>
    </section>

    <!-- Vue sous-catégorie : liste de projets -->
    <div v-if="activeCategory" class="cat-list grid-bg" data-nav-theme="dark">
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
    </div>

    <!-- Vue overview : sections éditoriales -->
    <div v-else class="evnt-cats grid-bg" data-nav-theme="dark">
      <section
        v-for="(cat, i) in categories"
        :key="cat.value"
        :class="['evnt-cat', i % 2 !== 0 && 'evnt-cat--reversed']"
      >
        <div class="evnt-cat__text" :data-reveal="i % 2 !== 0 ? 'right' : 'left'">
          <h2 class="evnt-cat__title">{{ cat.label }}</h2>
          <p class="evnt-cat__desc">{{ cat.desc }}</p>
        </div>
        <NuxtLink :to="`/evenementiel?category=${cat.value}`" class="evnt-cat__media" :data-reveal="i % 2 !== 0 ? 'left' : 'right'" style="--reveal-delay:120ms">
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
