<script setup lang="ts">
/* Diaporama automatique d'une série photo (visuel de chapitre d'un projet
   photo). Fondu enchaîné toutes les `interval` ms ; ne tourne que lorsqu'il
   est visible à l'écran et pas si l'utilisateur préfère réduire les
   animations (la 1re photo reste affichée). */
const props = withDefaults(defineProps<{
  photos: string[]
  alt: string
  interval?: number
}>(), { interval: 3200 })

const active = ref(0)
const root = ref<HTMLElement>()
let timer = 0
let io: IntersectionObserver | null = null

function start() {
  stop()
  if (props.photos.length < 2) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = window.setInterval(() => {
    active.value = (active.value + 1) % props.photos.length
  }, props.interval)
}
function stop() { if (timer) { clearInterval(timer); timer = 0 } }

onMounted(() => {
  io = new IntersectionObserver(([e]) => { e.isIntersecting ? start() : stop() }, { rootMargin: '50px' })
  if (root.value) io.observe(root.value)
})
onUnmounted(() => { stop(); io?.disconnect() })
</script>

<template>
  <span ref="root" class="xp-slideshow" aria-hidden="true">
    <img
      v-for="(src, i) in photos"
      :key="src"
      :src="src"
      :alt="i === 0 ? alt : ''"
      :class="['xp-slideshow__img', { 'is-active': i === active }]"
      :loading="i === 0 ? undefined : 'lazy'"
    />
  </span>
</template>
