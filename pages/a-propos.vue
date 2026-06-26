<script setup lang="ts">
const clients = [
  { name: 'Formula 1', slug: 'f1'      },
  { name: 'Nike',      slug: 'nike'    },
  { name: 'Spotify',   slug: 'spotify' },
  { name: 'Chanel',    slug: 'chanel'  },
]

// Hexagon vertices clockwise from top, matching SVG coords (container 760×780)
const HEX_W = 760, HEX_H = 780
const VERTICES = [
  { x: 380, y: 172 }, // 0 top
  { x: 569, y: 281 }, // 1 upper-right
  { x: 569, y: 499 }, // 2 lower-right
  { x: 380, y: 608 }, // 3 bottom
  { x: 191, y: 499 }, // 4 lower-left
  { x: 191, y: 281 }, // 5 upper-left
]

function hexPoint(p: number) {
  const norm  = ((p % 1) + 1) % 1
  const edgeF = norm * 6
  const ei    = Math.floor(edgeF) % 6
  const t     = edgeF - Math.floor(edgeF)
  const v0    = VERTICES[ei]
  const v1    = VERTICES[(ei + 1) % 6]
  return { x: v0.x + t * (v1.x - v0.x), y: v0.y + t * (v1.y - v0.y) }
}

const teamRef  = ref<HTMLElement>()
const progress = ref(0)

/* Profils de l'équipe — 6 bulles (placeholders à fournir).
   photo : déposer dans public/team/ ; vide = bulle sans photo. */
const team = [
  { photo: '', name: '{{TEAM_1_NOM}}', role: '{{TEAM_1_ROLE}}' },
  { photo: '', name: '{{TEAM_2_NOM}}', role: '{{TEAM_2_ROLE}}' },
  { photo: '', name: '{{TEAM_3_NOM}}', role: '{{TEAM_3_ROLE}}' },
  { photo: '', name: '{{TEAM_4_NOM}}', role: '{{TEAM_4_ROLE}}' },
  { photo: '', name: '{{TEAM_5_NOM}}', role: '{{TEAM_5_ROLE}}' },
  { photo: '', name: '{{TEAM_6_NOM}}', role: '{{TEAM_6_ROLE}}' },
]

const nodeStyles = computed(() =>
  [0, 1/6, 2/6, 3/6, 4/6, 5/6].map(base => {
    const { x, y } = hexPoint(base + progress.value)
    return { left: `${(x / HEX_W) * 100}%`, top: `${(y / HEX_H) * 100}%` }
  })
)

function onScroll() {
  const el = teamRef.value
  if (!el) return
  const scrolled    = window.scrollY - el.offsetTop
  if (scrolled < 0) return
  const totalScroll = el.offsetHeight - window.innerHeight
  if (totalScroll <= 0) return
  progress.value    = Math.min(scrolled / totalScroll, 1)
}

onMounted(()   => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

useHead({
  title: '1LIFE PRODUCTION',
  meta: [
    { name: 'description',        content: 'Depuis plus de 10 ans, 1LIFE PRODUCTION réunit photographes, vidéastes, graphistes et experts VFX pour créer des visuels qui laissent une empreinte durable.' },
    { property: 'og:description', content: 'Depuis plus de 10 ans, 1LIFE PRODUCTION réunit photographes, vidéastes, graphistes et experts VFX pour créer des visuels qui laissent une empreinte durable.' },
  ],
})
</script>

<template>
  <div class="about-page grid-bg" data-nav-theme="dark">

    <!-- Blobs page entière -->
    <div class="about-blob about-blob--1" aria-hidden="true"></div>
    <div class="about-blob about-blob--2" aria-hidden="true"></div>
    <div class="about-blob about-blob--3" aria-hidden="true"></div>
    <div class="about-blob about-blob--4" aria-hidden="true"></div>

    <!-- Hero title -->
    <section class="about-hero">
      <h1 class="about-hero__title" data-reveal>À propos</h1>
    </section>

    <!-- Text card -->
    <section class="about-intro">
      <div class="about-intro__card" data-reveal style="--reveal-delay:100ms">
        <p>
          <strong>1Lifeproduction</strong> est un collectif créatif spécialisé dans la
          production audiovisuelle et la création visuelle. Fondé par des amis passionnés
          par l'image, 1Life réunit une équipe multidisciplinaire composée de :
        </p>
        <p>
          <strong>photographes, vidéastes, graphistes, dronistes FPV, artistes 3D,
          motion designers et experts VFX.</strong>
        </p>
        <p>
          Depuis plus de <strong>10 ans</strong>, nous accompagnons <strong>marques,
          entreprises et créateurs</strong> dans la réalisation de contenus visuels
          <strong>forts, immersifs et impactants.</strong>
        </p>
        <p>
          Chaque projet est pensé sur mesure, avec une attention particulière portée à
          <strong>l'esthétique, à l'émotion et à la narration.</strong>
        </p>
        <p>
          De la photographie à la production vidéo, en passant par le FPV, la 3D et les
          effets visuels, nous transformons les idées en expériences visuelles uniques,
          conçues pour captiver et laisser une empreinte durable.
        </p>
        <p>
          <strong>Au-delà de la production.<br>Nous créons des visuels que l'on n'oublie pas.</strong>
        </p>
      </div>
    </section>

    <!-- Team -->
    <section ref="teamRef" class="about-team">
      <div class="about-team__sticky">

        <!-- Gradient / glow en fond (conforme maquette) -->
        <div class="about-team__glow" aria-hidden="true"></div>

        <p class="about-team__heading" data-reveal>Notre équipe</p>

        <div class="about-team__constellation">
        <!-- SVG : viewBox = container exact, overflow:visible pour les lignes débordantes -->
        <svg class="about-team__lines" viewBox="0 0 760 780" aria-hidden="true">
          <!-- 6 côtés de l'hexagone, centre (380,390) R=218 -->
          <line x1="380" y1="172" x2="569" y2="281" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
          <line x1="569" y1="281" x2="569" y2="499" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
          <line x1="569" y1="499" x2="380" y2="608" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
          <line x1="380" y1="608" x2="191" y2="499" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
          <line x1="191" y1="499" x2="191" y2="281" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
          <line x1="191" y1="281" x2="380" y2="172" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
        </svg>

        <div
          v-for="(style, i) in nodeStyles"
          :key="i"
          class="about-team__node"
          :style="style"
        >
          <div class="about-team__avatar">
            <img v-if="team[i].photo" :src="team[i].photo" :alt="team[i].name" class="about-team__photo" />
          </div>
          <div class="about-team__profile">
            <span class="about-team__name">{{ team[i].name }}</span>
            <span class="about-team__role">{{ team[i].role }}</span>
          </div>
        </div>
        </div>
      </div>
    </section>

    <!-- Clients -->
    <section class="clients-section" aria-label="Nos clients">
      <div class="container">
        <h2 class="clients-section__label" data-reveal>ILS NOUS FONT<br>CONFIANCE</h2>
        <div class="clients-section__logos">
          <img
            v-for="(c, i) in clients"
            :key="c.slug"
            :src="`/clients/${c.slug}.png`"
            :alt="c.name"
            class="clients-section__logo"
            data-reveal
            :style="`--reveal-delay:${i * 80}ms`"
          />
        </div>
      </div>
    </section>

  </div>
</template>
