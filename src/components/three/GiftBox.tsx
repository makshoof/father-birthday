import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import type { Group, Mesh, PointLight } from 'three'
import { GoldMaterial } from './materials'

type GiftBoxProps = {
  open: boolean
  onClick?: () => void
  position?: [number, number, number]
  scale?: number
}

export function GiftBox({
  open,
  onClick,
  position = [0, 0, 0],
  scale = 1,
}: GiftBoxProps) {
  const lid = useRef<Group>(null)
  const ribbon = useRef<Group>(null)
  const glow = useRef<PointLight>(null)
  const inner = useRef<Mesh>(null)
  const group = useRef<Group>(null)
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        angle: (i / 18) * Math.PI * 2,
        speed: 0.4 + (i % 5) * 0.08,
        radius: 0.08 + (i % 4) * 0.04,
      })),
    [],
  )
  const particleRefs = useRef<Mesh[]>([])

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [])

  useFrame((state, delta) => {
    if (group.current && !open) {
      group.current.rotation.y += delta * 0.25
      group.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.9) * 0.05
    }

    if (lid.current) {
      const target = open ? -1.25 : 0
      lid.current.rotation.x += (target - lid.current.rotation.x) * 0.07
    }
    if (ribbon.current) {
      const t = open ? 0 : 1
      ribbon.current.scale.y += (t - ribbon.current.scale.y) * 0.1
      ribbon.current.visible = ribbon.current.scale.y > 0.04
    }
    if (glow.current) {
      const target = open ? 2.4 : 0
      glow.current.intensity += (target - glow.current.intensity) * 0.08
    }
    if (inner.current) {
      const mat = inner.current.material as { opacity: number }
      const target = open ? 0.55 : 0
      mat.opacity += (target - mat.opacity) * 0.08
    }

    particleRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      mesh.visible = open
      if (!open) return
      const spec = particles[i]
      const t = state.clock.elapsedTime * spec.speed
      mesh.position.set(
        Math.cos(spec.angle + t) * spec.radius,
        0.35 + (t % 1.8) * 0.7,
        Math.sin(spec.angle + t) * spec.radius,
      )
      mesh.rotation.y += delta
    })
  })

  return (
    <group
      ref={group}
      position={position}
      scale={scale}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.()
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.9, 0.55, 0.9]} />
        <GoldMaterial roughness={0.24} />
      </mesh>
      <mesh ref={inner} position={[0, 0.28, 0]}>
        <boxGeometry args={[0.78, 0.08, 0.78]} />
        <meshBasicMaterial color="#FFF7E8" transparent opacity={0} />
      </mesh>
      <group ref={ribbon}>
        <mesh position={[0, 0.23, 0]}>
          <boxGeometry args={[0.12, 0.58, 0.92]} />
          <meshStandardMaterial color="#7A1F2B" metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.23, 0]}>
          <boxGeometry args={[0.92, 0.58, 0.12]} />
          <meshStandardMaterial color="#7A1F2B" metalness={0.3} roughness={0.4} />
        </mesh>
      </group>
      <group ref={lid} position={[0, 0.5, -0.45]}>
        <mesh position={[0, 0.05, 0.45]} castShadow>
          <boxGeometry args={[0.92, 0.12, 0.92]} />
          <GoldMaterial roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.16, 0.45]}>
          <torusGeometry args={[0.12, 0.035, 8, 18]} />
          <meshStandardMaterial color="#7A1F2B" />
        </mesh>
      </group>
      <pointLight
        ref={glow}
        position={[0, 0.4, 0]}
        color="#E8C778"
        intensity={0}
        distance={4}
      />
      {particles.map((_, i) => (
        <mesh
          key={i}
          ref={(node) => {
            if (node) particleRefs.current[i] = node
          }}
        >
          <octahedronGeometry args={[0.03, 0]} />
          <meshBasicMaterial color="#E8C778" />
        </mesh>
      ))}
    </group>
  )
}
