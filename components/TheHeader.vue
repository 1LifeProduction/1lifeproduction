<script setup lang="ts">
import logoImg      from '~/assets/images/logo.png'
import logoBlackImg from '~/assets/images/logoBlack.png'
import globalContent from '~/content/global.json'
import { CATEGORIES } from '~/data/categories'

const route = useRoute()

/* ---- Nav theme : détecte la section sous le header au scroll ---- */
const navTheme    = ref<'dark' | 'light'>('dark')
const navHidden   = ref(false)
const currentLogo = computed(() => navTheme.value === 'light' ? logoBlackImg : logoImg)

function updateNavTheme() {
  // Masque la navbar quand le footer occupe ≥ 90 % du viewport
  const footer = document.querySelector<HTMLElement>('.footer')
  if (footer) {
    navHidden.value = footer.getBoundingClientRect().top <= window.innerHeight * 0.1
  }

  const sections = document.querySelectorAll<HTMLElement>('[data-nav-theme]')
  if (!sections.length) { navTheme.value = 'dark'; return }
  const checkY = window.scrollY + 65
  let found: 'dark' | 'light' = 'dark'
  for (const s of sections) {
    if (checkY >= s.offsetTop && checkY < s.offsetTop + s.offsetHeight) {
      found = (s.dataset.navTheme as 'dark' | 'light') || 'dark'
      break
    }
  }
  navTheme.value = found
}

const menuOpen = ref(false)

/* Nav construite depuis la source de vérité (data/categories.ts).
   Pas de dropdown : les sous-catégories sont accessibles depuis la page
   de leur catégorie. */
const nav = [
  ...CATEGORIES.map(g => ({
    label: g.label,
    href:  `/${g.section}`,
    key:   g.section,
  })),
  { label: globalContent.nav.equipe,  href: '/equipe',  key: 'equipe' },
  { label: globalContent.nav.contact, href: '/contact', key: 'contact' },
]

onMounted(() => {
  nextTick(updateNavTheme)
  window.addEventListener('scroll', updateNavTheme, { passive: true })
  window.addEventListener('resize', updateNavTheme, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', updateNavTheme)
  window.removeEventListener('resize', updateNavTheme)
})

watch(() => route.path, () => {
  navTheme.value = 'dark'
  nextTick(updateNavTheme)
})

/* ---- Mobile ---- */
function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function isActive(href: string) {
  return route.path === href || route.path.startsWith(href + '/')
}

watch(() => route.fullPath, () => {
  menuOpen.value = false
})
</script>

<template>
  <header class="header" :class="{ 'header--light': navTheme === 'light', 'header--hidden': navHidden }">
    <div class="header__inner container">

      <NuxtLink to="/" class="header__logo">
        <img :src="currentLogo" alt="" class="header__logo-img" aria-hidden="true" />
        1LIFE PRODUCTION
      </NuxtLink>

      <nav
        class="header__nav"
        :class="{ 'is-open': menuOpen }"
        aria-label="Navigation principale"
      >
        <ul class="header__nav-list">
          <li
            v-for="item in nav"
            :key="item.key"
            class="header__nav-item"
          >
            <NuxtLink
              :to="item.href"
              class="header__nav-link"
              :class="{ 'is-active': isActive(item.href) }"
              :aria-current="isActive(item.href) ? 'page' : undefined"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <button
        class="header__burger"
        :class="{ 'is-active': menuOpen }"
        @click="toggleMenu"
        :aria-expanded="menuOpen"
        aria-label="Menu"
      >
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
</template>
