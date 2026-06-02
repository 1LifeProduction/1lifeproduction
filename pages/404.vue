<script setup lang="ts">
useHead({
  title: '1LIFE PRODUCTION',
  meta: [{ name: 'robots', content: 'noindex' }],
})
</script>

<template>
  <div class="not-found">
    <div class="not-found__inner">
      <p class="not-found__code">404</p>
      <h1 class="not-found__title">Page introuvable</h1>
      <p class="not-found__desc">Cette page n'existe pas ou a été déplacée.</p>
      <NuxtLink to="/" class="not-found__back">Retour à l'accueil</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg);
}

.not-found__inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.not-found__code {
  font-family: 'Coolvetica', sans-serif;
  font-size: clamp(6rem, 20vw, 14rem);
  line-height: 1;
  color: var(--border-light);
  letter-spacing: -0.04em;
}

.not-found__title {
  font-family: 'Coolvetica', sans-serif;
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--text);
}

.not-found__desc {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  font-weight: 300;
  color: var(--text-muted);
  max-width: 300px;
  line-height: 1.6;
}

.not-found__back {
  margin-top: 0.5rem;
  display: inline-block;
  padding: 0.75rem 2rem;
  border: 1px solid var(--border-light);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text);
  text-decoration: none;
  transition: border-color 0.25s, color 0.25s;
}

.not-found__back:hover {
  border-color: var(--text);
}
</style>
