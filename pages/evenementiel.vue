<script setup lang="ts">
import projectsData from '~/data/projects.json'
import heroImg from '~/assets/images/imgHeader.png'

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

useHead({ title: 'Événementiel — 1LIFE PRODUCTION' })
</script>

<template>
  <div class="evnt-page">

    <!-- Hero -->
    <section class="evnt-hero">
      <img :src="heroImg" alt="" class="evnt-hero__img" aria-hidden="true" fetchpriority="high" />
      <div class="evnt-hero__overlay" aria-hidden="true"></div>
      <div class="evnt-hero__bottom">
        <h1 class="evnt-hero__title">Événementiel</h1>
        <p class="evnt-hero__desc">
          Nous produisons des contenus live qui capturent l'essence de vos événements.
          De la mise en place à la diffusion, chaque projet est géré avec précision
          pour délivrer l'instant avec justesse et créer une expérience mémorable à travers l'image.
        </p>
      </div>
    </section>

    <!-- Sections catégories alternées -->
    <div class="evnt-cats grid-bg">
      <section
        v-for="(cat, i) in categories"
        :key="cat.value"
        :class="['evnt-cat', i % 2 !== 0 && 'evnt-cat--reversed']"
      >
        <div class="evnt-cat__text">
          <h2 class="evnt-cat__title">{{ cat.label }}</h2>
          <p class="evnt-cat__desc">{{ cat.desc }}</p>
        </div>

        <NuxtLink :to="`/evenementiel?category=${cat.value}`" class="evnt-cat__media">
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
