<script setup lang="ts">
/* Vidéo d'habillage « progressive » : une version LÉGÈRE (src) démarre tout
   de suite ; une version HAUTE QUALITÉ (hq) se charge en arrière-plan et,
   une fois suffisamment mise en mémoire tampon, remplace la légère en fondu
   à la même position de lecture. Il y a donc toujours une vidéo à l'écran,
   puis la belle.

   La HQ n'est chargée que sur les écrans ≥ 1024 px, hors mode « économie de
   données » et hors « réduire les animations » : sur mobile, la légère suffit
   et on épargne le forfait. Si la HQ manque (404) ou échoue, la légère reste.

   Rendu : deux <video> SUPERPOSÉS, qui reçoivent tous deux la classe passée
   au composant (elle doit les positionner en absolu, ex. .home-hero__img ou
   .evnt-hero__img) — la HQ au-dessus, transparente tant qu'elle n'est pas
   prête. */
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  src: string
  hq?: string
  poster?: string
}>()

const attrs = useAttrs()
const lq = ref<HTMLVideoElement>()
const hqEl = ref<HTMLVideoElement>()
const hqSrc   = ref('')     // posé côté client seulement → pas de téléchargement avant décision
const hqShown = ref(false)  // HQ visible (fondu)
const lqGone  = ref(false)  // légère retirée du DOM après le fondu

const MIN_BUFFER_S = 8      // secondes d'avance mises en tampon avant de basculer

let swapped = false
let swapTimer = 0

function bufferedAhead(v: HTMLVideoElement): number {
  for (let i = 0; i < v.buffered.length; i++) {
    if (v.buffered.start(i) <= v.currentTime && v.currentTime <= v.buffered.end(i)) {
      return v.buffered.end(i) - v.currentTime
    }
  }
  return 0
}

function trySwap() {
  const h = hqEl.value, l = lq.value
  if (!h || !l || swapped) return
  const enough = bufferedAhead(h) >= MIN_BUFFER_S || (h.duration && h.buffered.length && h.buffered.end(h.buffered.length - 1) >= h.duration - 0.5)
  if (h.readyState < 3 || !enough) return
  swapped = true
  // Même instant de lecture (modulo la durée : les deux bouclent)
  try { h.currentTime = l.currentTime % (h.duration || Infinity) } catch {}
  h.play().then(() => {
    hqShown.value = true
    swapTimer = window.setTimeout(() => { l.pause(); lqGone.value = true }, 700)
  }).catch(() => { swapped = false })
}

onMounted(() => {
  if (!props.hq) return
  const conn = (navigator as any).connection
  if (conn?.saveData) return
  if (window.innerWidth < 1024) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  hqSrc.value = props.hq
  nextTick(() => {
    const h = hqEl.value
    if (!h) return
    h.addEventListener('progress', trySwap)
    h.addEventListener('canplaythrough', trySwap)
    h.addEventListener('loadeddata', trySwap)
    h.load()
  })
})
onUnmounted(() => { if (swapTimer) clearTimeout(swapTimer) })
</script>

<template>
  <video
    v-if="!lqGone"
    ref="lq"
    :class="attrs.class"
    :src="src"
    :poster="poster"
    autoplay muted loop playsinline preload="metadata"
    aria-hidden="true"
  ></video>
  <video
    v-if="hqSrc"
    ref="hqEl"
    :class="[attrs.class, 'pv-hq', { 'is-shown': hqShown }]"
    :src="hqSrc"
    muted loop playsinline preload="auto"
    aria-hidden="true"
  ></video>
</template>

<style>
/* Fondu d'apparition de la HQ par-dessus la légère */
.pv-hq { opacity: 0; transition: opacity 0.7s ease; }
.pv-hq.is-shown { opacity: 1; }
</style>
