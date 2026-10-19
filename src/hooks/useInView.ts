import { useEffect, useRef, useState } from 'react'

export function useInView<T extends Element>(margin = '120px') {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { rootMargin: margin, threshold: 0.08 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [margin])

  return { ref, inView }
}
