<script setup lang="ts">
import { getGroup } from '~/data/categories'

const seo = getGroup('marque')!.seo
useHead({
  title: seo.titre,
  meta: [
    { name: 'description',        content: seo.description },
    { property: 'og:description', content: seo.description },
  ],
})
</script>

<template>
  <CategoryPage section="marque" />
</template>
