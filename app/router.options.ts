import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig> {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // Ancres de sous-catégories (/live#captation-multicam…) : scroll vers la
    // section (scroll-margin-top compense le header fixe en CSS). Résolution
    // différée : au chargement/hydratation, la cible n'existe pas encore quand
    // le router scrolle — on attend que l'élément soit rendu.
    if (to.hash) {
      return new Promise((resolve) => {
        const started = Date.now()
        const tryScroll = () => {
          if (document.querySelector(to.hash)) {
            resolve({ el: to.hash, behavior: 'smooth' })
          } else if (Date.now() - started > 2000) {
            resolve({ top: 0, left: 0 })
          } else {
            setTimeout(tryScroll, 100)
          }
        }
        tryScroll()
      })
    }
    return { top: 0, left: 0 }
  },
}
