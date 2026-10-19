import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group, Mesh } from 'three'
import { CreamMaterial, GoldMaterial, IvoryMaterial } from './materials'

function Candle({
  position,
  lit,
  delay,
}: {
  position: [number, number, number]
  lit: boolean
  delay: number
}) {
  const flame = useRef<Mesh>(null)
  const glow = useRef<Mesh>(null)

  useFrame((state) => {
    if (!flame.current || !glow.current) return
    const t = state.clock.elapsedTime + delay
    const flicker = lit ? 0.85 + Math.sin(t * 14) * 0.12 + Math.sin(t * 21) * 0.06 : 0
    flame.current.scale.set(0.7, flicker, 0.7)
    glow.current.scale.setScalar(lit ? 1 + Math.sin(t * 8) * 0.08 : 0.01)
    flame.current.visible = lit
    glow.current.visible = lit
  })

  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.035, 0.04, 0.32, 10]} />
        <meshStandardMaterial color="#FFF4D6" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.05, 6]} />
        <meshStandardMaterial color="#3a2a18" />
      </mesh>
      <mesh ref={glow} position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshBasicMaterial color="#E8C778" transparent opacity={0.18} />
      </mesh>
      <mesh ref={flame} position={[0, 0.26, 0]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshBasicMaterial color="#FFB347" />
      </mesh>
    </group>
  )
}

function Tier({
  radius,
  height,
  y,
}: {
  radius: number
  height: number
  y: number
}) {
  return (
    <group position={[0, y, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 1.02, height, 48]} />
        <IvoryMaterial />
      </mesh>
      <mesh position={[0, height * 0.08, 0]}>
        <torusGeometry args={[radius, 0.035, 10, 48]} />
        <GoldMaterial />
      </mesh>
      <mesh position={[0, height / 2 + 0.01, 0]}>
        <cylinderGeometry args={[radius + 0.015, radius + 0.015, 0.05, 48]} />
        <CreamMaterial color="#FFF7E8" />
      </mesh>
    </group>
  )
}

type CakeProps = {
  flames?: boolean
  position?: [number, number, number]
}

export function Cake({ flames = true, position = [0, 0, 0] }: CakeProps) {
  const group = useRef<Group>(null)
  const candles = useMemo(
    () =>
      [
        [0, 1.18, 0],
        [0.22, 1.18, 0.08],
        [-0.2, 1.18, 0.1],
        [0.08, 1.18, -0.22],
        [-0.12, 1.18, -0.18],
      ] as [number, number, number][],
    [],
  )

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.08
  })

  return (
    <group ref={group} position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[1.65, 1.65, 0.06, 64]} />
        <GoldMaterial roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.08, 24]} />
        <GoldMaterial />
      </mesh>
      <Tier radius={1.15} height={0.42} y={0.26} />
      <Tier radius={0.86} height={0.36} y={0.64} />
      <Tier radius={0.58} height={0.3} y={0.96} />
      {candles.map((pos, i) => (
        <Candle key={i} position={pos} lit={flames} delay={i * 0.4} />
      ))}
    </group>
  )
}
