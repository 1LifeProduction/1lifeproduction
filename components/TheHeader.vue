<script setup lang="ts">
import logoImg      from '~/assets/images/logo.png'
import logoBlackImg from '~/assets/images/logoBlack.png'

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

const nav = [
  {
    label: 'Événementiel',
    href:  '/evenementiel',
    key:   'evenementiel',
    children: [
      { label: 'Captations',  href: '/evenementiel?category=captations' },
      { label: 'Afterfilms',  href: '/evenementiel?category=afterfilms' },
      { label: 'Reportages',  href: '/evenementiel?category=reportages' },
      { label: 'Livestreams', href: '/evenementiel?category=livestreams' },
      { label: 'Interviews',  href: '/evenementiel?category=interviews' },
    ],
  },
  {
    label: 'Commercial',
    href:  '/commercial',
    key:   'commercial',
    children: [
      { label: 'Produits',   href: '/commercial?category=produits' },
      { label: 'Films',      href: '/commercial?category=films' },
      { label: 'Publicités', href: '/commercial?category=publicites' },
      { label: 'Podcasts',   href: '/commercial?category=podcasts' },
      { label: 'Portraits',  href: '/commercial?category=portraits' },
    ],
  },
  { label: 'À propos', href: '/a-propos', key: 'a-propos' },
  { label: 'Contact',  href: '/contact',  key: 'contact' },
]

/* ---- Panel column alignment ---- */
const navListRef = ref<HTMLElement>()
const colStyles  = ref(nav.map(() => ({ left: '0px' })))

function alignCols() {
  const list = navListRef.value
  if (!list) return
  const items = list.querySelectorAll<HTMLElement>(':scope > li > a')
  items.forEach((el, i) => {
    const rect    = el.getBoundingClientRect()
    const padding = parseFloat(getComputedStyle(el).paddingLeft)
    // align with the text inside the link, not the box edge
    colStyles.value[i] = { left: `${rect.left + padding}px` }
  })
}

onMounted(() => {
  nextTick(alignCols)
  window.addEventListener('resize', alignCols)

  nextTick(updateNavTheme)
  window.addEventListener('scroll', updateNavTheme, { passive: true })
  window.addEventListener('resize', updateNavTheme, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('resize', alignCols)
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
        <ul ref="navListRef" class="header__nav-list">
          <li
            v-for="item in nav"
            :key="item.key"
            class="header__nav-item"
          >
            <NuxtLink
              :to="item.href"
              class="header__nav-link"
              :class="{ 'is-active': isActive(item.href) }"
              @click="item.children ? handleNavClick($event, item) : undefined"
            >
              {{ item.label }}
            </NuxtLink>

            <!-- Mobile accordion -->
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

    <!-- Mega panel: columns absolutely positioned under their nav link -->
    <div class="header__panel" aria-hidden="true">
      <div
        v-for="(item, i) in nav"
        :key="`panel-${item.key}`"
        v-show="item.children"
        class="header__panel__col"
        :style="colStyles[i]"
      >
        <ul class="header__panel__links">
          <li v-for="child in item.children" :key="child.href">
            <NuxtLink :to="child.href" class="header__panel__link">
              {{ child.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

  </header>
</template>
