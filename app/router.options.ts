import type { RouterConfig } from '@nuxt/schema'

/* Scroll entre les pages.
   - behavior 'instant' PARTOUT : html a scroll-behavior:smooth en CSS ; sans
     ça, le retour en haut se faisait en défilement animé, visible sur la
     nouvelle page (« ça me met à la même hauteur puis ça remonte ») et
     déclenchait au passage toutes les animations d'apparition.
   - Le retour en haut est en fait déjà fait PENDANT que le volet couvre
     l'écran (plugins/page-wipe.client.ts) : ici on ne fait que le confirmer.
   - Retour arrière (savedPosition) : on attend que la nouvelle page soit
     montée (page:finish) pour restaurer la position, sinon la page n'a pas
     encore sa hauteur et le scroll est tronqué. */
export default <RouterConfig> {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      const nuxtApp = useNuxtApp()
      return new Promise((resolve) => {
        nuxtApp.hooks.hookOnce('page:finish', () => {
          setTimeout(() => resolve({ ...savedPosition, behavior: 'instant' }), 0)
        })
      })
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
            resolve({ top: 0, left: 0, behavior: 'instant' })
          } else {
            setTimeout(tryScroll, 100)
          }
        }
        tryScroll()
      })
    }
    return { top: 0, left: 0, behavior: 'instant' }
  },
}
