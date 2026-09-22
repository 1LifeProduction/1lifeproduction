export default defineNuxtPlugin((nuxtApp) => {
  // Respect de prefers-reduced-motion : aucune animation de volet.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const phase  = useWipePhase()
  const router = useRouter()

  const COVER_MS  = 380  // durée pour couvrir l'écran (= transition .wipe--cover)
  const REVEAL_MS = 420  // durée pour révéler la page  (= transition .wipe--reveal)
  const SAFETY_MS = 1200 // filet de sécurité si page:finish ne se déclenche pas

  let idleTimer:   ReturnType<typeof setTimeout> | null = null
  let safetyTimer: ReturnType<typeof setTimeout> | null = null

  // Retire le volet pour révéler la nouvelle page, puis réarme.
  const reveal = () => {
    if (phase.value !== 'cover') return
    if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null }
    phase.value = 'reveal'
    if (idleTimer) clearTimeout(idleTimer)
    idleTimer = setTimeout(() => { phase.value = 'idle' }, REVEAL_MS)
  }

  router.beforeEach(async (to, from) => {
    if (!from.matched.length) return   // tout premier rendu → géré par le loader
    // Même page (changement de filtre/query/ancre) : PAS de volet.
    // La page n'est pas remontée, donc page:finish ne se redéclenche pas :
    // déclencher le volet ici le laisserait bloqué en position « couvre ».
    if (to.path === from.path) return

    phase.value = 'cover'
    // On attend que le volet couvre l'écran avant de laisser la page se substituer dessous.
    await new Promise(resolve => setTimeout(resolve, COVER_MS))

    // Retour en haut PENDANT que le volet couvre l'écran (saut invisible) :
    // la nouvelle page se monte donc déjà à scrollY = 0. Sans ça elle
    // apparaissait à la hauteur de scroll de l'ancienne page puis remontait,
    // ce qui déclenchait d'un coup toutes les animations d'apparition.
    // (Retour arrière : le router restaure ensuite la position sauvegardée.)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    // Filet de sécurité : si page:finish ne se déclenche pas (page réutilisée,
    // ex. changement de param sur une route dynamique), on révèle malgré tout.
    if (safetyTimer) clearTimeout(safetyTimer)
    safetyTimer = setTimeout(reveal, SAFETY_MS)
  })

  // Cas normal : nouvelle page montée → on révèle dès que le contenu est prêt.
  nuxtApp.hook('page:finish', reveal)
})
