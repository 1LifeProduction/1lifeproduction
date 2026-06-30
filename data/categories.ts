/* =====================================================================
   SOURCE DE VÉRITÉ — Catégories & sous-catégories
   ---------------------------------------------------------------------
   STRUCTURE (slugs, sections, ordre, routing) : définie ICI, en TS. Ne pas
   modifier sans intervention dev (les URLs et filtres en dépendent).

   TEXTES (titres, descriptions, tags) : édités par le client dans
   content/categories.json (voir GESTION-CONTENU.md). Ce fichier les fusionne
   automatiquement avec la structure ci-dessous.
   ===================================================================== */

import content from '~/content/categories.json'

export type Section = 'evenementiel' | 'commercial'

export interface SubCategory {
  slug:    string
  label:   string
  copyKey: string   // ex. COPY_CAPTATIONS  → {{COPY_CAPTATIONS}}
  tags:    string[] // 3–4 bulles ; [] si à fournir
  desc?:   string   // copy éditoriale (overview). Vide = placeholder {{copyKey}}.
}

export interface CategoryGroup {
  section:  Section
  label:    string
  copyKey:  string  // ex. COPY_EVENEMENTIEL
  children: SubCategory[]
}

/* Structure figée : quels slugs existent, dans quel ordre, dans quelle section.
   Les titres/descriptions/tags viennent de content/categories.json. */
const STRUCTURE: { section: Section; copyKey: string; children: { slug: string; copyKey: string }[] }[] = [
  {
    section: 'evenementiel',
    copyKey: 'COPY_EVENEMENTIEL',
    children: [
      { slug: 'captations',     copyKey: 'COPY_CAPTATIONS' },
      { slug: 'livestreams',    copyKey: 'COPY_LIVESTREAMS' },
      { slug: 'lives-sessions', copyKey: 'COPY_LIVES_SESSIONS' },
      { slug: 'afterfilms',     copyKey: 'COPY_AFTERFILMS' },
    ],
  },
  {
    section: 'commercial',
    copyKey: 'COPY_COMMERCIAL',
    children: [
      { slug: 'podcasts-emissions', copyKey: 'COPY_PODCASTS_EMISSIONS' },
      { slug: 'produits',           copyKey: 'COPY_PRODUITS' },
      { slug: 'publicites-vfx',     copyKey: 'COPY_PUBLICITES_VFX' },
      { slug: 'clips',              copyKey: 'COPY_CLIPS' },
      { slug: 'films',              copyKey: 'COPY_FILMS' },
      { slug: 'scenographie-3d',    copyKey: 'COPY_SCENOGRAPHIE_3D' },
    ],
  },
]

type SubContent = { titre?: string; description?: string; tags?: string[] }
const subContent = (content as any)['sous-categories'] ?? {}

/** Catégories : structure (TS) + textes (content/categories.json) fusionnés. */
export const CATEGORIES: CategoryGroup[] = STRUCTURE.map(group => ({
  section: group.section,
  copyKey: group.copyKey,
  label:   (content as any)[group.section]?.titre ?? group.section,
  children: group.children.map(c => {
    const t: SubContent = subContent[c.slug] ?? {}
    return {
      slug:    c.slug,
      copyKey: c.copyKey,
      label:   t.titre ?? c.slug,
      tags:    Array.isArray(t.tags) ? t.tags : [],
      desc:    t.description ? t.description : undefined,
    }
  }),
}))

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

/** Sous-catégorie suivante DANS la même section (boucle). */
export function nextSubCategory(slug: string): (SubCategory & { section: Section }) | undefined {
  const cur = getSubCategory(slug)
  if (!cur) return undefined
  const siblings = getGroup(cur.section)!.children
  const i = siblings.findIndex(c => c.slug === slug)
  const next = siblings[(i + 1) % siblings.length]
  return { ...next, section: cur.section }
}

/* ---- Conventions de routing (centralisées) ---- */

/** Page catégorie filtrée sur une sous-catégorie. */
export const categoryHref = (section: Section, slug: string) =>
  `/${section}?category=${slug}`

/** Page service dédiée à une sous-catégorie. */
export const serviceHref = (slug: string) => `/services/${slug}`

/** Page Réalisations pré-filtrée sur une typologie. */
export const realisationsHref = (slug: string) => `/realisations?categorie=${slug}`
