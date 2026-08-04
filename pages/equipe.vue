<script setup lang="ts">
/* Page Équipe (ex À propos) : même structure et même animation au scroll
   (constellation polygonale). TOUS les textes viennent de content/equipe.json
   (éditable client) — membres, repères, FAQ, CTA compris. */
import content from '~/content/equipe.json'
import globalContent from '~/content/global.json'

/* Profils de l'équipe — édités dans content/equipe.json.
   photo : fichier dans public/team/ (vide = initiale du prénom). */
const team = content.equipe.membres.map(m => ({ photo: m.photo, name: m.nom, role: m.role }))

/* Liste "générique de film" : une ligne typographique par membre (nom + rôle).
   - Desktop (pointeur) : au survol d'une ligne, sa photo suit le curseur en
     polaroid et les autres lignes s'estompent.
   - Mobile / tactile : pas de survol → la photo s'affiche en vignette inline
     dans la ligne (CSS .credits__thumb, @media hover:none).
   Un membre sans photo dans equipe.json : ligne simple, aucune vignette. */
const hoverIdx = ref<number | null>(null)
const floatX   = ref(0)
const floatY   = ref(0)

/* Effet "sticker" : la photo pop CENTRÉE sur le curseur au moment où on entre
   sur la ligne, puis reste figée là (elle ne suit pas la souris). Un angle
   aléatoire raisonnable (±3–8°, jamais proche de 0) est retiré à chaque
   ligne. Changement de ligne → nouveau pop (key sur hoverIdx + mode out-in) ;
   sortie de la liste → fade out (Transition credits-photo côté CSS). */
const floatAngle = ref(-4)
const creditsRef = ref<HTMLElement>()

function onRowEnter(i: number, e: MouseEvent) {
  hoverIdx.value = i
  /* Coordonnées RELATIVES à la section (sticker en position:absolute dedans) :
     la photo est collée au contenu et défile avec la page — pas au viewport. */
  const rect = creditsRef.value?.getBoundingClientRect()
  floatX.value = e.clientX - (rect?.left ?? 0)
  floatY.value = e.clientY - (rect?.top ?? 0)
  const a = 3 + Math.random() * 5
  floatAngle.value = Math.random() < 0.5 ? -a : a
}

const hoverPhoto = computed(() =>
  hoverIdx.value !== null ? team[hoverIdx.value].photo : '',
)

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

    <!-- Team — liste "générique de film" (voir commentaire script) -->
    <section ref="creditsRef" class="credits" aria-label="L'équipe">
      <p class="xp-eyebrow" data-reveal>{{ content.equipe.titre }}</p>
      <!-- L'estompage des autres lignes au survol est en CSS PUR (:hover sur la
           liste) : pas de classe pilotée par Vue ici, sinon chaque re-rendu
           écraserait la classe is-visible posée par le plugin reveal (les
           lignes repasseraient à l'état caché). Le JS ne gère que la photo. -->
      <ul class="credits__list" @mouseleave="hoverIdx = null">
        <li
          v-for="(m, i) in team"
          :key="m.name"
          class="credits__row"
          data-reveal
          :style="`--reveal-delay:${80 + i * 60}ms`"
          @mouseenter="onRowEnter(i, $event)"
        >
          <img v-if="m.photo" :src="m.photo" :alt="m.name" class="credits__thumb" loading="lazy" />
          <span class="credits__name">{{ m.name }}</span>
          <span class="credits__role">{{ m.role }}</span>
        </li>
      </ul>

      <!-- Sticker photo (desktop pointeur uniquement, voir CSS). key sur
           hoverIdx : changer de ligne re-déclenche le pop à la nouvelle
           position ; out-in = l'ancienne s'efface avant que la nouvelle pope. -->
      <Transition name="credits-photo" mode="out-in">
        <img
          v-if="hoverPhoto"
          :key="hoverIdx ?? -1"
          :src="hoverPhoto"
          class="credits__float"
          :style="{ left: `${floatX}px`, top: `${floatY}px`, '--angle': `${floatAngle.toFixed(1)}deg` }"
          alt=""
          aria-hidden="true"
        />
      </Transition>
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
