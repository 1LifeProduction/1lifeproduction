export default defineNuxtPlugin((nuxtApp) => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        io.unobserve(entry.target)
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
