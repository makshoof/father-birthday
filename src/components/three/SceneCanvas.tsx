import { Canvas } from '@react-three/fiber'
import { Suspense, type ReactNode } from 'react'
import { useExperience } from '../../context/ExperienceContext'

type Props = {
  children: ReactNode
  className?: string
  inView?: boolean
  cameraPosition?: [number, number, number]
}

export function SceneCanvas({
  children,
  className,
  inView = true,
  cameraPosition = [0, 1.5, 5.4],
}: Props) {
  const { simplify3D, reducedMotion } = useExperience()

  return (
    <div className={className}>
      <Canvas
        dpr={[1, simplify3D ? 1.1 : 1.4]}
        camera={{ position: cameraPosition, fov: 38, near: 0.1, far: 30 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'low-power',
        }}
        shadows={false}
        frameloop={inView && !reducedMotion ? 'always' : 'demand'}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  )
}
