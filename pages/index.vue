<script setup lang="ts">
import projectsData from '~/data/projects.json'
import heroImg from '~/assets/images/imgHeader.png'

const featured = projectsData.filter(p => p.featured)

const clients = [
  { name: 'Formula 1', slug: 'f1'      },
  { name: 'Nike',      slug: 'nike'    },
  { name: 'Spotify',   slug: 'spotify' },
  { name: 'Chanel',    slug: 'chanel'  },
]

/* Marquee : densifié puis dupliqué en deux moitiés identiques
   pour une boucle continue sans couture (animation -> -50%). */
const marqueeBase  = [...clients, ...clients, ...clients]
const marqueeLogos = [...marqueeBase, ...marqueeBase]

const titleRef    = ref<HTMLElement>()
const theaterRef  = ref<HTMLElement>()
const activeIndex = ref(0)

/* --step : distance de scroll (en viewports) pour passer au projet suivant.
   --tail : marge de scroll après le dernier projet avant que la section se
   détache. Contrainte de validité : tail >= 1 - step, sinon le dernier projet
   n'est jamais atteint tant que le stage est figé. Partagés avec le CSS. */
const STEP = 0.5
const TAIL = 0.8

/* Hauteur de viewport mesurée en JS et exposée via --vh.
   On verrouille la valeur (mise à jour seulement si la LARGEUR change), ce qui
   ignore les "resize" dus à la barre d'adresse mobile : ces resize changeaient
   la hauteur (vh) de la page pendant le scroll et masquaient parfois le footer.
   CSS et JS partagent ainsi la même base → le carrousel reste synchro au scroll. */
const vhUnit = ref(0)
let lastW = 0
function measureVh() {
  vhUnit.value = window.innerHeight
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
}
function onResize() {
  if (window.innerWidth === lastW) return
  lastW = window.innerWidth
  measureVh()
}

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

function updateIndex() {
  const el = theaterRef.value
  if (!el) return
  // getBoundingClientRect().top = position du haut de la section / viewport.
  // Indépendant de offsetParent (offsetTop pouvait être faussé selon les
  // ancêtres positionnés). scrolled = distance scrollée depuis le haut de section.
  const scrolled = -el.getBoundingClientRect().top
  if (scrolled < 0) { activeIndex.value = 0; return }
  const newIndex = Math.min(
    Math.floor(scrolled / ((vhUnit.value || window.innerHeight) * STEP)),
    featured.length - 1
  )
  if (newIndex !== activeIndex.value) {
    activeIndex.value = newIndex
  }
}

/* Throttle au frame : un seul recalcul par rendu, quel que soit le débit
   d'événements scroll (mobile en émet beaucoup). */
let scrollRaf = 0
function onScroll() {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = 0
    updateIndex()
  })
}

onMounted(() => {
  lastW = window.innerWidth
  measureVh()
  updateIndex()
  document.fonts.ready.then(() => {
    fitTitle()
    ro = new ResizeObserver(() => requestAnimationFrame(fitTitle))
    ro.observe(document.documentElement)
  })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('orientationchange', measureVh)
})

onUnmounted(() => {
  ro?.disconnect()
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('orientationchange', measureVh)
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
      :style="{ '--project-count': featured.length, '--step': STEP, '--tail': TAIL }"
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

    <!--
      BANDEAU MARQUES — marquee en défilement continu.
      TODO data : alimenté ici par les 4 logos clients existants (placeholder).
      Pour brancher sur les marques des réalisations, voir liste finale.
    -->
    <section class="brand-marquee" aria-label="Marques" data-nav-theme="dark">
      <div class="brand-marquee__track">
        <img
          v-for="(c, i) in marqueeLogos"
          :key="`mq-${i}`"
          :src="`/clients/${c.slug}.png`"
          :alt="c.name"
          class="brand-marquee__logo"
          aria-hidden="true"
        />
      </div>
    </section>

  </div>
</template>
