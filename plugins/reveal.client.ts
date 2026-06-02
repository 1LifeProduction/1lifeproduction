export default defineNuxtPlugin((nuxtApp) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  )

  const observeAll = () => {
    nextTick(() => {
      document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(el => {
        observer.observe(el)
      })
    })
  }

  nuxtApp.hook('page:finish', observeAll)
  observeAll()
})
