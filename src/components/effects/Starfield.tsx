import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

type Star = {
  x: number
  y: number
  r: number
  tw: number
  sp: number
  gold: boolean
}

type Dust = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
}

type Props = {
  className?: string
  density?: number
  converge?: boolean
}

export function Starfield({ className, density = 1, converge = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()
  const convergeRef = useRef(converge)

  useEffect(() => {
    convergeRef.current = converge
  }, [converge])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let raf = 0
    let stars: Star[] = []
    let dust: Dust[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const starCount = Math.floor((reduced ? 36 : 80) * density)
      const dustCount = Math.floor((reduced ? 8 : 22) * density)
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.3,
        tw: Math.random() * Math.PI * 2,
        sp: 0.008 + Math.random() * 0.02,
        gold: Math.random() > 0.82,
      }))
      dust = Array.from({ length: dustCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.08 - Math.random() * 0.16,
        r: Math.random() * 1.8 + 0.4,
        a: 0.15 + Math.random() * 0.35,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      const g = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        40,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.7,
      )
      g.addColorStop(0, 'rgba(16, 27, 61, 0.35)')
      g.addColorStop(1, 'rgba(7, 11, 27, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, width, height)

      for (const star of stars) {
        star.tw += star.sp
        const alpha = reduced ? 0.7 : 0.35 + Math.sin(star.tw) * 0.35
        ctx.beginPath()
        ctx.fillStyle = star.gold
          ? `rgba(232, 199, 120, ${Math.max(0.15, alpha)})`
          : `rgba(255, 247, 232, ${Math.max(0.12, alpha)})`
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fill()
      }

      const cx = width / 2
      const cy = height / 2
      for (const p of dust) {
        if (convergeRef.current) {
          p.x += (cx - p.x) * 0.045
          p.y += (cy - p.y) * 0.045
          p.a *= 0.97
        } else {
          p.x += p.vx
          p.y += p.vy
          if (p.y < -10) {
            p.y = height + 10
            p.x = Math.random() * width
          }
          if (p.x < -10) p.x = width + 10
          if (p.x > width + 10) p.x = -10
        }
        ctx.beginPath()
        ctx.fillStyle = `rgba(232, 199, 120, ${p.a})`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [density, reduced])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  )
}
