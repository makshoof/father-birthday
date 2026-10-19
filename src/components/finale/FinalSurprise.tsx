import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { birthdayConfig } from '../../config/birthday'
import { useExperience } from '../../context/ExperienceContext'
import { useInView } from '../../hooks/useInView'
import { Fireworks } from '../effects/Fireworks'
import { CrescentMoon } from '../effects/LightRays'
import { GoldButton } from '../ui/GoldButton'
import { Ornament } from '../ui/Ornament'

export function FinalSurprise() {
  const copy = birthdayConfig.finale
  const { restart, reducedMotion } = useExperience()
  const { ref, inView } = useInView<HTMLElement>('0px')
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reducedMotion) {
      setStep(4)
      return
    }
    const timers = [
      window.setTimeout(() => setStep(1), 700),
      window.setTimeout(() => setStep(2), 2600),
      window.setTimeout(() => setStep(3), 4800),
      window.setTimeout(() => setStep(4), 6800),
    ]
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [inView, reducedMotion])

  return (
    <section
      ref={ref}
      id="finale"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-24 text-center"
    >
      <Fireworks active={inView && step >= 3} />
      <CrescentMoon className="mb-8 h-16 w-16 opacity-80" />
      <Ornament />

      <motion.p
        className="font-display mt-8 text-2xl text-champagne sm:text-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= 0 ? 1 : 0 }}
      >
        {copy.prelude}
      </motion.p>

      <div className="mt-8 max-w-2xl">
        {copy.wish.map((line, i) => (
          <motion.p
            key={line}
            className="font-display gold-text text-2xl leading-relaxed sm:text-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 16 }}
            transition={{ delay: i * 0.15 }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <div className="mt-10 max-w-xl">
        {copy.truths.map((line, i) => (
          <motion.p
            key={line}
            className="font-display text-xl leading-relaxed text-ivory sm:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 2 ? 1 : 0 }}
            transition={{ delay: i * 0.12 }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <motion.h2
        className="font-display gold-text mt-12 text-3xl sm:text-5xl"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: step >= 3 ? 1 : 0, scale: step >= 3 ? 1 : 0.96 }}
      >
        {copy.closer}
      </motion.h2>

      <motion.p
        className="font-display mt-6 text-lg text-champagne"
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= 4 ? 1 : 0 }}
      >
        {copy.signature}
      </motion.p>

      {step >= 4 ? (
        <div className="mt-10">
          <GoldButton onClick={restart}>{copy.replay}</GoldButton>
        </div>
      ) : null}
    </section>
  )
}
