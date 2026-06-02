<script setup lang="ts">
const phase  = ref(0) // 0=spinning | 1=converge | 2=logo | 3=exit
const hidden = ref(false)

onMounted(() => {
  const MIN_MS = 1600
  const t0 = Date.now()

  const proceed = () => {
    const wait = Math.max(0, MIN_MS - (Date.now() - t0))
    setTimeout(() => {
      phase.value = 1
      setTimeout(() => {
        phase.value = 3
        setTimeout(() => { hidden.value = true }, 600)
      }, 500)
    }, wait)
  }

  if (document.readyState === 'complete') proceed()
  else window.addEventListener('load', proceed, { once: true })
})
</script>

<template>
  <Teleport to="body">
    <div v-if="!hidden" class="ldr" :class="`ldr--p${phase}`" aria-hidden="true">

      <!-- Orbiting circles: outer = position, inner = ring + scale pulse -->
      <div class="ldr__orbs">
        <div v-for="n in 6" :key="n" :class="`ldr__orb ldr__orb--${n}`">
          <div class="ldr__ring" />
        </div>
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
  transition: opacity 0.6s ease;
}
.ldr--p3 {
  opacity: 0;
  pointer-events: none;
}

/* ── Orb cluster (rotates as a unit — counter-clockwise) ─ */
.ldr__orbs {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  animation: ldr-spin 1.2s linear infinite;
}
.ldr--p1 .ldr__orbs,
.ldr--p2 .ldr__orbs,
.ldr--p3 .ldr__orbs {
  animation-play-state: paused;
}

@keyframes ldr-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
}

/* ── Orb wrapper: position + fade-out ────────────────── */
.ldr__orb {
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.55s ease;
}

.ldr__orb--1 { transform: translate(calc(-50% - 68px), calc(-50% + 30px)); }
.ldr__orb--2 { transform: translate(calc(-50% - 25px), calc(-50% - 80px)); }
.ldr__orb--3 { transform: translate(calc(-50% + 58px), calc(-50% - 72px)); }
.ldr__orb--4 { transform: translate(calc(-50% + 92px), calc(-50% +  8px)); }
.ldr__orb--5 { transform: translate(calc(-50% + 54px), calc(-50% + 85px)); }
.ldr__orb--6 { transform: translate(calc(-50% - 18px), calc(-50% + 115px)); }

/* Fade out smallest → largest, staggered via wrapper opacity */
.ldr--p1 .ldr__orb--6,
.ldr--p2 .ldr__orb--6,
.ldr--p3 .ldr__orb--6 { opacity: 0; transition-delay:   0ms; }

.ldr--p1 .ldr__orb--5,
.ldr--p2 .ldr__orb--5,
.ldr--p3 .ldr__orb--5 { opacity: 0; transition-delay:  70ms; }

.ldr--p1 .ldr__orb--4,
.ldr--p2 .ldr__orb--4,
.ldr--p3 .ldr__orb--4 { opacity: 0; transition-delay: 140ms; }

.ldr--p1 .ldr__orb--3,
.ldr--p2 .ldr__orb--3,
.ldr--p3 .ldr__orb--3 { opacity: 0; transition-delay: 210ms; }

.ldr--p1 .ldr__orb--2,
.ldr--p2 .ldr__orb--2,
.ldr--p3 .ldr__orb--2 { opacity: 0; transition-delay: 280ms; }

.ldr--p1 .ldr__orb--1,
.ldr--p2 .ldr__orb--1,
.ldr--p3 .ldr__orb--1 { opacity: 0; transition-delay: 350ms; }

/* ── Ring: the visible circle + scale pulse ──────────── */
.ldr__ring {
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.82);
  animation: ldr-pulse 1.2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}

/* Sizes */
.ldr__orb--1 .ldr__ring { width: 100px; height: 100px; animation-delay:    0s; }
.ldr__orb--2 .ldr__ring { width:  75px; height:  75px; animation-delay: -0.2s; }
.ldr__orb--3 .ldr__ring { width:  60px; height:  60px; animation-delay: -0.4s; }
.ldr__orb--4 .ldr__ring { width:  47px; height:  47px; animation-delay: -0.6s; }
.ldr__orb--5 .ldr__ring { width:  36px; height:  36px; animation-delay: -0.8s; }
.ldr__orb--6 .ldr__ring { width:  16px; height:  16px; animation-delay: -1.0s; }

/* Grow → shrink wave tied to orbital period */
@keyframes ldr-pulse {
  0%, 100% { transform: scale(0.55); opacity: 0.45; }
  50%       { transform: scale(1.4);  opacity: 1;   }
}

</style>
