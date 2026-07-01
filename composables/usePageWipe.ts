export type WipePhase = 'idle' | 'cover' | 'reveal'

/**
 * État global du volet de transition entre les pages.
 *  - idle   : volet hors écran (à gauche)
 *  - cover  : volet glisse pour couvrir l'écran (gauche → centre)
 *  - reveal : volet se retire (centre → droite) pour révéler la nouvelle page
 */
export const useWipePhase = () => useState<WipePhase>('wipePhase', () => 'idle')
