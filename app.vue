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
    <TheHeader />
    <main>
      <NuxtPage />
    </main>
    <TheFooter />
  </div>
</template>
