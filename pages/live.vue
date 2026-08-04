<script setup lang="ts">
import { getGroup } from '~/data/categories'

const seo = getGroup('live')!.seo
useHead({
  title: seo.titre,
  meta: [
    { name: 'description',        content: seo.description },
    { property: 'og:title',       content: seo.titre },
    { property: 'og:description', content: seo.description },
  ],
})
</script>

<template>
  <CategoryPage section="live" />
</template>
