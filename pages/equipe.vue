<script setup lang="ts">
/* Page Équipe (ex À propos) : même structure et même animation au scroll
   (constellation polygonale). TOUS les textes viennent de content/equipe.json
   (éditable client) — membres, repères, FAQ, CTA compris. */
import content from '~/content/equipe.json'
import globalContent from '~/content/global.json'

/* Profils de l'équipe — édités dans content/equipe.json.
   photo : fichier dans public/team/ (vide = initiale du prénom). */
const team = content.equipe.membres.map(m => ({ photo: m.photo, name: m.nom, role: m.role }))

/* Constellation ("roue") : polygone régulier à N sommets (N = taille de
   l'équipe), centre (380,390), rayon 218, premier sommet en haut. Les membres
   glissent le long des arêtes au fil du scroll (progress 0 → 1 = un tour). */
const HEX_W = 760, HEX_H = 780
const CX = 380, CY = 390, R = 218
const N = team.length

const VERTICES = Array.from({ length: N }, (_, i) => {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / N
  return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) }
})

function polyPoint(p: number) {
  const norm  = ((p % 1) + 1) % 1
  const edgeF = norm * N
  const ei    = Math.floor(edgeF) % N
  const t     = edgeF - Math.floor(edgeF)
  const v0    = VERTICES[ei]
  const v1    = VERTICES[(ei + 1) % N]
  return { x: v0.x + t * (v1.x - v0.x), y: v0.y + t * (v1.y - v0.y) }
}

const EDGES = VERTICES.map((v, i) => ({ from: v, to: VERTICES[(i + 1) % N] }))

const teamRef  = ref<HTMLElement>()
const progress = ref(0)

const nodeStyles = computed(() =>
  team.map((_, i) => {
    const { x, y } = polyPoint(i / N + progress.value)
    return { left: `${(x / HEX_W) * 100}%`, top: `${(y / HEX_H) * 100}%` }
  })
)

/* Au scroll dans la section (desktop, sticky actif) : le titre + le dégradé
   remontent et disparaissent pour ne laisser place qu'à la constellation,
   qui se rapproche du centre et grossit légèrement. Sur mobile, le sticky
   est désactivé (CSS) : seule la rotation des membres suit le scroll. */
const isDesktop = ref(true)

/* Dôme + titre : remontent ET s'effacent. */
const ambianceStyle = computed(() => {
  if (!isDesktop.value) return {}
  const p = progress.value
  return {
    transform: `translateY(${(-p * 60).toFixed(2)}vh)`,
    opacity: String(Math.max(0, 1 - p * 2.8).toFixed(3)),
  }
})

/* Faisceau lumineux : reste ancré en bas — il s'efface seulement en opacité. */
const glowStyle = computed(() => {
  if (!isDesktop.value) return {}
  return { opacity: String(Math.max(0, 1 - progress.value * 2.8).toFixed(3)) }
})

const constellationStyle = computed(() => {
  if (!isDesktop.value) return {}
  const k = Math.min(progress.value / 0.5, 1)
  const scale = (0.92 + k * 0.23).toFixed(3) // 0.92 → 1.15
  const ty = (38 - k * 38).toFixed(2)        // +38vh → 0 (centré)
  return { transform: `translateY(${ty}vh) scale(${scale})` }
})

function onScroll() {
  const el = teamRef.value
  if (!el) return
  if (isDesktop.value) {
    /* Desktop : la section fait 300vh, le stage est sticky → progression sur
       la hauteur de défilement de la section. */
    const scrolled    = window.scrollY - el.offsetTop
    if (scrolled < 0) { progress.value = 0; return }
    const totalScroll = el.offsetHeight - window.innerHeight
    if (totalScroll <= 0) return
    progress.value    = Math.min(scrolled / totalScroll, 1)
  } else {
    /* Mobile : pas de sticky — un tour complet pendant que la section
       traverse l'écran. */
    const r = el.getBoundingClientRect()
    const span = window.innerHeight + r.height
    progress.value = Math.min(Math.max((window.innerHeight - r.top) / span, 0), 1)
  }
}

let scrollRaf = 0
function onScrollRaf() {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(() => { scrollRaf = 0; onScroll() })
}

let mq: MediaQueryList | undefined
function updateMq(e: MediaQueryListEvent | MediaQueryList) { isDesktop.value = e.matches; onScroll() }

onMounted(() => {
  mq = window.matchMedia('(min-width: 768px)')
  updateMq(mq)
  mq.addEventListener('change', updateMq)
  window.addEventListener('scroll', onScrollRaf, { passive: true })
  onScroll()
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScrollRaf)
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  mq?.removeEventListener('change', updateMq)
})

/* Repères chiffrés + FAQ (content/equipe.json) */
const stats = content.reperes.stats
const faq   = content.faq.items

const openFaq = ref<number | null>(null)
function toggleFaq(i: number) { openFaq.value = openFaq.value === i ? null : i }

useHead({
  title: content.seo.titre,
  meta: [
    { name: 'description',        content: content.seo.description },
    { property: 'og:title',       content: content.seo.titre },
    { property: 'og:description', content: content.seo.description },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }),
    },
  ],
})
</script>

