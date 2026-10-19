import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { birthdayConfig, type PhotoSlot } from '../../config/birthday'
import { SectionHeading } from '../ui/SectionHeading'

function photoSrc(file: string) {
  return `/images/${file}`
}

function TiltCard({
  photo,
  onOpen,
}: {
  photo: PhotoSlot
  onOpen: () => void
}) {
  const [missing, setMissing] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        setTilt({ x: y * -8, y: x * 10 })
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      className="photo-card group text-center"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="photo-frame">
        {missing ? (
          <div className="flex h-full min-h-56 flex-col items-center justify-center px-4 text-center">
            <p className="font-display text-xl text-gold">{birthdayConfig.gallery.placeholderTitle}</p>
          </div>
        ) : (
          <img
            src={photoSrc(photo.file)}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            onError={() => setMissing(true)}
          />
        )}
      </div>
      {photo.caption ? (
        <p className="font-display mt-3 text-base text-champagne">{photo.caption}</p>
      ) : null}
    </motion.button>
  )
}

export function PhotoGallery() {
  const { heading, subheading, photos } = birthdayConfig.gallery
  const [active, setActive] = useState<number | null>(null)

  const close = useCallback(() => setActive(null), [])
  const next = useCallback(() => {
    setActive((i) => (i === null ? 0 : (i + 1) % photos.length))
  }, [photos.length])
  const prev = useCallback(() => {
    setActive((i) => (i === null ? 0 : (i - 1 + photos.length) % photos.length))
  }, [photos.length])

  useEffect(() => {
    if (active === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowLeft') next()
      if (event.key === 'ArrowRight') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, close, next, prev])

  const current = active !== null ? photos[active] : null

  return (
    <section id="gallery" className="relative py-28">
      <SectionHeading heading={heading} subheading={subheading} />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <TiltCard key={photo.file} photo={photo} onOpen={() => setActive(index)} />
        ))}
      </div>

      <AnimatePresence>
        {current ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            onClick={close}
          >
            <button type="button" className="absolute top-5 right-5 text-ivory" onClick={close} aria-label="Close">
              <X />
            </button>
            <button
              type="button"
              className="absolute top-1/2 left-4 -translate-y-1/2 text-gold"
              onClick={(event) => {
                event.stopPropagation()
                prev()
              }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={36} />
            </button>
            <button
              type="button"
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gold"
              onClick={(event) => {
                event.stopPropagation()
                next()
              }}
              aria-label="Next photo"
            >
              <ChevronRight size={36} />
            </button>
            <div className="max-h-[82vh] max-w-4xl" onClick={(event) => event.stopPropagation()}>
              <img
                src={photoSrc(current.file)}
                alt={current.alt}
                className="max-h-[78vh] w-full rounded-sm object-contain shadow-2xl"
              />
              <p className="font-display mt-4 text-center text-lg text-ivory">{current.caption}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
