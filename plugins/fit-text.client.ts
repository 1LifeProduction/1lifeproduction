/**
 * Réduit la taille de police des éléments [data-fit-text] pour qu'ils tiennent
 * TOUJOURS sur une seule ligne. La taille définie en CSS (clamp) sert de borne
 * haute ; si le texte déborde, on diminue proportionnellement jusqu'à ce qu'il
 * rentre dans la largeur disponible. Suppose `white-space: nowrap` côté CSS.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const fit = (el: HTMLElement) => {
    if (!el.isConnected) return
    // Repartir de la taille CSS (borne haute / désirée)
    el.style.fontSize = ''
    // Si le CSS autorise le retour à la ligne (mobile), on laisse le texte
    // break naturellement : pas d'ajustement sur une seule ligne.
    if (getComputedStyle(el).whiteSpace !== 'nowrap') return
    const avail = el.clientWidth          // largeur dispo (content-box)
    if (avail === 0) return
    const textW = el.scrollWidth          // largeur réelle du texte (nowrap)
    if (textW > avail) {
      const desired = parseFloat(getComputedStyle(el).fontSize)
      el.style.fontSize = `${desired * (avail / textW)}px`
    }
  }

  let raf = 0
  const fitAll = () => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>('[data-fit-text]').forEach(fit)
    })
  }

  // On observe le PARENT (sa largeur ne dépend pas de la police de l'enfant)
  // pour éviter toute boucle de redimensionnement.
  const ro = new ResizeObserver(fitAll)

  const register = () => {
    document.querySelectorAll<HTMLElement>('[data-fit-text]').forEach(el => {
      const parent = el.parentElement
      if (parent && !parent.dataset.fitObserved) {
        parent.dataset.fitObserved = '1'
        ro.observe(parent)
      }
      fit(el)
    })
  }

  nuxtApp.hook('page:finish', () => nextTick(register))
  nextTick(register)

  // Nouveaux éléments injectés (v-if, navigation, filtres…)
  const mo = new MutationObserver(fitAll)
  mo.observe(document.body, { childList: true, subtree: true })

  window.addEventListener('resize', fitAll, { passive: true })

  // Les métriques changent une fois la police Coolvetica chargée
  if (document.fonts?.ready) document.fonts.ready.then(fitAll)
})
