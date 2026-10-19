type Props = {
  flames?: boolean
  className?: string
}

export function CssCake({ flames = true, className = '' }: Props) {
  return (
    <div className={`css-cake ${className}`} aria-hidden="true">
      <div className="css-cake-plate" />
      <div className="css-cake-tier wide" />
      <div className="css-cake-tier mid" />
      <div className="css-cake-tier small" />
      <div className="css-candles">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`css-candle ${flames ? 'lit' : ''}`}>
            <i />
          </span>
        ))}
      </div>
    </div>
  )
}

export function CssGift({ open = false }: { open?: boolean }) {
  return (
    <div className={`css-gift ${open ? 'open' : ''}`} aria-hidden="true">
      <div className="css-gift-body" />
      <div className="css-gift-lid" />
      <div className="css-gift-ribbon-x" />
      <div className="css-gift-ribbon-y" />
    </div>
  )
}
