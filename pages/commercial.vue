<script setup lang="ts">
import projectsData from '~/data/projects.json'

const route = useRoute()

const categories = [
  { value: 'tous',       label: 'Tous' },
  { value: 'produits',   label: 'Produits' },
  { value: 'films',      label: 'Films' },
  { value: 'publicites', label: 'Publicités' },
  { value: 'podcasts',   label: 'Podcasts' },
  { value: 'portraits',  label: 'Portraits' },
]

const activeCategory = ref(
  (route.query.category as string) || 'tous'
)

watch(() => route.query.category, val => {
  activeCategory.value = (val as string) || 'tous'
})

const allProjects = projectsData.filter(p => p.section === 'commercial')

const filtered = computed(() =>
  activeCategory.value === 'tous'
    ? allProjects
    : allProjects.filter(p => p.category === activeCategory.value)
)

function setCategory(val: string) {
  activeCategory.value = val
  const query = val === 'tous' ? {} : { category: val }
  navigateTo({ path: '/commercial', query }, { replace: true })
}

useHead({ title: 'Commercial — 1LIFE PRODUCTION' })
</script>

<template>
  <div class="section-page">
    <!-- Hero -->
    <div class="page-hero grid-bg">
      <div class="container">
        <p class="page-hero__eyebrow">1Life Production</p>
        <h1 class="page-hero__title">Commercial</h1>
        <p class="page-hero__desc">
          Spots produit, films d'entreprise, publicités, podcasts et portraits —
          la vidéo au service de votre image de marque.
        </p>
      </div>
    </div>
  </div>
</template>
