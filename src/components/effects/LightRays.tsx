export function LightRays({ className = '' }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="light-rays" />
      <div className="vignette" />
    </div>
  )
}

export function CrescentMoon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`crescent-glow ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="moonGold" cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#FFF7E8" />
          <stop offset="55%" stopColor="#E8C778" />
          <stop offset="100%" stopColor="#B48A3C" />
        </radialGradient>
      </defs>
      <path
        fill="url(#moonGold)"
        d="M128 28c-38 8-66 42-66 82 0 46 36 84 82 84 14 0 28-4 40-10-16 10-34 16-54 16-54 0-98-42-98-94S68 12 122 12c10 0 20 2 28 5-8 3-14 7-22 11z"
      />
    </svg>
  )
}
