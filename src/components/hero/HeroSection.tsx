import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { birthdayConfig } from '../../config/birthday'
import { useExperience } from '../../context/ExperienceContext'
import { useInView } from '../../hooks/useInView'
import { Cake } from '../three/Cake'
import { CssCake, CssGift } from '../three/CssCake'
import { GiftBox } from '../three/GiftBox'
import { CameraRig, GoldenRings, SceneLights } from '../three/SceneLights'
import { SceneCanvas } from '../three/SceneCanvas'
import { GoldButton } from '../ui/GoldButton'
import { Ornament } from '../ui/Ornament'

export function HeroSection() {
  const { webgl, simplify3D, isMobile } = useExperience()
  const { ref, inView } = useInView<HTMLElement>()
  const [giftOpen, setGiftOpen] = useState(false)
  const [burst, setBurst] = useState(true)
  const copy = birthdayConfig.hero

  useEffect(() => {
    const id = window.setTimeout(() => setBurst(false), 1800)
    return () => window.clearTimeout(id)
  }, [])

  const scrollNext = () => {
    document.getElementById('poetry')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-dvh flex-col overflow-hidden"
    >
      {burst ? <div className="hero-burst" aria-hidden="true" /> : null}

      <div className="absolute inset-0">
        {webgl && !isMobile ? (
          <SceneCanvas className="h-full w-full" inView={inView} cameraPosition={[0.35, 1.55, 5.6]}>
            <SceneLights />
            <CameraRig />
            {!simplify3D ? <GoldenRings /> : null}
            <Cake />
            <GiftBox
              position={[1.7, 0.15, 0.4]}
              scale={0.72}
              open={giftOpen}
              onClick={() => setGiftOpen((v) => !v)}
            />
          </SceneCanvas>
        ) : (
          <div className="flex h-full items-center justify-center gap-10 pt-10">
            <CssCake />
            <button type="button" onClick={() => setGiftOpen((v) => !v)}>
              <CssGift open={giftOpen} />
            </button>
          </div>
        )}
      </div>

      <div className="pointer-events-none relative z-10 mt-auto flex flex-col items-center px-5 pb-16 pt-40 text-center">
        <div className="hero-scrim pointer-events-none absolute inset-x-0 bottom-0 h-72" />
        <div className="relative">
          <Ornament />
          <motion.h1
            className="font-display gold-text mt-5 max-w-4xl text-3xl leading-tight sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            {copy.headline}
          </motion.h1>
          <motion.p
            className="font-display mt-5 max-w-2xl text-lg text-ivory/90 sm:text-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9 }}
          >
            {copy.subhead}
          </motion.p>
          <motion.p
            className="font-display mt-3 text-base italic text-champagne/80 sm:text-lg"
            dir="ltr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {copy.english}
          </motion.p>
          <div className="pointer-events-auto mt-8">
            <GoldButton onClick={scrollNext}>{copy.cta}</GoldButton>
          </div>
        </div>
      </div>
    </section>
  )
}
