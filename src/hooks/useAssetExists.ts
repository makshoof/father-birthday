import { useEffect, useState } from 'react'

const cache = new Map<string, boolean>()

export function useAssetExists(url: string | null) {
  const [exists, setExists] = useState<boolean | null>(() => {
    if (!url) return false
    return cache.has(url) ? cache.get(url)! : null
  })

  useEffect(() => {
    if (!url) {
      setExists(false)
      return
    }
    if (cache.has(url)) {
      setExists(cache.get(url)!)
      return
    }

    let cancelled = false
    const img = new Image()
    const onDone = (ok: boolean) => {
      cache.set(url, ok)
      if (!cancelled) setExists(ok)
    }

    if (url.match(/\.(png|jpe?g|webp|gif|svg)$/i)) {
      img.onload = () => onDone(true)
      img.onerror = () => onDone(false)
      img.src = url
    } else {
      fetch(url, { method: 'GET', cache: 'no-store' })
        .then((res) => onDone(res.ok))
        .catch(() => onDone(false))
    }

    return () => {
      cancelled = true
      img.onload = null
      img.onerror = null
    }
  }, [url])

  return exists
}
