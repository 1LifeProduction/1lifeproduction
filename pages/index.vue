<script setup lang="ts">
import projectsData from '~/data/projects.json'
import heroImg from '~/assets/images/imgHeader.png'
import home from '~/content/home.json'
import globalContent from '~/content/global.json'
import { CATEGORIES, categoryHref, getSubCategory, type Section } from '~/data/categories'

const featured = projectsData.filter(p => p.featured)

/* Lignes du grand titre (séparées par \n dans content/home.json) */
const heroTitleLines = home.hero.titre.split('\n')

/* Libellé d'une catégorie (source de vérité : content/categories.json) */
const labelOf = (section: Section) => CATEGORIES.find(g => g.section === section)?.label ?? section

const xpCards = home.expertises.cards

const titleRef    = ref<HTMLElement>()
const theaterRef  = ref<HTMLElement>()
const activeIndex = ref(0)

/* Lien du projet affiché : renvoie vers sa page catégorie (ex. /evenementiel?category=captations). */
const activeHref = computed(() =>
  categoryHref(featured[activeIndex.value].section as Section, featured[activeIndex.value].category),
)

/* STEP_VH : distance de scroll (par projet) du carrousel "théâtre" piloté au
   scroll de page — même mécanique sur desktop ET mobile (stage sticky, la
   slide change au fil du défilement vertical). */
/* 0.8 (80vh par slide) : à 0.5 la slide du milieu défilait trop vite — elle
   n'a ni l'approche de la section (1re slide) ni la queue de 90vh (dernière). */
const STEP    = 0.8
const STEP_VH = STEP * 100

/* Showreel : tant que public/showreel.mp4 est absent, on n'affiche PAS de
   <video> (sinon iOS pose un bouton play par-dessus le poster) — on montre le
   poster en <img>. On sonde le fichier (HEAD) et on bascule en vidéo seulement
   s'il existe vraiment. */
const showreelSrc   = '/showreel.mp4'      // version légère (720p) : démarre tout de suite
const showreelHqSrc = '/showreel-hq.mp4'   // version 1080p : chargée en fond, remplace la légère (ProgressiveVideo)
const hasVideo = ref(false)

/* Vidéos d'illustration des cards expertises Live & Documentaire.
   Déposer les fichiers dans public/videos/ : expertise-live.mp4 et
   expertise-documentaire.mp4. Tant qu'un fichier est absent, la card
   affiche un emplacement vide (placeholder). Même sonde HEAD que le
   showreel pour éviter le bouton play iOS sur une <video> sans source. */
const XP_VIDEOS = {
  live:         '/videos/expertise-live.mp4',
  documentaire: '/videos/expertise-documentaire.mp4',
} as const
const hasXpVideo = reactive<Record<keyof typeof XP_VIDEOS, boolean>>({
  live:         false,
  documentaire: false,
})

/* Marge de sécurité du fit-text : à 1.0 le titre touchait les bords et la
   ponctuation se faisait rogner à droite (arrondis de mesure). */
const TITLE_FIT = 0.94

function fitTitle() {
  const el = titleRef.value
  if (!el) return
  // Viewport pas encore mesurable (onglet caché/0px) : ne pas figer une
  // taille nulle — le ResizeObserver rappellera fitTitle au prochain layout.
  if (!window.innerWidth) return
  el.style.fontSize = '10px'
  el.style.display = 'inline-block'
  const textWidth = el.scrollWidth
  el.style.display = 'block'
  if (!textWidth) return
  el.style.fontSize = `${(window.innerWidth / textWidth) * 10 * TITLE_FIT}px`
}

let ro: ResizeObserver | null = null

