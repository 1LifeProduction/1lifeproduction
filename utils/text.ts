/** Convertit la mini-syntaxe **gras** des fichiers content/*.json en HTML.
    Utilisé avec v-html sur des textes édités par le client (repo statique). */
export function boldify(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}
