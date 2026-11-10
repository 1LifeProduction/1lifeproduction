<script setup lang="ts">
/* Lecteur vidéo universel : accepte les URLs Vimeo ET YouTube.
   (Le nom du composant et le champ vimeo_url du JSON sont historiques —
   on peut y coller n'importe quel lien des deux plateformes.)
   Formats reconnus :
   - vimeo.com/123456789
   - youtube.com/watch?v=ID · youtu.be/ID · youtube.com/shorts/ID · youtube.com/embed/ID
   - youtube.com/playlist?list=ID (playlist : lecteur avec la liste des épisodes)

   UNE SEULE VIDÉO À LA FOIS : chaque lecteur s'enregistre dans un registre
   global ; quand l'un d'eux démarre (événement reçu par postMessage), tous
   les autres sont mis en pause (API postMessage YouTube / Vimeo). */
const props = defineProps<{
  url: string
  title?: string
}>()

type Kind = 'youtube' | 'vimeo'

const kind = computed<Kind | null>(() => {
  if (/vimeo\.com\/\d+/.test(props.url)) return 'vimeo'
  if (/youtu\.?be/.test(props.url)) return 'youtube'
  return null
})

const embedUrl = computed(() => {
  const vimeo = props.url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) {
    return `https://player.vimeo.com/video/${vimeo[1]}?badge=0&autopause=0&player_id=0&app_id=58479`
  }
  const youtube = props.url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  )
  /* youtube-nocookie : pas de cookies de tracking tant qu'on ne lance pas la
     lecture. enablejsapi : nécessaire pour recevoir "lecture démarrée" et
     envoyer "pause" aux autres lecteurs. */
  if (youtube) {
    return `https://www.youtube-nocookie.com/embed/${youtube[1]}?enablejsapi=1`
  }
  const playlist = props.url.match(/[?&]list=([A-Za-z0-9_-]+)/)
  if (playlist) {
    return `https://www.youtube-nocookie.com/embed?listType=playlist&list=${playlist[1]}&enablejsapi=1`
  }
  return null
})

/* ---- Registre global des lecteurs (partagé par toutes les instances) ---- */
interface Player { el: HTMLIFrameElement; kind: Kind }
const players: Set<Player> = ((globalThis as any).__oneLifePlayers ??= new Set<Player>())

function pause(p: Player) {
  const w = p.el.contentWindow
  if (!w) return
  if (p.kind === 'youtube') w.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*')
  else w.postMessage(JSON.stringify({ method: 'pause' }), '*')
}

function pauseOthers(source: Window | null) {
  for (const p of players) if (p.el.contentWindow !== source) pause(p)
}

/* Un seul écouteur "message" pour toute la page */
function onMessage(e: MessageEvent) {
  if (typeof e.data !== 'string') return
  if (!/youtube|vimeo/.test(e.origin)) return
  let d: any
  try { d = JSON.parse(e.data) } catch { return }
  const ytPlaying =
    (d.event === 'onStateChange' && d.info === 1) ||
    (d.event === 'infoDelivery' && d.info?.playerState === 1)
  const vimeoPlaying = d.event === 'play'
  if (ytPlaying || vimeoPlaying) pauseOthers(e.source as Window)
}
if (import.meta.client && !(globalThis as any).__oneLifePlayersListening) {
  (globalThis as any).__oneLifePlayersListening = true
  window.addEventListener('message', onMessage)
}

/* ---- Instance ---- */
const iframe = ref<HTMLIFrameElement>()
let me: Player | null = null

/* Demande au lecteur de nous envoyer ses événements (lecture, etc.) */
function subscribe() {
  const w = iframe.value?.contentWindow
  if (!w || !me) return
  if (me.kind === 'youtube') w.postMessage(JSON.stringify({ event: 'listening', id: 'onelife' }), '*')
  else w.postMessage(JSON.stringify({ method: 'addEventListener', value: 'play' }), '*')
}

onMounted(() => {
  if (!iframe.value || !kind.value) return
  me = { el: iframe.value, kind: kind.value }
  players.add(me)
  iframe.value.addEventListener('load', subscribe)
})
onUnmounted(() => {
  if (me) players.delete(me)
})
</script>

<template>
  <div class="vimeo-embed">
    <iframe
      v-if="embedUrl"
      ref="iframe"
      :src="embedUrl"
      :title="title ?? 'Vidéo'"
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
      referrerpolicy="strict-origin-when-cross-origin"
      loading="lazy"
      allowfullscreen
    ></iframe>
    <div v-else class="vimeo-embed__error">
      URL vidéo invalide (Vimeo ou YouTube attendu)
    </div>
  </div>
</template>
