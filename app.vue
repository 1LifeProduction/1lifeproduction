<script setup lang="ts">
const pageTheme = useState<'dark' | 'light'>('pageTheme', () => 'dark')

/* Canonical + og:url ABSOLUS pour chaque page, calculés sur route.path :
   les query params (/contact?type=live, /evenementiel?category=…) sont donc
   ignorés → Google ne peut pas indexer ces variantes comme des doublons.
   `key: 'canonical'` permet aux stubs de redirection (/a-propos, /commercial)
   de surcharger vers leur page cible. */
const SITE_URL = 'https://1lifeproduction.com'
const route = useRoute()
const canonical = computed(() => {
  const path = route.path.replace(/\/+$/, '')
  return `${SITE_URL}${path || '/'}`
})

useHead({
  bodyAttrs: computed(() => ({
    class: pageTheme.value === 'light' ? 'theme-light' : '',
  })),
  link: [{ rel: 'canonical', key: 'canonical', href: canonical }],
  meta: [{ property: 'og:url', content: canonical }],
})
</script>

<template>
  <div class="app">
    <!-- Écran de chargement (recréation CSS du videoLoader) -->
    <AppLoader />
    <!-- Volet cinématique de transition entre les pages -->
    <PageWipe />
    <!-- Grille de fond unique pour tout le site (uniforme, fixe) -->
    <div class="site-grid" aria-hidden="true"></div>
    <TheHeader />
    <main>
      <NuxtPage />
    </main>
    <TheFooter />
  </div>
</template>
