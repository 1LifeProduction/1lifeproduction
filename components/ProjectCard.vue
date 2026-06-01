<script setup lang="ts">
defineProps<{
  id:        string
  title:     string
  category:  string
  year:      number
  thumbnail: string
}>()
</script>

<template>
  <NuxtLink :to="`/projects/${id}`" class="project-card">
    <img :src="thumbnail" :alt="title" class="project-card__img" loading="lazy" />
    <div class="project-card__overlay">
      <span class="project-card__cat">{{ category }}</span>
      <h3 class="project-card__title">{{ title }}</h3>
    </div>
  </NuxtLink>
</template>
