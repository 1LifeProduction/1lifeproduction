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

const titleRef    = ref<HTMLElement>()
const theaterRef  = ref<HTMLElement>()
const activeIndex = ref(0)

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

function onScroll() {
  const el = theaterRef.value
  if (!el) return
  const scrolled = window.scrollY - el.offsetTop
  if (scrolled < 0) return
  const newIndex = Math.min(
    Math.floor(scrolled / window.innerHeight),
    featured.length - 1
  )
  if (newIndex !== activeIndex.value) {
    activeIndex.value = newIndex
  }
}

onMounted(() => {
  document.fonts.ready.then(() => {
    fitTitle()
    ro = new ResizeObserver(() => requestAnimationFrame(fitTitle))
    ro.observe(document.documentElement)
  })
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  ro?.disconnect()
  window.removeEventListener('scroll', onScroll)
})

useHead({
  title: '1LIFE PRODUCTION — Collectif de vidéastes',
  meta: [{ name: 'description', content: 'Collectif de vidéastes indépendants — événementiel & commercial, Paris.' }],
})
</script>

<template>
  <div class="home grid-bg">

    <section class="home-hero" aria-label="Accueil">
      <img
        :src="heroImg"
        alt=""
        class="home-hero__img"
        aria-hidden="true"
        fetchpriority="high"
      />
      <div class="home-hero__overlay" aria-hidden="true"></div>
      <div class="home-hero__content">
        <div class="home-hero__sub">
          <p class="home-hero__baseline">PRODUCTION AGENCY</p>
        </div>
        <h1 ref="titleRef" class="home-hero__title">1LIFE PRODUCTION</h1>
      </div>
    </section>

    <!-- Section theater : haute de n×100vh, stage sticky -->
    <section
      ref="theaterRef"
      class="projects-theater"
      :style="{ '--project-count': featured.length }"
      aria-label="Projets mis en avant"
    >
      <!-- Blobs flottants — hors du stage pour déborder sur la section suivante -->
      <div class="projects-grid__blobs" aria-hidden="true">
        <div class="blob blob--1"></div>
        <div class="blob blob--2"></div>
      </div>

      <div class="projects-theater__stage">

        <!-- Bloc fixe : images stackées en crossfade -->
        <NuxtLink
          :to="`/projects/${featured[activeIndex].id}`"
          class="project-card projects-theater__card"
        >
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

    <section class="clients-section" aria-label="Nos clients">
      <div class="container">
        <h2 class="clients-section__label">
          ILS NOUS FONT<br>CONFIANCE
        </h2>
        <div class="clients-section__logos">
          <img
            v-for="c in clients"
            :key="c.slug"
            :src="`/clients/${c.slug}.png`"
            :alt="c.name"
            class="clients-section__logo"
          />
        </div>
      </div>
    </section>

  </div>
</template>
