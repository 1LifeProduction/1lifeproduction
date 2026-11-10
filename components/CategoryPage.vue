<script setup lang="ts">
/* Page catégorie (Live / Documentaire / Marque / Événementiel).
   Structure commune : hero, sous-catégories alternées gauche/droite avec
   projet phare + tiroir de projets, process, FAQ, CTA devis. Les textes
   viennent de data/categories.ts (fusion content/categories.json). */
import projectsData from '~/data/projects.json'
import heroImg from '~/assets/images/imgHeader.png'
import globalContent from '~/content/global.json'
import { getGroup, devisHref, type Section, type SubCategory } from '~/data/categories'

const ui = globalContent.ui

/* initialProjectId : ouvre la modale de ce projet dès le rendu (SSR compris).
   Utilisé par les pages /projets/[slug] — l'URL profonde affiche la page
   catégorie avec la modale déjà ouverte par-dessus. */
const props = defineProps<{ section: Section; initialProjectId?: string }>()

const route = useRoute()
const group = getGroup(props.section)!

/* Type explicite (le JSON n'a pas "photos" sur tous les projets) */
interface Project {
  id: string; title: string; section: string; category: string
  client?: string; vimeo_url?: string; thumbnail?: string; description?: string
  tags?: string[]; featured?: boolean; year?: number
  photos?: string[]   // série photo : carrousel dans la modale
}
const projects = projectsData as Project[]

/* Projets d'une sous-catégorie, dans l'ordre du JSON :
   le premier est le projet phare du chapitre, les suivants vont dans le tiroir. */
function projectsOf(sub: SubCategory): Project[] {
  return projects.filter(p => p.section === props.section && p.category === sub.slug)
}
function featuredOf(sub: SubCategory): Project | undefined {
  return projectsOf(sub)[0]
}
function drawerOf(sub: SubCategory): Project[] {
  return projectsOf(sub).slice(1)
}

/* Tiroirs "Voir les projets" */
const openDrawers = ref<Record<string, boolean>>({})
function toggleDrawer(slug: string) {
  openDrawers.value[slug] = !openDrawers.value[slug]
}

/* Modale projet (tiroir + projets phares sans vidéo intégrée).
   Initialisée AVANT le rendu si initialProjectId est fourni : le HTML généré
   des pages /projets/[slug] contient la modale ouverte (indexable). */
const modalProject = ref<Project | null>(
  props.initialProjectId
    ? projects.find(p => p.id === props.initialProjectId && p.section === props.section) ?? null
    : null,
)

/* Galerie de la modale : la vidéo (si présente) puis les photos (si
   présentes). Un seul média → pas de flèches ni de compteur. */
type Slide = { type: 'video'; url: string } | { type: 'photo'; src: string }
const slideIdx = ref(0)
const slides = computed<Slide[]>(() => {
  const p = modalProject.value
  if (!p) return []
  const out: Slide[] = []
  if (p.vimeo_url) out.push({ type: 'video', url: p.vimeo_url })
  for (const src of p.photos ?? []) out.push({ type: 'photo', src })
  return out
})
const currentSlide = computed(() => slides.value[slideIdx.value] ?? null)
function goSlide(delta: number) {
  const n = slides.value.length
  if (n < 2) return
  slideIdx.value = (slideIdx.value + delta + n) % n
}

/* L'URL suit la modale SANS navigation (replaceState : pas de re-rendu, pas
   d'entrée d'historique, le bouton Retour garde son comportement normal) :
   ouvrir → /projets/<id> (lien partageable), fermer → retour à l'URL de la
   catégorie. */
function syncUrl(path: string) {
  if (import.meta.client) history.replaceState(history.state, '', path)
}

