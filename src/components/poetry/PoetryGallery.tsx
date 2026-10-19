import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { birthdayConfig } from '../../config/birthday'
import { GoldButton } from '../ui/GoldButton'
import { SectionHeading } from '../ui/SectionHeading'

function Petals() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="petal"
          style={{
            right: `${8 + i * 7}%`,
            animationDelay: `${i * 1.1}s`,
            animationDuration: `${10 + (i % 5)}s`,
          }}
        />
      ))}
    </div>
  )
}

export function PoetryGallery() {
  const { couplets, heading, subheading, nextLabel, prevLabel } = birthdayConfig.poetry
  const [index, setIndex] = useState(0)
  const couplet = couplets[index]

  const next = () => setIndex((i) => (i + 1) % couplets.length)
  const prev = () => setIndex((i) => (i - 1 + couplets.length) % couplets.length)

  return (
    <section id="poetry" className="relative overflow-hidden py-28">
      <Petals />
      <SectionHeading heading={heading} subheading={subheading} />

      <div className="relative mx-auto max-w-3xl px-4">
        <div className="poetry-card min-h-64 px-6 py-12 sm:px-12 sm:py-16">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              dir="rtl"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="urdu text-center text-2xl leading-[2.7] text-ivory sm:text-3xl"
            >
              {couplet.lines.map((line) => (
                <p key={line} className="gold-text mb-6 last:mb-0">
                  {line}
                </p>
              ))}
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <GoldButton variant="ghost" onClick={prev}>
            {prevLabel}
          </GoldButton>
          <p className="font-display px-3 text-sm text-champagne/70">
            {index + 1} / {couplets.length}
          </p>
          <GoldButton onClick={next}>{nextLabel}</GoldButton>
        </div>
      </div>
    </section>
  )
}
