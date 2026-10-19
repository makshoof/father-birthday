import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  r: number
  color: string
}

type Props = {
  active: boolean
  heart?: boolean
  className?: string
}

function heartPoint(t: number, scale: number) {
  const x = 16 * Math.sin(t) ** 3
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t)
  return { x: x * scale, y: -y * scale }
}

export function Fireworks({ active, heart = true, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let raf = 0
    const particles: Particle[] = []
    let burstTimer = 0
    let heartDone = false

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawnBurst = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2
        const speed = 1.2 + Math.random() * 3.4
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          max: 50 + Math.random() * 40,
          r: 1.2 + Math.random() * 1.8,
          color: Math.random() > 0.25 ? '#E8C778' : '#FFF7E8',
        })
      }
    }

    const spawnHeart = () => {
      const cx = width / 2
      const cy = height * 0.46
      const scale = Math.min(width, height) / 90
      for (let i = 0; i < 180; i += 1) {
        const t = (i / 180) * Math.PI * 2
        const p = heartPoint(t, scale)
        particles.push({
          x: cx,
          y: cy,
          vx: p.x / 28,
          vy: p.y / 28,
          life: 0,
          max: 90,
          r: 1.6,
          color: i % 5 === 0 ? '#FFF7E8' : '#E8C778',
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      burstTimer += 1

      if (!reduced && burstTimer % 28 === 0 && burstTimer < 180) {
        spawnBurst(
          width * (0.2 + Math.random() * 0.6),
          height * (0.18 + Math.random() * 0.3),
          46,
        )
      }

      if (heart && !heartDone && burstTimer === 70) {
        spawnHeart()
        heartDone = true
      }

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i]
        p.life += 1
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.02
        const t = 1 - p.life / p.max
        if (t <= 0) {
          particles.splice(i, 1)
          continue
        }
        ctx.globalAlpha = Math.max(0, t)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    resize()
    spawnBurst(width / 2, height * 0.38, reduced ? 24 : 70)
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [active, heart, reduced])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className ?? ''}`}
      aria-hidden="true"
    />
  )
}
