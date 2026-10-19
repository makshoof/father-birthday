import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { birthdayConfig } from '../../config/birthday'
import { CssGift } from '../three/CssCake'
import { GoldButton } from '../ui/GoldButton'
import { SectionHeading } from '../ui/SectionHeading'

export function GiftBoxSection() {
  const copy = birthdayConfig.gift
  const [open, setOpen] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const handleOpen = () => {
    setOpen(true)
    window.setTimeout(() => setRevealed(true), 450)
  }

  const replay = () => {
    setOpen(false)
    setRevealed(false)
  }

  return (
    <section id="gift" className="relative py-24">
      <SectionHeading heading={copy.heading} subheading={copy.hint} />

      <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 lg:grid-cols-2">
        <div className="flex h-[280px] items-center justify-center sm:h-[340px]">
          <button
            type="button"
            className="flex h-full w-full items-center justify-center"
            onClick={open ? replay : handleOpen}
          >
            <CssGift open={open} />
          </button>
        </div>

        <div className="min-h-40 text-center lg:text-left">
          <AnimatePresence>
            {revealed ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="poetry-card px-6 py-8"
              >
                <p className="font-display text-2xl leading-relaxed text-ivory">{copy.message}</p>
                <p className="font-display mt-6 text-xl leading-relaxed text-champagne">
                  {copy.blessing}
                </p>
                <div className="mt-8">
                  <GoldButton variant="ghost" onClick={replay}>
                    {copy.replay}
                  </GoldButton>
                </div>
              </motion.div>
            ) : (
              <p className="font-display text-lg text-ivory/60">{copy.hint}</p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
