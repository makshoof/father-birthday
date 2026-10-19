let audio: HTMLAudioElement | null = null

export function getSharedAudio() {
  if (!audio) {
    audio = new Audio()
    audio.preload = 'metadata'
    audio.loop = true
  }
  return audio
}

export function playTrackFile(file: string) {
  const el = getSharedAudio()
  const next = new URL(`/audio/${file}`, window.location.href).href
  if (el.src !== next) {
    el.src = next
    el.load()
  }
  return el.play()
}
