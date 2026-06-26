/* =====================================================================
   SOURCE DE VÉRITÉ — Catégories & sous-catégories
   ---------------------------------------------------------------------
   Structure DÉFINITIVE. À modifier ICI uniquement : header, pages
   catégorie, pages services et filtres de la page Réalisations
   consomment ce fichier.

   - `copyKey`  : token de copywriting à fournir (placeholder).
   - `tags`     : bulles mots-clés affichées sur la page service.
                  [] = à fournir.
   ===================================================================== */

export type Section = 'evenementiel' | 'commercial'

export interface SubCategory {
  slug:    string
  label:   string
  copyKey: string   // ex. COPY_CAPTATIONS  → {{COPY_CAPTATIONS}}
  tags:    string[] // 3–4 bulles ; [] si à fournir
  desc?:   string   // copy éditoriale existante (overview). Absente = placeholder.
}

export interface CategoryGroup {
  section:  Section
  label:    string
  copyKey:  string  // ex. COPY_EVENEMENTIEL
  children: SubCategory[]
}

export const CATEGORIES: CategoryGroup[] = [
  {
    section: 'evenementiel',
    label:   'Événementiel',
    copyKey: 'COPY_EVENEMENTIEL',
    children: [
      { slug: 'captations',    label: 'Captations',    copyKey: 'COPY_CAPTATIONS',    tags: ['Multicaméra', 'Conférences', 'Festivals', 'Son pro'],
        desc: 'Nous capturons vos événements avec précision pour en retranscrire toute l\'énergie. Conférences, lancements, performances ou soirées : chaque moment est pensé pour être documenté avec justesse et impact.' },
      { slug: 'livestreams',   label: 'Livestreams',   copyKey: 'COPY_LIVESTREAMS',   tags: [],
        desc: 'Diffusez vos événements en direct avec une qualité de production professionnelle. Nous assurons une diffusion sur les plateformes adaptées pour toucher votre audience en temps réel.' },
      { slug: 'lives-sessions', label: 'Lives sessions', copyKey: 'COPY_LIVES_SESSIONS', tags: [] },
      { slug: 'afterfilms',    label: 'Afterfilms',    copyKey: 'COPY_AFTERFILMS',    tags: [],
        desc: 'Des images pensées pour prolonger l\'expérience au-delà de l\'événement. Nous réalisons des afterfilms immersifs qui retranscrivent l\'ambiance, l\'intensité et les temps forts avec un regard cinématographique.' },
    ],
  },
  {
    section: 'commercial',
    label:   'Commercial',
    copyKey: 'COPY_COMMERCIAL',
    children: [
      { slug: 'podcasts-emissions', label: 'Podcasts & Émissions', copyKey: 'COPY_PODCASTS_EMISSIONS', tags: [],
        desc: 'Captation vidéo de vos podcasts et émissions avec une mise en image professionnelle. Son soigné, cadrage dynamique et post-production adaptée pour valoriser vos contenus sur toutes les plateformes.' },
      { slug: 'produits',           label: 'Produits',             copyKey: 'COPY_PRODUITS',           tags: [],
        desc: 'Nous mettons en valeur vos produits à travers une direction artistique soignée. Chaque détail est pensé pour sublimer la matière, la forme et l\'identité de marque avec une image nette et impactante.' },
      { slug: 'publicites-vfx',     label: 'Publicités & VFX',     copyKey: 'COPY_PUBLICITES_VFX',     tags: ['Spots', 'VFX / CGI', 'Campagnes'],
        desc: 'Des spots publicitaires percutants pour diffuser votre message sur tous les écrans. Concept, tournage, montage : nous prenons en charge chaque étape pour livrer une publicité mémorable et efficace.' },
      { slug: 'clips',              label: 'Clips',                copyKey: 'COPY_CLIPS',              tags: [] },
      { slug: 'films',              label: 'Films',                copyKey: 'COPY_FILMS',              tags: [],
        desc: 'Des films de marque à la narration cinématographique, conçus pour ancrer votre identité dans l\'imaginaire de votre audience. Nous construisons des récits visuels qui donnent du sens à votre univers.' },
      { slug: 'scenographie-3d',    label: 'Scénographie & 3D',    copyKey: 'COPY_SCENOGRAPHIE_3D',    tags: [] },
    ],
  },
]

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
