<script setup lang="ts">
const pageTheme = useState<'dark' | 'light'>('pageTheme', () => 'dark')
useHead({
  bodyAttrs: computed(() => ({
    class: pageTheme.value === 'light' ? 'theme-light' : '',
  })),
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
