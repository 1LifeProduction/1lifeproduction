<script setup lang="ts">
/* Bandeau de marques — défilement continu PARFAITEMENT bouclé.

   Pourquoi pas l'animation CSS `translateX(-50%)` : le `-50%` est un pourcentage
   que le navigateur arrondit (sub-pixel), et le redémarrage de keyframe provoque
   une re-rastérisation → "saut" visible au bouclage (surtout sur iOS).

   Ici : boucle en JS (rAF) qui translate la piste en PIXELS et "wrappe" exactement
   de la largeur d'UNE copie (mesurée). Comme la piste contient 2 copies identiques,
   le wrap est invisible → boucle parfaite, sans saut, sur tous les appareils.
   C'est la même approche que GSAP horizontalLoop, sans la dépendance. */

const clients = [
  { name: 'Formula 1', slug: 'f1'      },
  { name: 'Nike',      slug: 'nike'    },
  { name: 'Spotify',   slug: 'spotify' },
  { name: 'Chanel',    slug: 'chanel'  },
]

// Liste densifiée puis dupliquée → 2 copies identiques.
// (Sur mobile, le CSS masque les logos au-delà du 8e → piste courte = couche GPU
//  sous la limite de texture ; setWidth est mesuré, donc le wrap reste exact.)
const baseLogos = [...clients, ...clients, ...clients]
const logos     = [...baseLogos, ...baseLogos]

const SPEED = 50 // px/s — vitesse constante quelle que soit la largeur d'écran

const trackRef = ref<HTMLElement>()
let raf = 0
let offset = 0
let setWidth = 0   // largeur d'UNE copie = largeur visible de piste / 2
let lastTs = 0
let paused = false   // survol (hover)
let visible = true   // dans le viewport (IntersectionObserver)
let reduced = false

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
    if (offset <= -setWidth) offset += setWidth // wrap exact (invisible)
    if (trackRef.value) trackRef.value.style.transform = `translateX(${offset}px)`
  }
  raf = requestAnimationFrame(frame)
}

let ro: ResizeObserver | null = null
let io: IntersectionObserver | null = null
const sectionRef = ref<HTMLElement>()

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  measure()
  // La largeur change quand logos/police finissent de charger → re-mesure.
  ro = new ResizeObserver(measure)
  if (trackRef.value) ro.observe(trackRef.value)
  if (document.fonts?.ready) document.fonts.ready.then(measure)
  // Pause le défilement quand le bandeau est hors écran (évite de faire tourner
  // le rAF en continu pour rien sur mobile).
  io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { rootMargin: '50px' })
  if (sectionRef.value) io.observe(sectionRef.value)
  raf = requestAnimationFrame(frame)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
  io?.disconnect()
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
      <img
        v-for="(c, i) in logos"
        :key="`mq-${i}`"
        :src="`/clients/${c.slug}.png`"
        :alt="c.name"
        class="brand-marquee__logo"
        aria-hidden="true"
      />
    </div>
  </section>
</template>
