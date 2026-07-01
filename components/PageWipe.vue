<script setup lang="ts">
/**
 * Volet cinématique de transition entre les pages.
 * Un panneau noir balaie l'écran de gauche à droite : il couvre l'ancienne page
 * (pendant que le contenu se substitue dessous), puis se retire pour révéler la
 * nouvelle. Piloté par usePageWipe() depuis le plugin page-wipe.client.ts.
 */
const phase = useWipePhase()
</script>

<template>
  <Teleport to="body">
    <div class="wipe" :class="`wipe--${phase}`" aria-hidden="true" />
  </Teleport>
</template>

<style scoped>
.wipe {
  position: fixed;
  inset: 0;
  z-index: 9998; /* au-dessus du site, sous le loader (99999) */
  background: var(--bg);
  transform: translateX(-100%); /* au repos : hors écran à gauche */
  pointer-events: none;
  will-change: transform;
}

/* Couvre l'écran : entre par la gauche */
.wipe--cover {
  transform: translateX(0);
  transition: transform 0.38s var(--ease);
  pointer-events: auto;
}

/* Révèle la nouvelle page : sort par la droite */
.wipe--reveal {
  transform: translateX(100%);
  transition: transform 0.42s var(--ease);
  pointer-events: auto;
}

/* idle : retour instantané hors écran à gauche (jump invisible, tout est hors champ) */

@media (prefers-reduced-motion: reduce) {
  .wipe { transition: none !important; }
}
</style>