function openProject(p: Project) {
  modalProject.value = p
  slideIdx.value = 0
  if (import.meta.client) document.body.style.overflow = 'hidden'
  syncUrl(`/projets/${p.id}`)
}
function closeProject() {
  modalProject.value = null
  if (import.meta.client) document.body.style.overflow = ''
  syncUrl(`/${props.section}`)
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeProject()
  if (!modalProject.value) return
  if (e.key === 'ArrowRight') goSlide(1)
  if (e.key === 'ArrowLeft')  goSlide(-1)
}
onMounted(() => {
  window.addEventListener('keydown', onKeydown)

  /* Modale déjà ouverte au chargement (arrivée par /projets/[slug]) :
     poser le verrou de scroll que openProject aurait posé. */
  if (modalProject.value) document.body.style.overflow = 'hidden'

  /* Ancre au chargement direct (/live#captation-multicam) : le loader fige le
     scroll (body en position:fixed) pendant son animation et remet la page en
     haut. On attend donc que son verrou soit posé PUIS libéré avant de
     scroller vers la sous-catégorie (sinon le scroll serait annulé). */
  const hash = route.hash
  if (hash) {
    const started = Date.now()
    let lockSeen = false
    const tryScroll = () => {
      const locked  = document.body.style.position === 'fixed'
      const elapsed = Date.now() - started
      if (locked) lockSeen = true
      // On scrolle une fois le verrou passé (ou après 2 s s'il n'apparaît pas).
      if (!locked && (lockSeen || elapsed > 2000)) {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
        return
      }
      if (elapsed < 15000) setTimeout(tryScroll, 150)
    }
    tryScroll()
  }
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  if (import.meta.client) document.body.style.overflow = ''
})

/* FAQ accordéon */
const openFaq = ref<number | null>(null)
function toggleFaq(i: number) {
  openFaq.value = openFaq.value === i ? null : i
}

/* Nom de la plateforme vidéo d'un projet (lien "Voir sur …" dans la modale) */
function platformOf(url?: string): string {
  if (!url) return ''
  if (/vimeo.com/.test(url)) return 'Vimeo'
  if (/youtu.?be/.test(url)) return 'YouTube'
  return ''
}

/* Type de la sous-catégorie d'un projet (label affiché dans le tiroir/modale) */
function subLabelOf(p: Project): string {
  return group.children.find(c => c.slug === p.category)?.label ?? ''
}

