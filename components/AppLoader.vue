<script setup lang="ts">
/**
 * Écran de chargement — recréation CSS du videoLoader.mov (aucun média chargé).
 * Séquence :
 *   1. un cluster de cercles pleins tourne dans le sens des aiguilles autour du centre ;
 *   2. les cercles sont aimantés au centre un par un, du plus petit au plus grand.
 * Puis fondu de sortie. Uniquement transform/opacity → animations GPU.
 */

// Durée de la séquence avant le fondu (rotation + aimantation de tous les cercles).
// Doit rester >= au plus grand --md (délai d'aimantation) + 0.7s.
const SEQUENCE_MS = 4300

const exiting = ref(false)
const hidden  = ref(false)

onMounted(() => {
  setTimeout(() => {
    exiting.value = true
    setTimeout(() => { hidden.value = true }, 700) // = durée du fondu
  }, SEQUENCE_MS)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="!hidden"
      class="ldr"
      :class="{ 'ldr--exit': exiting }"
      role="status"
      aria-label="Chargement"
    >
      <div class="ldr__cluster">
        <span
          v-for="n in 6"
          :key="n"
          class="ldr__orb"
          :class="`ldr__orb--${n}`"
          aria-hidden="true"
        />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* ── Overlay ─────────────────────────────────────────── */
.ldr {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.7s ease;
}
.ldr--exit {
  opacity: 0;
  pointer-events: none;
}

/* ── Cluster : tourne dans le sens des aiguilles ─────── */
.ldr__cluster {
  position: relative;
  width: 0;
  height: 0;
  animation: ldr-spin 2.4s linear infinite;
}
@keyframes ldr-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); } /* clockwise (y vers le bas) */
}

/* ── Cercles (contours fins) en orbite, centre vide ──── */
.ldr__orb {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--d);
  height: var(--d);
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.12);
  /* position sur l'orbite = centre + décalage (--x,--y) ; aucun cercle au centre */
  transform: translate(-50%, -50%) translate(var(--x), var(--y));
  /* aimantation vers le centre, jouée une fois après --md (mouvement vif, aspiré) */
  animation: ldr-magnet 0.42s cubic-bezier(0.5, 0, 0.85, 0.25) var(--md) forwards;
}
/* Le cercle est attiré au centre (0,0) et s'y empile (il ne disparaît pas). */
@keyframes ldr-magnet {
  to {
    transform: translate(-50%, -50%) translate(0, 0);
  }
}

/* Taille (--d), position de départ (--x,--y) et instant d'aimantation (--md).
   Cercles rangés du plus petit (--1) au plus grand (--6), en ordre autour
   de l'orbite (sens des aiguilles depuis le haut). Aimantés dans le même ordre :
   ils s'empilent au centre en cercles concentriques (du plus petit au plus grand). */
.ldr__orb--1 { --d: 10px; --x:   0px; --y: -78px; --md: 2.0s; }
.ldr__orb--2 { --d: 18px; --x:  68px; --y: -39px; --md: 2.28s; }
.ldr__orb--3 { --d: 26px; --x:  68px; --y:  39px; --md: 2.56s; }
.ldr__orb--4 { --d: 36px; --x:   0px; --y:  78px; --md: 2.84s; }
.ldr__orb--5 { --d: 48px; --x: -68px; --y:  39px; --md: 3.12s; }
.ldr__orb--6 { --d: 60px; --x: -68px; --y: -39px; --md: 3.4s; }

/* ── Accessibilité : prefers-reduced-motion ──────────── */
@media (prefers-reduced-motion: reduce) {
  .ldr__cluster { animation: none; }
  .ldr__orb { animation: none; }
}
</style>
