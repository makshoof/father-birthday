import { useSyncExternalStore } from 'react'

let cached: boolean | null = null

function detectWebGL() {
  if (cached !== null) return cached
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false })
    cached = Boolean(gl)
    const ext = gl && 'getExtension' in gl ? gl.getExtension('WEBGL_lose_context') : null
    ext?.loseContext()
  } catch {
    cached = false
  }
  return cached
}

export function useWebGL() {
  return useSyncExternalStore(
    () => () => undefined,
    detectWebGL,
    () => true,
  )
}

export function getLowPowerGpu() {
  if (typeof navigator === 'undefined') return false
  const cores = navigator.hardwareConcurrency || 8
  const saveData = Boolean(
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData,
  )
  return cores <= 4 || saveData
}