/* JSON-LD FAQPage propre à la page */
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: group.faq.items.map(item => ({
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
  <div class="xp-page">

    <!-- Hero -->
    <section class="evnt-hero" data-nav-theme="dark">
      <!-- Hero : boucle vidéo muette si fournie (content/categories.json →
           hero.video, image = poster), sinon image de couverture, sinon visuel
           par défaut. -->
      <ProgressiveVideo
        v-if="group.hero.video"
        class="evnt-hero__img"
        :src="group.hero.video"
        :hq="group.hero.videoHq"
        :poster="group.hero.image || undefined"
      />
      <img v-else :src="group.hero.image || heroImg" alt="" class="evnt-hero__img" aria-hidden="true" fetchpriority="high" />
      <div class="evnt-hero__overlay" aria-hidden="true"></div>
      <div class="xp-hero__bottom">
        <p class="xp-hero__kicker" data-reveal="fade" style="--reveal-delay:60ms">{{ group.hero.kicker }}</p>
        <h1 class="xp-hero__title" data-reveal style="--reveal-delay:150ms">{{ group.hero.titre }}</h1>
        <p class="xp-hero__subtitle" data-reveal style="--reveal-delay:260ms">{{ group.hero.sousTitre }}</p>
        <p class="xp-hero__copy" data-reveal style="--reveal-delay:360ms">{{ group.hero.copy }}</p>
      </div>
    </section>

    <!-- Sous-catégories : alternance gauche / droite -->
    <div class="xp-chapters grid-bg" data-nav-theme="dark">
      <section
        v-for="(sub, i) in group.children"
        :key="sub.slug"
        :id="sub.slug"
        :class="['xp-chapter', i % 2 !== 0 && 'xp-chapter--reversed']"
      >
        <div class="xp-chapter__text" :data-reveal="i % 2 !== 0 ? 'right' : 'left'">
          <p class="xp-chapter__kicker">{{ sub.kicker }}</p>
          <h2 class="xp-chapter__title">{{ sub.label }}</h2>
          <span v-if="sub.dev" class="xp-badge">{{ ui.enDeveloppement }}</span>
          <p class="xp-chapter__desc">{{ sub.desc }}</p>
          <div v-if="sub.tags.length" class="xp-pills">
            <span v-for="tag in sub.tags" :key="tag" class="xp-pill">{{ tag }}</span>
          </div>
        </div>

        <div class="xp-chapter__media" :data-reveal="i % 2 !== 0 ? 'left' : 'right'" style="--reveal-delay:120ms">
          <template v-if="featuredOf(sub)">
            <div class="xp-media">
              <VimeoEmbed
                v-if="featuredOf(sub)!.vimeo_url"
                :url="featuredOf(sub)!.vimeo_url"
                :title="featuredOf(sub)!.title"
              />
              <button
                v-else
                type="button"
                class="xp-media__thumb"
                :aria-label="`Ouvrir le projet ${featuredOf(sub)!.title}`"
                @click="openProject(featuredOf(sub)!)"
              >
                <!-- Série photo : diaporama automatique (fondu enchaîné) -->
                <PhotoSlideshow
                  v-if="(featuredOf(sub)!.photos?.length ?? 0) > 1"
                  :photos="featuredOf(sub)!.photos!"
                  :alt="featuredOf(sub)!.title"
                />
                <img
                  v-else-if="featuredOf(sub)!.thumbnail"
                  :src="featuredOf(sub)!.thumbnail"
                  :alt="featuredOf(sub)!.title"
                  class="xp-media__img"
                  loading="lazy"
                />
                <span v-else class="xp-media__placeholder" aria-hidden="true"></span>
              </button>
              <p class="xp-media__caption">
                {{ featuredOf(sub)!.title }}<template v-if="featuredOf(sub)!.photos?.length"> · {{ featuredOf(sub)!.photos!.length }} photos</template>
              </p>
            </div>

            <template v-if="drawerOf(sub).length">
              <button
                type="button"
                class="xp-drawer-toggle"
                :aria-expanded="!!openDrawers[sub.slug]"
                :aria-controls="`drawer-${sub.slug}`"
                @click="toggleDrawer(sub.slug)"
              >
                {{ openDrawers[sub.slug] ? ui.reduireProjets : ui.voirProjets }}
                <span class="xp-drawer-toggle__chev" :class="{ 'is-open': openDrawers[sub.slug] }" aria-hidden="true">↓</span>
              </button>
              <div
                :id="`drawer-${sub.slug}`"
                class="xp-drawer"
                :class="{ 'is-open': openDrawers[sub.slug] }"
              >
                <button
                  v-for="p in drawerOf(sub)"
                  :key="p.id"
                  type="button"
                  class="xp-mini"
                  @click="openProject(p)"
                >
                  <span class="xp-mini__visual">
                    <!-- lazy : ces vignettes sont dans un tiroir FERMÉ au
                         chargement — sans lazy, elles se téléchargeaient
                         toutes dès l'arrivée sur la page -->
                    <img v-if="p.thumbnail" :src="p.thumbnail" :alt="p.title" class="xp-mini__img" loading="lazy" />
                    <span v-else class="xp-mini__placeholder" aria-hidden="true"></span>
                    <span class="xp-mini__play" aria-hidden="true">▶</span>
                  </span>
                  <span class="xp-mini__meta">
                    <strong class="xp-mini__title">{{ p.title }}</strong>
                    <span class="xp-mini__type">{{ subLabelOf(p) }}</span>
                  </span>
                </button>
              </div>
            </template>
          </template>

          <!-- Sous-catégorie sans projet (ex. en développement) : visuel de
               couverture si fourni (content/categories.json → visuel) -->
          <div v-else class="xp-media">
            <img v-if="sub.visuel" :src="sub.visuel" :alt="sub.label" class="xp-media__img xp-media__img--cover" loading="lazy" />
            <div v-else class="xp-media__placeholder xp-media__placeholder--empty" aria-hidden="true"></div>
          </div>
        </div>
      </section>
    </div>

    <!-- Comment on travaille -->
    <section class="xp-process" data-nav-theme="dark">
      <p class="xp-eyebrow" data-reveal>{{ ui.commentOnTravaille }}</p>
      <h2 class="xp-section-title" data-reveal style="--reveal-delay:80ms">{{ group.process.titre }}</h2>
      <div class="xp-process__grid">
        <div
          v-for="(step, i) in group.process.etapes"
          :key="step.titre"
          class="xp-process__card"
          data-reveal
          :style="`--reveal-delay:${120 + i * 80}ms`"
        >
          <span class="xp-process__num">0{{ i + 1 }}</span>
          <h3 class="xp-process__step">{{ step.titre }}</h3>
          <p class="xp-process__texte">{{ step.texte }}</p>
        </div>
      </div>
      <div class="xp-signature" data-reveal>
        <h3 class="xp-signature__titre">« {{ group.process.signature.titre }} »</h3>
        <p class="xp-signature__texte">{{ group.process.signature.texte }}</p>
      </div>
    </section>

    <!-- FAQ -->
    <section class="xp-faq" data-nav-theme="dark">
      <p class="xp-eyebrow" data-reveal>{{ ui.questionsFrequentes }}</p>
      <h2 class="xp-section-title" data-reveal style="--reveal-delay:80ms">{{ group.faq.titre }}</h2>
      <div class="xp-faq__list">
        <div
          v-for="(item, i) in group.faq.items"
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
        <h2 class="xp-cta__titre">{{ group.cta.titre }}</h2>
        <p class="xp-cta__texte">{{ group.cta.texte }}</p>
        <NuxtLink :to="devisHref(section)" class="xp-cta__btn">{{ group.cta.bouton }}</NuxtLink>
      </div>
    </section>

    <!-- Modale projet -->
    <Teleport to="body">
      <div
        v-if="modalProject"
        class="xp-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="modalProject.title"
        @click.self="closeProject"
      >
        <div class="xp-modal__card">
          <button type="button" class="xp-modal__close" aria-label="Fermer" @click="closeProject">×</button>
          <div class="xp-modal__media" :class="{ 'xp-modal__media--gallery': slides.length > 1 }">
            <!-- Média courant : vidéo ou photo (galerie si plusieurs) -->
            <template v-if="currentSlide">
              <VimeoEmbed
                v-if="currentSlide.type === 'video'"
                :key="'v'"
                :url="currentSlide.url"
                :title="modalProject.title"
              />
              <img
                v-else
                :key="currentSlide.src"
                :src="currentSlide.src"
                :alt="`${modalProject.title} — photo ${slideIdx + 1}`"
                class="xp-modal__photo"
              />
            </template>
            <template v-else>
              <img
                v-if="modalProject.thumbnail"
                :src="modalProject.thumbnail"
                :alt="modalProject.title"
                class="xp-modal__img"
              />
              <div v-else class="xp-modal__placeholder" aria-hidden="true"></div>
              <p class="xp-modal__note">{{ ui.videoBientot }}</p>
            </template>

            <!-- Navigation de la galerie -->
            <template v-if="slides.length > 1">
              <button type="button" class="xp-gallery__nav xp-gallery__nav--prev" aria-label="Média précédent" @click="goSlide(-1)">‹</button>
              <button type="button" class="xp-gallery__nav xp-gallery__nav--next" aria-label="Média suivant" @click="goSlide(1)">›</button>
              <span class="xp-gallery__count" aria-live="polite">{{ slideIdx + 1 }} / {{ slides.length }}</span>
            </template>
          </div>
          <div class="xp-modal__copy">
            <div>
              <h2 class="xp-modal__title">{{ modalProject.title }}</h2>
              <p class="xp-modal__type">{{ subLabelOf(modalProject) }}<template v-if="modalProject.client"> · {{ modalProject.client }}</template></p>
              <p v-if="modalProject.description" class="xp-modal__desc">{{ modalProject.description }}</p>
              <a
                v-if="platformOf(modalProject.vimeo_url)"
                :href="modalProject.vimeo_url"
                target="_blank"
                rel="noopener"
                class="xp-modal__ext"
              >{{ ui.voirSur }} {{ platformOf(modalProject.vimeo_url) }} ↗</a>
            </div>
            <NuxtLink :to="devisHref(section)" class="xp-modal__btn" @click="closeProject">
              {{ ui.projetSimilaire }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>
