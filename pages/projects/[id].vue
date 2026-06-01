<script setup lang="ts">
import projectsData from '~/data/projects.json'

const route = useRoute()
const id = route.params.id as string

const project = projectsData.find(p => p.id === id)

if (!project) {
  throw createError({ statusCode: 404, statusMessage: 'Projet introuvable' })
}

const backPath = project.section === 'evenementiel' ? '/evenementiel' : '/commercial'
const backLabel = project.section === 'evenementiel' ? 'Événementiel' : 'Commercial'

const sectionLabel = project.section === 'evenementiel' ? 'Événementiel' : 'Commercial'

const categoryLabels: Record<string, string> = {
  captations:  'Captations',
  afterfilms:  'Afterfilms',
  reportages:  'Reportages',
  livestreams: 'Livestreams',
  interviews:  'Interviews',
  produits:    'Produits',
  films:       'Films',
  publicites:  'Publicités',
  podcasts:    'Podcasts',
  portraits:   'Portraits',
}

useHead({ title: `${project.title} — 1LIFE PRODUCTION` })
</script>

<template>
  <div class="project-page">
    <div class="project-page__embed">
      <VimeoEmbed :url="project.vimeo_url" :title="project.title" />
    </div>

    <div class="project-page__content">
      <NuxtLink :to="backPath" class="project-page__back">
        {{ backLabel }}
      </NuxtLink>

      <h1 class="project-page__title">{{ project.title }}</h1>

      <dl class="project-page__meta">
        <div class="project-page__meta-item">
          <dt class="project-page__meta-label">Section</dt>
          <dd class="project-page__meta-value">{{ sectionLabel }}</dd>
        </div>
        <div class="project-page__meta-item">
          <dt class="project-page__meta-label">Catégorie</dt>
          <dd class="project-page__meta-value">{{ categoryLabels[project.category] ?? project.category }}</dd>
        </div>
        <div class="project-page__meta-item">
          <dt class="project-page__meta-label">Année</dt>
          <dd class="project-page__meta-value">{{ project.year }}</dd>
        </div>
        <div v-if="project.client" class="project-page__meta-item">
          <dt class="project-page__meta-label">Client</dt>
          <dd class="project-page__meta-value">{{ project.client }}</dd>
        </div>
      </dl>

      <p class="project-page__desc">{{ project.description }}</p>

      <div v-if="project.tags?.length" class="project-page__tags">
        <span v-for="tag in project.tags" :key="tag" class="project-page__tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>
