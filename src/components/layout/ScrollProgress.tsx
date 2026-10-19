import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setValue(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-[2px] bg-transparent">
      <div
        className="h-full origin-left bg-gold"
        style={{ transform: `scaleX(${value})` }}
      />
    </div>
  )
}
