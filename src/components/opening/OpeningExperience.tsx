import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'
import { birthdayConfig } from '../../config/birthday'
import { useExperience } from '../../context/ExperienceContext'
import { playGoldenChime } from '../../lib/chime'
import { playTrackFile } from '../../lib/music'
import { CrescentMoon } from '../effects/LightRays'
import { Starfield } from '../effects/Starfield'
import { GoldButton } from '../ui/GoldButton'
import { Ornament } from '../ui/Ornament'

export function OpeningExperience() {
  const { soundEnabled, setSoundEnabled, reducedMotion, start, requestPlay } =
    useExperience()
  const [converge, setConverge] = useState(false)
  const copy = birthdayConfig.opening

  const handleEnter = async () => {
    setConverge(true)
    void import('../hero/HeroSection')
    if (soundEnabled) {
      await playGoldenChime()
      void playTrackFile(birthdayConfig.music.tracks[0].file).catch(() => undefined)
      requestPlay()
    }
    window.setTimeout(() => start(soundEnabled), reducedMotion ? 200 : 1100)
  }

  return (
    <motion.section
      className="fixed inset-0 z-40 overflow-hidden bg-navy"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Starfield className="absolute inset-0 h-full w-full" converge={converge} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,27,61,0.15),rgba(7,11,27,0.72))]" />
      <div className="light-rays" />
      <div className="vignette" />

      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-5 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.86, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <CrescentMoon className="mx-auto mb-8 h-24 w-24 sm:h-28 sm:w-28" />
        </motion.div>

        <Ornament />

        <motion.h1
          className="font-display gold-text mt-8 max-w-3xl text-4xl leading-tight sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9 }}
        >
          {copy.title}
        </motion.h1>

        <motion.p
          className="font-display mt-6 max-w-xl text-lg text-ivory/85 sm:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.9 }}
        >
          {copy.subtitle}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <GoldButton onClick={handleEnter} className="min-w-64 px-8 py-3.5 text-lg">
            {copy.button}
          </GoldButton>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-champagne/80">
            <span className="font-label tracking-[0.18em] uppercase" dir="ltr">
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </span>
            <input
              type="checkbox"
              className="accent-gold h-4 w-4"
              checked={soundEnabled}
              onChange={(event) => setSoundEnabled(event.target.checked)}
            />
            <span className="font-display text-base">{copy.enableSound}</span>
          </label>

          <p className="font-display max-w-md text-sm text-ivory/55">{copy.soundHint}</p>
        </motion.div>
      </div>
    </motion.section>
  )
}
