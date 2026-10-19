type GoldProps = {
  roughness?: number
  metalness?: number
  color?: string
}

export function GoldMaterial({
  roughness = 0.28,
  metalness = 0.84,
  color = '#E8C778',
}: GoldProps) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      envMapIntensity={0.9}
    />
  )
}

export function IvoryMaterial() {
  return (
    <meshStandardMaterial
      color="#FFF7E8"
      roughness={0.62}
      metalness={0.04}
    />
  )
}

export function CreamMaterial({ color = '#F6E6C8' }: { color?: string }) {
  return (
    <meshStandardMaterial color={color} roughness={0.7} metalness={0.02} />
  )
}
