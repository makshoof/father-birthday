import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { useExperience } from '../../context/ExperienceContext'

export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.32} color="#9bb0ff" />
      <directionalLight position={[4, 6, 3]} intensity={1.2} color="#FFE6A8" />
      <pointLight position={[0, 2.2, 1.4]} intensity={0.55} color="#E8C778" distance={8} />
    </>
  )
}

export function GoldenRings() {
  const ref = useRef<Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.18
  })
  return (
    <group ref={ref} position={[0, 0.7, 0]}>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.1, 0.012, 8, 48]} />
        <meshStandardMaterial color="#E8C778" metalness={0.9} roughness={0.25} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

export function CameraRig() {
  const { camera, pointer } = useThree()
  const { isMobile, reducedMotion } = useExperience()

  useFrame(() => {
    if (isMobile || reducedMotion) {
      camera.lookAt(0, 0.7, 0)
      return
    }
    camera.position.x += (pointer.x * 0.4 - camera.position.x) * 0.04
    camera.position.y += (1.45 + pointer.y * 0.18 - camera.position.y) * 0.04
    camera.lookAt(0, 0.7, 0)
  })
  return null
}
