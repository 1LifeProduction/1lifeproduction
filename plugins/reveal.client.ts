export default defineNuxtPlugin((nuxtApp) => {
  const reveal = (el: Element) => {
    el.classList.add('is-visible')
    io.unobserve(el)
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        // On révèle si l'élément entre dans le viewport, MAIS aussi s'il a déjà
        // été dépassé (son haut est repassé au-dessus du bas de l'écran).
        // Sur mobile, un scroll rapide peut faire "sauter" l'IntersectionObserver
        // d'un état hors-écran (bas) à hors-écran (haut) sans rapporter le passage :
        // sans ce second test, l'élément resterait invisible à jamais.
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
          reveal(entry.target)
        }
      })
    },
    // threshold 0 : déclenche dès le 1er pixel entrant (plus fiable que 0.12 sur
    // mobile). rootMargin négatif en bas pour laisser l'élément entrer un peu.
    { threshold: 0, rootMargin: '0px 0px -10% 0px' }
  )

  const observeNew = () => {
    document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(el => {
      io.observe(el)
    })
  }

  // Observe les éléments existants au chargement et après navigation de page entière
  nuxtApp.hook('page:finish', () => nextTick(observeNew))
  nextTick(observeNew)

  // Observe les nouveaux éléments ajoutés dynamiquement (v-if, query params…)
  const mo = new MutationObserver(observeNew)
  mo.observe(document.body, { childList: true, subtree: true })
})