<template>
  <div class="about-page grid-bg" data-nav-theme="dark">

    <!-- Hero title -->
    <section class="about-hero">
      <h1 class="about-hero__title" data-reveal>{{ content.hero.titre }}</h1>
    </section>

    <!-- Text card -->
    <section class="about-intro">
      <div class="about-intro__card" data-reveal style="--reveal-delay:100ms">
        <p v-for="(p, i) in content.intro.paragraphes" :key="i" v-html="boldify(p)"></p>
      </div>
    </section>

    <!-- Team — constellation "roue" pilotée au scroll (voir script) -->
    <section ref="teamRef" class="about-team" aria-label="L'équipe">
      <div class="about-team__sticky">

        <!-- Faisceau lumineux : ancré en bas, s'efface seulement -->
        <div class="about-team__glow" :style="glowStyle" aria-hidden="true"></div>

        <!-- Ambiance (dôme + titre) : remonte et s'efface au scroll -->
        <div class="about-team__ambiance" :style="ambianceStyle">
          <div class="about-team__sphere" aria-hidden="true"></div>
          <p class="about-team__heading">{{ content.equipe.titre }}</p>
        </div>

        <div class="about-team__constellation" :style="constellationStyle">
          <!-- SVG : viewBox = container exact, arêtes du polygone générées -->
          <svg class="about-team__lines" :viewBox="`0 0 ${HEX_W} ${HEX_H}`" aria-hidden="true">
            <line
              v-for="(edge, i) in EDGES"
              :key="i"
              :x1="edge.from.x" :y1="edge.from.y"
              :x2="edge.to.x"   :y2="edge.to.y"
              stroke="rgba(255,255,255,0.45)" stroke-width="1"
            />
          </svg>

          <div
            v-for="(style, i) in nodeStyles"
            :key="team[i].name"
            class="about-team__node"
            :style="style"
          >
            <div class="about-team__avatar">
              <img v-if="team[i].photo" :src="team[i].photo" :alt="team[i].name" class="about-team__photo" loading="lazy" />
              <span v-else class="about-team__initial" aria-hidden="true">{{ team[i].name.charAt(0) }}</span>
            </div>
            <div class="about-team__profile">
              <span class="about-team__name">{{ team[i].name }}</span>
              <span class="about-team__role">{{ team[i].role }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Repères -->
    <section class="equipe-stats" aria-label="Quelques repères">
      <p class="xp-eyebrow" data-reveal>{{ content.reperes.eyebrow }}</p>
      <h2 class="xp-section-title" data-reveal style="--reveal-delay:80ms">{{ content.reperes.titre }}</h2>
      <div class="equipe-stats__grid">
        <div
          v-for="(s, i) in stats"
          :key="s.texte"
          class="equipe-stats__cell"
          data-reveal
          :style="`--reveal-delay:${120 + i * 80}ms`"
        >
          <span class="equipe-stats__n">{{ s.chiffre }}</span>
          <span class="equipe-stats__l">{{ s.texte }}</span>
        </div>
      </div>
      <div class="xp-signature" data-reveal>
        <h3 class="xp-signature__titre">« {{ content.reperes.signature.titre }} »</h3>
        <p class="xp-signature__texte">{{ content.reperes.signature.texte }}</p>
      </div>
    </section>

    <!-- FAQ -->
    <section class="xp-faq" data-nav-theme="dark">
      <p class="xp-eyebrow" data-reveal>{{ globalContent.ui.questionsFrequentes }}</p>
      <h2 class="xp-section-title" data-reveal style="--reveal-delay:80ms">{{ content.faq.titre }}</h2>
      <div class="xp-faq__list">
        <div
          v-for="(item, i) in faq"
          :key="i"
          class="xp-faq__item"
          :class="{ 'is-open': openFaq === i }"
        >
          <button
            type="button"
            class="xp-faq__q"
            :aria-expanded="openFaq === i"
            @click="toggleFaq(i)"
          >
            {{ item.q }}
            <span class="xp-faq__plus" aria-hidden="true">+</span>
          </button>
          <p v-show="openFaq === i" class="xp-faq__a">{{ item.a }}</p>
        </div>
      </div>
    </section>

    <!-- CTA devis -->
    <section class="xp-cta" data-nav-theme="dark">
      <div class="xp-cta__inner" data-reveal>
        <h2 class="xp-cta__titre">{{ content.cta.titre }}</h2>
        <p class="xp-cta__texte">{{ content.cta.texte }}</p>
        <NuxtLink to="/contact" class="xp-cta__btn">{{ content.cta.bouton }}</NuxtLink>
      </div>
    </section>

    <!-- Clients -->
    <section class="clients-section" aria-label="Nos clients">
      <div class="container">
        <h2 class="clients-section__label" data-reveal data-fit-text>{{ globalContent.clients.titre }}</h2>
      </div>
    </section>

    <!-- Bandeau marques — défilement continu -->
    <BrandMarquee />

  </div>
</template>
