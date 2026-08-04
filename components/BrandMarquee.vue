<script setup lang="ts">
/* Bandeau de marques — défilement continu PARFAITEMENT bouclé.

   Logos = content/clients.json (le client les édite/ajoute lui-même).

   Boucle : pilotée en JS (rAF) qui translate la piste en PIXELS et "wrappe"
   exactement de la largeur d'UN groupe (mesurée). Les 2 groupes étant identiques,
   le wrap est invisible → boucle parfaite sans saut, sur tous les appareils.
   (Même principe que GSAP horizontalLoop, sans la dépendance.) */

import clients from '~/content/clients.json'

const SPEED = 50 // px/s — vitesse constante quelle que soit la largeur d'écran

const trackRef   = ref<HTMLElement>()
const sectionRef = ref<HTMLElement>()
const isMobile   = ref(false)

/* Densité vs perf GPU :
   - desktop : on répète la liste (×3) pour bien remplir la largeur ;
   - mobile  : une seule passe → piste courte = couche GPU sous la limite de
     texture des mobiles (sinon le bandeau "coupe"/disparaît).
   Le rAF mesure la largeur réelle, donc le défilement reste exact quel que soit
   le nombre de logos. */
const reps  = computed(() => (isMobile.value ? 1 : 3))
const group = computed(() => Array.from({ length: reps.value }).flatMap(() => clients))

let raf = 0, offset = 0, setWidth = 0, lastTs = 0
let paused = false, visible = true, reduced = false

function measure() {
  const el = trackRef.value
  if (el) setWidth = el.scrollWidth / 2
}

function frame(ts: number) {
  if (!lastTs) lastTs = ts
  const dt = (ts - lastTs) / 1000
  lastTs = ts
  if (!paused && visible && !reduced && setWidth > 0) {
    offset -= SPEED * dt
    while (offset <= -setWidth) offset += setWidth // wrap exact (invisible)
    if (trackRef.value) trackRef.value.style.transform = `translateX(${offset}px)`
  }
  raf = requestAnimationFrame(frame)
}

let ro: ResizeObserver | null = null
let io: IntersectionObserver | null = null
let mq: MediaQueryList | undefined
function onMq(e: MediaQueryListEvent | MediaQueryList) {
  isMobile.value = e.matches
  nextTick(measure)
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  mq = window.matchMedia('(max-width: 767px)')
  isMobile.value = mq.matches
  mq.addEventListener('change', onMq)
  measure()
  // La largeur change quand logos/police chargent, ou quand reps change → re-mesure.
  ro = new ResizeObserver(measure)
  if (trackRef.value) ro.observe(trackRef.value)
  if (document.fonts?.ready) document.fonts.ready.then(measure)
  // Pause le défilement hors écran (pas de rAF qui tourne pour rien).
  io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { rootMargin: '50px' })
  if (sectionRef.value) io.observe(sectionRef.value)
  raf = requestAnimationFrame(frame)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
  io?.disconnect()
  mq?.removeEventListener('change', onMq)
})
</script>

<template>
  <section
    ref="sectionRef"
    class="brand-marquee"
    aria-label="Marques"
    data-nav-theme="dark"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
  >
    <div ref="trackRef" class="brand-marquee__track">
      <!-- 2 groupes IDENTIQUES : la boucle wrappe exactement d'un groupe -->
      <div class="brand-marquee__group">
        <img
          v-for="(c, i) in group"
          :key="`a-${i}`"
          :src="`/clients/${c.logo}`"
          :alt="c.nom"
          class="brand-marquee__logo"
          aria-hidden="true"
          loading="lazy"
        />
      </div>
      <div class="brand-marquee__group" aria-hidden="true">
        <img
          v-for="(c, i) in group"
          :key="`b-${i}`"
          :src="`/clients/${c.logo}`"
          :alt="c.nom"
          class="brand-marquee__logo"
          aria-hidden="true"
          loading="lazy"
        />
      </div>
    </div>
  </section>
</template>
