/* =====================================================================
   SOURCE DE VÉRITÉ — Catégories & sous-catégories
   ---------------------------------------------------------------------
   STRUCTURE (slugs, sections, ordre, routing) : définie ICI, en TS. Ne pas
   modifier sans intervention dev (les URLs et ancres en dépendent).

   TEXTES (hero, titres, descriptions, tags, process, FAQ, CTA) : édités par
   le client dans content/categories.json (voir GESTION-CONTENU.md). Ce
   fichier les fusionne automatiquement avec la structure ci-dessous.
   ===================================================================== */

import content from '~/content/categories.json'

export type Section = 'live' | 'documentaire' | 'marque' | 'evenementiel'

export interface SubCategory {
  slug:   string
  label:  string
  kicker: string    // ex. "01 · Production artistique"
  desc:   string    // copy éditoriale (paragraphes séparés par \n\n)
  tags:   string[]  // bulles ; [] si à fournir
  dev?:   boolean   // true = "En développement" (pas encore de projets)
  visuel?: string   // image du chapitre quand il n'a pas (encore) de projet (/covers/…)
}

export interface ProcessStep { titre: string; texte: string }
export interface FaqItem     { q: string; a: string }

export interface CategoryGroup {
  section:   Section
  label:     string
  seo:       { titre: string; description: string }
  hero:      { kicker: string; titre: string; sousTitre: string; copy: string; image?: string; video?: string; videoHq?: string } // image : /covers/… (sinon visuel par défaut) ; video : boucle MP4 muette légère (/videos/…), videoHq : version 1080p chargée en fond, image = poster
  process:   { titre: string; etapes: ProcessStep[]; signature: { titre: string; texte: string } }
  faq:       { titre: string; items: FaqItem[] }
  cta:       { titre: string; texte: string; bouton: string }
  children:  SubCategory[]
}

/* Structure figée : quels slugs existent, dans quel ordre, dans quelle section.
   Les textes viennent de content/categories.json. */
const STRUCTURE: { section: Section; children: { slug: string; dev?: boolean }[] }[] = [
  {
    section: 'live',
    children: [
      { slug: 'live-sessions' },
      { slug: 'captation-multicam' },
      { slug: 'livestream' },
    ],
  },
  {
    section: 'documentaire',
    children: [
      { slug: 'documentaire-musical' },
      { slug: 'artisanat-savoir-faire', dev: true },
      { slug: 'cuisine-territoires', dev: true },
    ],
  },
  {
    section: 'marque',
    children: [
      { slug: 'film-de-marque' },
      { slug: 'video-corporate' },
      { slug: 'film-produit' },
      { slug: 'podcasts-emissions' },
      { slug: 'publicite-vfx' },
      { slug: 'photographie' },
      { slug: '3d-scenographie' },
    ],
  },
  {
    section: 'evenementiel',
    children: [
      { slug: 'aftermovie' },
      { slug: 'reportage-photo-video' },
      { slug: 'conferences-institutionnel' },
    ],
  },
]

type SubContent = { kicker?: string; titre?: string; description?: string; tags?: string[]; visuel?: string }
const subContent = (content as any)['sous-categories'] ?? {}

const EMPTY_SEO       = { titre: '1LIFE PRODUCTION', description: '' }
const EMPTY_HERO      = { kicker: '', titre: '', sousTitre: '', copy: '' }
const EMPTY_PROCESS   = { titre: '', etapes: [], signature: { titre: '', texte: '' } }
const EMPTY_FAQ       = { titre: '', items: [] }
const EMPTY_CTA       = { titre: '', texte: '', bouton: 'Demander un devis' }

/** Catégories : structure (TS) + textes (content/categories.json) fusionnés. */
export const CATEGORIES: CategoryGroup[] = STRUCTURE.map(group => {
  const c = (content as any)[group.section] ?? {}
  return {
    section: group.section,
    label:   c.titre ?? group.section,
    seo:     { ...EMPTY_SEO,     ...(c.seo ?? {}) },
    hero:    { ...EMPTY_HERO,    ...(c.hero ?? {}) },
    process: { ...EMPTY_PROCESS, ...(c.process ?? {}) },
    faq:     { ...EMPTY_FAQ,     ...(c.faq ?? {}) },
    cta:     { ...EMPTY_CTA,     ...(c.cta ?? {}) },
    children: group.children.map(child => {
      const t: SubContent = subContent[child.slug] ?? {}
      return {
        slug:   child.slug,
        label:  t.titre ?? child.slug,
        kicker: t.kicker ?? '',
        desc:   t.description ?? '',
        tags:   Array.isArray(t.tags) ? t.tags : [],
        dev:    child.dev,
        visuel: t.visuel,
      }
    }),
  }
})

/* ---- Helpers ---- */

/** Toutes les sous-catégories à plat, dans l'ordre, avec leur section. */
export const ALL_SUBCATEGORIES: (SubCategory & { section: Section })[] =
  CATEGORIES.flatMap(g => g.children.map(c => ({ ...c, section: g.section })))

export function getGroup(section: Section): CategoryGroup | undefined {
  return CATEGORIES.find(g => g.section === section)
}

export function getSubCategory(slug: string): (SubCategory & { section: Section }) | undefined {
  return ALL_SUBCATEGORIES.find(c => c.slug === slug)
}

/* ---- Conventions de routing (centralisées) ---- */

/** Page catégorie. */
export const sectionHref = (section: Section) => `/${section}`

/** Ancre d'une sous-catégorie dans sa page catégorie. */
export const categoryHref = (section: Section, slug: string) =>
  `/${section}#${slug}`

/** Page contact préremplie sur une catégorie (champ "Type de projet"). */
export const devisHref = (section: Section) => `/contact?type=${section}`
