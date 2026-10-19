export function Ornament({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span
        className="h-px w-10 sm:w-16"
        style={{ background: 'linear-gradient(to left, rgba(232,199,120,0.8), transparent)' }}
      />
      <svg width="18" height="18" viewBox="0 0 18 18" className="text-gold">
        <path
          fill="currentColor"
          d="M9 1.2l1.6 4.8H16l-4.2 3 1.6 4.8L9 11.7 4.6 13.8l1.6-4.8L2 6h5.4z"
        />
      </svg>
      <span
        className="h-px w-10 sm:w-16"
        style={{ background: 'linear-gradient(to right, rgba(232,199,120,0.8), transparent)' }}
      />
    </div>
  )
}
