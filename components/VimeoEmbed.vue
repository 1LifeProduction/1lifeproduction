<script setup lang="ts">
const props = defineProps<{
  url: string
  title?: string
}>()

const videoId = computed(() => {
  const match = props.url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
})

const embedUrl = computed(() =>
  videoId.value
    ? `https://player.vimeo.com/video/${videoId.value}?badge=0&autopause=0&player_id=0&app_id=58479`
    : null
)
</script>

<template>
  <div class="vimeo-embed">
    <iframe
      v-if="embedUrl"
      :src="embedUrl"
      :title="title ?? 'Vidéo Vimeo'"
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
      referrerpolicy="strict-origin-when-cross-origin"
      loading="lazy"
    ></iframe>
    <div v-else class="vimeo-embed__error">
      URL Vimeo invalide
    </div>
  </div>
</template>
