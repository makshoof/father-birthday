import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { birthdayConfig } from '../../config/birthday'
import { useExperience } from '../../context/ExperienceContext'
import { GoldButton } from '../ui/GoldButton'
import { SectionHeading } from '../ui/SectionHeading'

function Envelope({ open, onOpen }: { open: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      className={`envelope ${open ? 'is-open' : ''}`}
      onClick={onOpen}
      aria-expanded={open}
      aria-label={birthdayConfig.letter.envelopeHint}
    >
      <span className="envelope-pocket" />
      <span className="envelope-letter-peek" />
      <span className="envelope-flap" />
      <span className="envelope-seal">{open ? '' : '❤️'}</span>
    </button>
  )
}

export function HeartfeltLetter() {
  const copy = birthdayConfig.letter
  const { reducedMotion } = useExperience()
  const [open, setOpen] = useState(false)
  const [revealAll, setRevealAll] = useState(false)

  const paragraphs = useMemo(() => copy.paragraphs, [copy.paragraphs])
  const instant = revealAll || reducedMotion

  return (
    <section id="letter" className="relative py-28">
      <SectionHeading
        heading={copy.heading}
        subheading={open ? undefined : copy.envelopeHint}
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center px-4">
        <Envelope open={open} onOpen={() => setOpen(true)} />

        {open ? (
          <motion.article
            className="letter-paper mt-10 w-full px-5 py-10 sm:px-12 sm:py-14"
            dir="rtl"
            lang="ur"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="urdu mb-8 text-2xl text-[#4a3218]">{copy.greeting}</p>
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={paragraph}
                className="urdu mb-6 text-lg leading-[2.5] text-[#3d2914] sm:text-xl"
                initial={instant ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: instant ? 0 : 0.08 * index, duration: 0.45 }}
              >
                {paragraph}
              </motion.p>
            ))}
            <p className="urdu mt-10 text-xl text-[#4a3218]">{copy.closing}</p>
          </motion.article>
        ) : null}

        {open && !revealAll ? (
          <div className="mt-6">
            <GoldButton variant="ghost" onClick={() => setRevealAll(true)}>
              {copy.readAll}
            </GoldButton>
          </div>
        ) : null}
      </div>
    </section>
  )
}
