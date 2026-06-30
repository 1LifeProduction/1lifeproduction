<script setup lang="ts">
import projectsData from '~/data/projects.json'
import heroImg from '~/assets/images/imgHeader.png'

const featured = projectsData.filter(p => p.featured)

const titleRef    = ref<HTMLElement>()
const theaterRef  = ref<HTMLElement>()
const activeIndex = ref(0)

/* STEP_VH : distance de scroll (par projet) du carrousel "théâtre" piloté au
   scroll sur DESKTOP. Sur mobile le scroll-jack est désactivé (trop fragile)
   au profit d'un défilement automatique — voir applyMode(). */
const STEP    = 0.5
const STEP_VH = STEP * 100

const isDesktop = ref(true)

/* Chemin du showreel (binding dynamique pour ne pas être résolu au build :
   le fichier public/showreel.mp4 peut être absent, le poster prend le relais). */
const showreelSrc = '/showreel.mp4'

function fitTitle() {
  const el = titleRef.value
  if (!el) return
  el.style.fontSize = '10px'
  el.style.display = 'inline-block'
  const textWidth = el.scrollWidth
  el.style.display = 'block'
  if (!textWidth) return
  el.style.fontSize = `${(window.innerWidth / textWidth) * 10}px`
}

let ro: ResizeObserver | null = null

/* DESKTOP — carrousel piloté au scroll (stage figé en sticky). */
function updateIndex() {
  const el = theaterRef.value
  if (!el) return
  const scrolled = window.scrollY - el.offsetTop
  if (scrolled < 0) { activeIndex.value = 0; return }
  const newIndex = Math.min(
    Math.floor(scrolled / (window.innerHeight * STEP)),
    featured.length - 1
  )
  if (newIndex !== activeIndex.value) activeIndex.value = newIndex
}

/* Throttle au frame : un seul recalcul par rendu d'écran. */
let scrollRaf = 0
function onScroll() {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(() => { scrollRaf = 0; updateIndex() })
}

/* MOBILE — défilement automatique (le scroll-jack est désactivé). */
let autoTimer = 0
function startAuto() {
  stopAuto()
  autoTimer = window.setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % featured.length
  }, 4000)
}
function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = 0 } }

/* Bascule du mode selon le breakpoint (768px), comme la page À propos. */
function applyMode() {
  if (isDesktop.value) {
    stopAuto()
    window.addEventListener('scroll', onScroll, { passive: true })
    updateIndex()
  } else {
    window.removeEventListener('scroll', onScroll)
    activeIndex.value = 0
    startAuto()
  }
}

let mq: MediaQueryList | undefined
function onMq(e: MediaQueryListEvent | MediaQueryList) {
  isDesktop.value = e.matches
  applyMode()
}

onMounted(() => {
  mq = window.matchMedia('(min-width: 768px)')
  isDesktop.value = mq.matches
  mq.addEventListener('change', onMq)
  applyMode()
  document.fonts.ready.then(() => {
    fitTitle()
    ro = new ResizeObserver(() => requestAnimationFrame(fitTitle))
    ro.observe(document.documentElement)
  })
})

onUnmounted(() => {
  ro?.disconnect()
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  stopAuto()
  window.removeEventListener('scroll', onScroll)
  mq?.removeEventListener('change', onMq)
})

useHead({
  title: '1LIFE PRODUCTION',
  meta: [
    { name: 'description',        content: 'Collectif créatif parisien spécialisé dans la production audiovisuelle. Photographes, vidéastes, motion designers, dronistes FPV et experts VFX.' },
    { property: 'og:description', content: 'Collectif créatif parisien spécialisé dans la production audiovisuelle. Photographes, vidéastes, motion designers, dronistes FPV et experts VFX.' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: '1LIFE PRODUCTION',
        url: 'https://1lifeproduction.com',
        logo: 'https://1lifeproduction.com/favicon.png',
        contactPoint: {
          '@type': 'ContactPoint',
          email: '1lifeprod@unlockcollectif.com',
          contactType: 'customer service',
          availableLanguage: 'French',
        },
        sameAs: [
          'https://instagram.com/1lifeproduction',
          'https://www.linkedin.com/company/1life-production/',
        ],
      }),
    },
  ],
})
</script>

<template>
  <div class="home grid-bg">

    <section class="home-hero" aria-label="Accueil">
      <!--
        SHOWREEL — boucle vidéo d'habillage.
        Déposer le fichier dans public/showreel.mp4 (option par défaut).
        Tant que le fichier est absent, le poster (image hero) s'affiche.
        Pour changer le contenu : remplacer public/showreel.mp4
        (ou modifier le chemin du <source> ci-dessous).
      -->
      <video
        class="home-hero__img home-hero__video"
        :poster="heroImg"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        aria-hidden="true"
      >
        <source :src="showreelSrc" type="video/mp4" />
      </video>
      <div class="home-hero__overlay" aria-hidden="true"></div>
      <div class="home-hero__content">
        <div class="home-hero__sub" data-reveal="fade" style="--reveal-delay:100ms">
          <p class="home-hero__baseline">PRODUCTION AGENCY</p>
        </div>
        <h1 ref="titleRef" class="home-hero__title" data-reveal style="--reveal-delay:250ms">1LIFE PRODUCTION</h1>
      </div>
    </section>

    <!-- Section theater : haute de n×100vh, stage sticky -->
    <section
      ref="theaterRef"
      class="projects-theater"
      :style="{ '--project-count': featured.length, '--step-vh': `${STEP_VH}vh` }"
      aria-label="Projets mis en avant"
    >
      <!-- Blobs flottants — hors du stage pour déborder sur la section suivante -->
      <div class="projects-grid__blobs" aria-hidden="true">
        <div class="blob blob--1"></div>
        <div class="blob blob--2"></div>
      </div>

      <div class="projects-theater__stage">

        <!-- Bloc fixe : images stackées en crossfade -->
        <div class="project-card projects-theater__card">
          <img
            v-for="(p, i) in featured"
            :key="p.id"
            :src="p.thumbnail"
            :alt="p.title"
            :class="['theater__img', { 'is-active': i === activeIndex }]"
          />
          <div class="project-card__overlay">
            <Transition name="theater-text" mode="out-in">
              <div :key="activeIndex" class="theater__text">
                <span class="project-card__cat">{{ featured[activeIndex].category }}</span>
                <h3 class="project-card__title">{{ featured[activeIndex].title }}</h3>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Indicateur de progression -->
        <div class="projects-theater__dots" aria-hidden="true">
          <span
            v-for="(_, i) in featured"
            :key="i"
            :class="['projects-theater__dot', { 'is-active': i === activeIndex }]"
          />
        </div>

      </div>
    </section>

    <section class="clients-section" aria-label="Nos clients">
      <div class="container">
        <h2 class="clients-section__label" data-reveal data-fit-text>ILS NOUS FONT CONFIANCE</h2>
      </div>
    </section>

    <!-- Bandeau marques — défilement continu (composant à boucle JS parfaite) -->
    <BrandMarquee />

  </div>
</template>
