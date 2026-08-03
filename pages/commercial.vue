<script setup lang="ts">
/* Ancienne URL /commercial — la section a été remplacée par /marque.
   Stub de redirection conservé pour les liens externes/indexés. */
useHead({ meta: [{ name: 'robots', content: 'noindex' }] })

if (import.meta.client) {
  navigateTo('/marque', { replace: true })
}
</script>

<template>
  <div />
</template>
