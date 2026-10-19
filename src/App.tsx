import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense, useEffect } from 'react'
import { BlessingsSection } from './components/blessings/BlessingsSection'
import { CandleSection } from './components/candles/CandleSection'
import { CrescentMoon } from './components/effects/LightRays'
import { Starfield } from './components/effects/Starfield'
import { FinalSurprise } from './components/finale/FinalSurprise'
import { PhotoGallery } from './components/gallery/PhotoGallery'
import { GiftBoxSection } from './components/gift/GiftBoxSection'
import { ScrollProgress } from './components/layout/ScrollProgress'
import { HeartfeltLetter } from './components/letter/HeartfeltLetter'
import { MusicPlayer } from './components/music/MusicPlayer'
import { OpeningExperience } from './components/opening/OpeningExperience'
import { PoetryGallery } from './components/poetry/PoetryGallery'
import { birthdayConfig } from './config/birthday'
import { ExperienceProvider, useExperience } from './context/ExperienceContext'

const HeroSection = lazy(() =>
  import('./components/hero/HeroSection').then((module) => ({ default: module.HeroSection })),
)

function SceneLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <CrescentMoon className="h-16 w-16" />
    </div>
  )
}

function Experience() {
  const { started } = useExperience()

  useEffect(() => {
    document.title = birthdayConfig.pageTitle
  }, [])

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-navy">
      <a href="#hero" className="skip-link">
        Skip to content
      </a>
      <Starfield className="pointer-events-none fixed inset-0 h-full w-full" density={0.45} />
      <MusicPlayer />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,27,61,0.35),rgba(7,11,27,0.2)_45%,rgba(7,11,27,0.72))]" />

      <AnimatePresence>
        {!started ? <OpeningExperience key="opening" /> : null}
      </AnimatePresence>

      {started ? (
        <>
          <ScrollProgress />
          <main>
            <Suspense fallback={<SceneLoader />}>
              <HeroSection />
            </Suspense>
            <PoetryGallery />
            <HeartfeltLetter />
            <GiftBoxSection />
            <PhotoGallery />
            <BlessingsSection />
            <CandleSection />
            <FinalSurprise />
          </main>
        </>
      ) : null}
    </div>
  )
}

export default function App() {
  return (
    <ExperienceProvider>
      <Experience />
    </ExperienceProvider>
  )
}
