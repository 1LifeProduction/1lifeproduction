<script setup lang="ts">
import logoImg      from '~/assets/images/logo.png'
import logoBlackImg from '~/assets/images/logoBlack.png'
import { CATEGORIES, categoryHref } from '~/data/categories'

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

const menuOpen     = ref(false)
const openDropdown = ref<string | null>(null)

/* Nav construite depuis la source de vérité (data/categories.ts) */
const nav = [
  ...CATEGORIES.map(g => ({
    label:    g.label,
    href:     `/${g.section}`,
    key:      g.section,
    children: g.children.map(c => ({
      label: c.label,
      href:  categoryHref(g.section, c.slug),
    })),
  })),
  { label: 'À propos', href: '/a-propos', key: 'a-propos', children: undefined as undefined | { label: string; href: string }[] },
  { label: 'Contact',  href: '/contact',  key: 'contact',  children: undefined },
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
  if (!menuOpen.value) openDropdown.value = null
}

function toggleDropdown(key: string) {
  openDropdown.value = openDropdown.value === key ? null : key
}

function handleNavClick(e: Event, item: typeof nav[0]) {
  if (menuOpen.value && item.children) {
    e.preventDefault()
    toggleDropdown(item.key)
  }
}

function isActive(href: string) {
  return route.path === href || route.path.startsWith(href + '/')
}

watch(() => route.fullPath, () => {
  menuOpen.value     = false
  openDropdown.value = null
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
              :class="{ 'is-active': isActive(item.href), 'has-children': !!item.children }"
              :aria-current="isActive(item.href) ? 'page' : undefined"
              @click="item.children ? handleNavClick($event, item) : undefined"
            >
              {{ item.label }}
              <svg
                v-if="item.children"
                class="header__chevron"
                :class="{ 'is-open': openDropdown === item.key }"
                viewBox="0 0 10 6" width="10" height="6" aria-hidden="true"
              >
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </NuxtLink>

            <!-- Dropdown desktop (au survol) / Accordéon mobile (au clic) -->
            <ul
              v-if="item.children"
              class="header__dropdown"
              :class="{ 'is-open': openDropdown === item.key }"
            >
              <li v-for="child in item.children" :key="child.href">
                <NuxtLink :to="child.href" class="header__dropdown-link">
                  {{ child.label }}
                </NuxtLink>
              </li>
            </ul>
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
