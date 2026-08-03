<script setup lang="ts">
/* Ancienne URL /a-propos — la page est devenue /equipe.
   Stub de redirection conservé pour les liens externes/indexés. */
useHead({ meta: [{ name: 'robots', content: 'noindex' }] })

if (import.meta.client) {
  navigateTo('/equipe', { replace: true })
}
</script>

<template>
  <div />
</template>
