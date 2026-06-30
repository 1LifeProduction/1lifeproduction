export default defineNuxtPlugin((nuxtApp) => {
  const reveal = (el: Element) => {
    el.classList.add('is-visible')
    io.unobserve(el)
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        // isIntersecting = cas normal (élément suffisamment visible).
        // top < 0 = élément déjà DÉPASSÉ (remonté au-dessus du haut de l'écran) :
        // rattrape les scrolls rapides sur mobile où l'IntersectionObserver peut
        // "sauter" le franchissement du seuil → sinon l'élément reste invisible.
        // NB : on n'utilise PAS "top < innerHeight" (ça révélait les éléments dès
        // qu'ils pointaient en bas de l'écran → trop tôt, animation non vue).
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          reveal(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
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