/* Carrousel piloté au scroll (stage figé en sticky). */
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

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  updateIndex()
  document.fonts.ready.then(() => {
    fitTitle()
    ro = new ResizeObserver(() => requestAnimationFrame(fitTitle))
    ro.observe(document.documentElement)
  })
  // Sonde le showreel : on n'affiche la <video> que s'il existe (sinon poster img).
  fetch(showreelSrc, { method: 'HEAD' })
    .then(r => { hasVideo.value = r.ok })
    .catch(() => { hasVideo.value = false })
  // Sonde les vidéos des cards expertises (Live & Documentaire).
  for (const key of Object.keys(XP_VIDEOS) as (keyof typeof XP_VIDEOS)[]) {
    fetch(XP_VIDEOS[key], { method: 'HEAD' })
      .then(r => { hasXpVideo[key] = r.ok })
      .catch(() => { hasXpVideo[key] = false })
  }
})

onUnmounted(() => {
  ro?.disconnect()
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  window.removeEventListener('scroll', onScroll)
})

useHead({
  title: home.seo.titre,
  meta: [
    { name: 'description',        content: home.seo.description },
    { property: 'og:title',       content: home.seo.titre },
    { property: 'og:description', content: home.seo.description },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: '1LIFE PRODUCTION',
        description: 'Studio de production audiovisuelle basé à Paris, spécialisé dans le live, le documentaire, les films de marque et les contenus événementiels.',
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
      <ProgressiveVideo
        v-if="hasVideo"
        class="home-hero__img home-hero__video"
        :src="showreelSrc"
        :hq="showreelHqSrc"
        :poster="heroImg"
      />
      <img v-else class="home-hero__img" :src="heroImg" alt="" aria-hidden="true" />
      <div class="home-hero__overlay" aria-hidden="true"></div>
      <div class="home-hero__content">
        <div class="home-hero__sub" data-reveal="fade" style="--reveal-delay:100ms">
          <p class="home-hero__baseline">{{ home.hero.baseline }}</p>
        </div>
        <h1 ref="titleRef" class="home-hero__title" data-reveal style="--reveal-delay:250ms">
          <template v-for="(line, i) in heroTitleLines" :key="i">
            <br v-if="i > 0">{{ line }}
          </template>
        </h1>
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

        <!-- Bloc fixe : images stackées en crossfade — cliquable vers la catégorie -->
        <NuxtLink
          :to="activeHref"
          class="project-card projects-theater__card"
          :aria-label="`Voir ${featured[activeIndex].title}`"
        >
          <!-- Seule la 1re slide charge tout de suite (visible en premier) ;
               les autres attendent — le carrousel est sous la ligne de flottaison. -->
          <img
            v-for="(p, i) in featured"
            :key="p.id"
            :src="p.thumbnail"
            :alt="p.title"
            :loading="i === 0 ? undefined : 'lazy'"
            :class="['theater__img', { 'is-active': i === activeIndex }]"
          />
          <div class="project-card__overlay">
            <Transition name="theater-text" mode="out-in">
              <div :key="activeIndex" class="theater__text">
                <span class="project-card__cat">{{ getSubCategory(featured[activeIndex].category)?.label ?? featured[activeIndex].category }}</span>
                <h3 class="project-card__title">{{ featured[activeIndex].title }}</h3>
              </div>
            </Transition>
          </div>
        </NuxtLink>

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

    <!-- Description du studio -->
    <section class="home-intro" aria-label="Le studio" data-nav-theme="dark">
      <p class="xp-eyebrow" data-reveal>{{ home.intro.eyebrow }}</p>
      <h2 class="home-intro__title" data-reveal style="--reveal-delay:80ms">{{ home.intro.titre }}</h2>
      <div class="home-intro__text" data-reveal style="--reveal-delay:160ms">
        <p v-for="(p, i) in home.intro.paragraphes" :key="i" v-html="boldify(p)"></p>
      </div>
    </section>

    <!-- Expertises -->
    <section class="home-xp" aria-label="Nos expertises" data-nav-theme="dark">
      <p class="xp-eyebrow" data-reveal>{{ home.expertises.eyebrow }}</p>
      <h2 class="home-xp__title" data-reveal style="--reveal-delay:80ms">{{ home.expertises.titre }}</h2>

      <div class="home-xp__grid">
        <NuxtLink to="/live" class="home-xp__card home-xp__card--big" data-reveal style="--reveal-delay:120ms">
          <span class="home-xp__media">
            <!-- poster : miniature affichée pendant le chargement de la boucle.
                 Déposer public/videos/expertise-live-poster.jpg (absente = ignorée).
                 :poster dynamique — un poster statique vers un fichier pas encore
                 livré fait échouer la résolution d'assets de Vite au build. -->
            <video
              v-if="hasXpVideo.live"
              :src="XP_VIDEOS.live"
              :poster="'/videos/expertise-live-poster.jpg'"
              class="home-xp__video"
              autoplay muted loop playsinline preload="metadata"
              aria-hidden="true"
            ></video>
            <span v-else class="home-xp__media-placeholder" aria-hidden="true"></span>
          </span>
          <span class="home-xp__tag">{{ xpCards.live.tag }}</span>
          <span class="home-xp__name">{{ labelOf('live') }}</span>
          <span class="home-xp__desc">{{ xpCards.live.description }}</span>
          <span class="home-xp__arrow">{{ home.expertises.bouton }}</span>
        </NuxtLink>
        <NuxtLink to="/documentaire" class="home-xp__card home-xp__card--big" data-reveal style="--reveal-delay:200ms">
          <span class="home-xp__media">
            <!-- poster : déposer public/videos/expertise-documentaire-poster.jpg
                 (:poster dynamique, même raison que la card Live) -->
            <video
              v-if="hasXpVideo.documentaire"
              :src="XP_VIDEOS.documentaire"
              :poster="'/videos/expertise-documentaire-poster.jpg'"
              class="home-xp__video"
              autoplay muted loop playsinline preload="metadata"
              aria-hidden="true"
            ></video>
            <span v-else class="home-xp__media-placeholder" aria-hidden="true"></span>
          </span>
          <span class="home-xp__tag">{{ xpCards.documentaire.tag }}</span>
          <span class="home-xp__name">{{ labelOf('documentaire') }}</span>
          <span class="home-xp__desc">{{ xpCards.documentaire.description }}</span>
          <span class="home-xp__arrow">{{ home.expertises.bouton }}</span>
        </NuxtLink>
      </div>

      <p class="xp-eyebrow home-xp__second-eyebrow" data-reveal>{{ home.expertises.sousEyebrow }}</p>
      <div class="home-xp__grid">
        <NuxtLink to="/marque" class="home-xp__card" data-reveal style="--reveal-delay:120ms">
          <span class="home-xp__tag">{{ xpCards.marque.tag }}</span>
          <span class="home-xp__name">{{ labelOf('marque') }}</span>
          <span class="home-xp__desc">{{ xpCards.marque.description }}</span>
          <span class="home-xp__arrow">{{ home.expertises.bouton }}</span>
        </NuxtLink>
        <NuxtLink to="/evenementiel" class="home-xp__card" data-reveal style="--reveal-delay:200ms">
          <span class="home-xp__tag">{{ xpCards.evenementiel.tag }}</span>
          <span class="home-xp__name">{{ labelOf('evenementiel') }}</span>
          <span class="home-xp__desc">{{ xpCards.evenementiel.description }}</span>
          <span class="home-xp__arrow">{{ home.expertises.bouton }}</span>
        </NuxtLink>
      </div>
    </section>

    <section class="clients-section" aria-label="Nos clients">
      <div class="container">
        <h2 class="clients-section__label" data-reveal data-fit-text>{{ globalContent.clients.titre }}</h2>
      </div>
    </section>

    <!-- Bandeau marques — défilement continu (composant à boucle JS parfaite) -->
    <BrandMarquee />

  </div>
</template>
