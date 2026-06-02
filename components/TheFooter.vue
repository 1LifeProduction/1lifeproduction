<script setup lang="ts">
import logoBg        from '~/assets/images/logoBg.png'
import logoBgBlack   from '~/assets/images/logoFooterBlack.png'
import logoImg       from '~/assets/images/logo.png'
import logoBlackImg  from '~/assets/images/logoBlack.png'

const pageTheme     = useState<'dark' | 'light'>('pageTheme', () => 'dark')
const isLight       = computed(() => pageTheme.value === 'light')
const currentLogoBg = computed(() => isLight.value ? logoBgBlack : logoBg)
const currentLogo   = computed(() => isLight.value ? logoBlackImg : logoImg)

const socials = [
  { name: 'Instagram', file: 'instagram.webp', href: 'https://instagram.com/1lifeproduction' },
  { name: 'YouTube',   file: 'youtube.png',    href: 'https://youtube.com' },
  { name: 'TikTok',    file: 'tiktok.png',     href: 'https://tiktok.com' },
  { name: 'LinkedIn',  file: 'linkedin.webp',  href: 'https://linkedin.com' },
  { name: 'Facebook',  file: 'facebook.png',   href: 'https://facebook.com' },
]
</script>

<template>
  <footer class="footer" :style="{ backgroundImage: `url(${currentLogoBg})` }">

    <!-- Nav 4 liens principaux -->
    <nav class="footer__nav" aria-label="Navigation footer">
      <NuxtLink to="/evenementiel" class="footer__nav-link">Événementiel</NuxtLink>
      <NuxtLink to="/commercial"   class="footer__nav-link">Commercial</NuxtLink>
      <NuxtLink to="/a-propos"     class="footer__nav-link">À propos</NuxtLink>
      <NuxtLink to="/contact"      class="footer__nav-link">Contact</NuxtLink>
    </nav>

    <!-- GET IN TOUCH avec O remplacé par le logo -->
    <div class="footer__bottom">
      <NuxtLink to="/contact" class="footer__cta" aria-label="Nous contacter">
        <span>GET IN T</span><img :src="currentLogo" alt="" class="footer__cta-logo" aria-hidden="true" /><span>UCH</span>
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
            <img :src="`/icons/${s.file}`" :alt="s.name" class="footer__social-icon" />
          </a>
        </div>
        <a href="mailto:1lifeprod@unlockcollectif.com" class="footer__email">
          1lifeprod@unlockcollectif.com
        </a>
      </div>

      <!-- Localisation -->
      <p class="footer__location">France,<br>Paris</p>
    </div>

  </footer>
</template>
