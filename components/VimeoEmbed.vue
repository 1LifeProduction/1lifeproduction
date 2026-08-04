<script setup lang="ts">
/* Lecteur vidéo universel : accepte les URLs Vimeo ET YouTube.
   (Le nom du composant et le champ vimeo_url du JSON sont historiques —
   on peut y coller n'importe quel lien des deux plateformes.)
   Formats reconnus :
   - vimeo.com/123456789
   - youtube.com/watch?v=ID · youtu.be/ID · youtube.com/shorts/ID · youtube.com/embed/ID */
const props = defineProps<{
  url: string
  title?: string
}>()

const embedUrl = computed(() => {
  const vimeo = props.url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) {
    return `https://player.vimeo.com/video/${vimeo[1]}?badge=0&autopause=0&player_id=0&app_id=58479`
  }
  const youtube = props.url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  )
  if (youtube) {
    /* youtube-nocookie : pas de cookies de tracking tant qu'on ne lance pas la lecture */
    return `https://www.youtube-nocookie.com/embed/${youtube[1]}`
  }
  return null
})
</script>

<template>
  <div class="vimeo-embed">
    <iframe
      v-if="embedUrl"
      :src="embedUrl"
      :title="title ?? 'Vidéo'"
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
      referrerpolicy="strict-origin-when-cross-origin"
      loading="lazy"
      allowfullscreen
    ></iframe>
    <div v-else class="vimeo-embed__error">
      URL vidéo invalide (Vimeo ou YouTube attendu)
    </div>
  </div>
</template>
