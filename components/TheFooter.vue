<script setup lang="ts">
import logoBg   from '~/assets/images/logoBg.webp'
import logoImg  from '~/assets/images/logo.png'
import arrowImg from '~/assets/images/arrow.png'
import globalContent from '~/content/global.json'
import { CATEGORIES } from '~/data/categories'

/* Le site est entièrement en thème sombre (pageTheme n'est jamais mis à 'light').
   Les variantes claires (logoFooterBlack ~120K, logoBlack ~189K) étaient
   IMPORTÉES → donc préchargées par Nuxt sur CHAQUE page sans jamais servir, ce qui
   encombrait le chargement du footer. On ne référence que les variantes sombres.
   (Si un thème clair est ajouté un jour, recâbler ici via pageTheme.) */

/* Sur une page en thème clair (ex. /commercial), le footer passe en variantes NOIRES :
   - le "O" de GET IN T[O]UCH → logoBlack.png
   - le background du footer   → logoFooterBlack.png
   Ces variantes sont servies depuis /public (et non importées) pour ne PAS être
   préchargées sur les pages sombres qui ne s'en servent jamais. */
const pageTheme = useState<'dark' | 'light'>('pageTheme', () => 'dark')
const ctaLogo = computed(() =>
  pageTheme.value === 'light' ? '/logoBlack.png' : logoImg,
)
const footerBg = computed(() =>
  pageTheme.value === 'light' ? 'url(/logoFooterBlack.png)' : `url(${logoBg})`,
)

/* URLs éditées dans content/global.json (footer.reseaux) ; les icônes
   restent mappées ici sur les fichiers de public/icons/. */
const SOCIAL_ICONS: Record<string, { name: string; file: string }> = {
  instagram: { name: 'Instagram', file: 'instagram.webp' },
  youtube:   { name: 'YouTube',   file: 'youtube.png' },
  tiktok:    { name: 'TikTok',    file: 'tiktok.png' },
  linkedin:  { name: 'LinkedIn',  file: 'linkedin.webp' },
}

const socials = Object.entries(globalContent.footer.reseaux)
  .filter(([key, href]) => SOCIAL_ICONS[key] && href)
  .map(([key, href]) => ({ ...SOCIAL_ICONS[key], href }))

const footerNav = [
  ...CATEGORIES.map(g => ({ label: g.label, href: `/${g.section}` })),
  { label: globalContent.nav.equipe,  href: '/equipe' },
  { label: globalContent.nav.contact, href: '/contact' },
]

const email        = globalContent.footer.email
const adresseLines = globalContent.footer.adresse.split('\n')
</script>

<template>
  <footer class="footer" :style="{ backgroundImage: footerBg }">

    <!-- Nav liens principaux (libellés : content/categories.json + global.json) -->
    <nav class="footer__nav" aria-label="Navigation footer">
      <NuxtLink v-for="item in footerNav" :key="item.href" :to="item.href" class="footer__nav-link">
        {{ item.label }}
      </NuxtLink>
    </nav>

    <!-- GET IN TOUCH avec O remplacé par le logo -->
    <div class="footer__bottom">
      <NuxtLink to="/contact" class="footer__cta" aria-label="Nous contacter">
        <img :src="arrowImg" alt="" class="footer__cta-arrow-img" aria-hidden="true" fetchpriority="high" />
        <span>GET IN T</span><img :src="ctaLogo" alt="" class="footer__cta-logo" aria-hidden="true" fetchpriority="high" /><span>UCH</span>
      </NuxtLink>

      <!-- Réseaux sociaux + email -->
      <div class="footer__meta-row">
        <div class="footer__social">
          <a
            v-for="s in socials"
            :key="s.name"
            :href="s.href"
            target="_blank"
            rel="noopener"
            :aria-label="s.name"
            class="footer__social-link"
          >
            <img :src="`/icons/${s.file}`" :alt="s.name" class="footer__social-icon" fetchpriority="high" />
          </a>
        </div>
        <a :href="`mailto:${email}`" class="footer__email">
          {{ email }}
        </a>
      </div>

      <!-- Localisation -->
      <p class="footer__location">
        <template v-for="(line, i) in adresseLines" :key="i">
          <br v-if="i > 0">{{ line }}
        </template>
      </p>
    </div>

  </footer>
</template>
