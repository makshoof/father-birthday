import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useIsMobile } from '../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { getLowPowerGpu, useWebGL } from '../hooks/useWebGL'
import { getSharedAudio } from '../lib/music'

type ExperienceContextValue = {
  started: boolean
  soundEnabled: boolean
  setSoundEnabled: (value: boolean) => void
  start: (withSound: boolean) => void
  restart: () => void
  requestPlay: () => void
  playNonce: number
  reducedMotion: boolean
  isMobile: boolean
  webgl: boolean
  simplify3D: boolean
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null)

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [started, setStarted] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [playNonce, setPlayNonce] = useState(0)
  const reducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const webgl = useWebGL()
  const lowPower = getLowPowerGpu()

  const start = useCallback((withSound: boolean) => {
    setSoundEnabled(withSound)
    setStarted(true)
  }, [])

  const requestPlay = useCallback(() => {
    setPlayNonce((value) => value + 1)
  }, [])

  const restart = useCallback(() => {
    setStarted(false)
    getSharedAudio().pause()
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const value = useMemo(
    () => ({
      started,
      soundEnabled,
      setSoundEnabled,
      start,
      restart,
      requestPlay,
      playNonce,
      reducedMotion,
      isMobile,
      webgl,
      simplify3D: isMobile || lowPower || reducedMotion,
    }),
    [
      started,
      soundEnabled,
      start,
      restart,
      requestPlay,
      playNonce,
      reducedMotion,
      isMobile,
      webgl,
      lowPower,
    ],
  )

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  )
}

export function useExperience() {
  const ctx = useContext(ExperienceContext)
  if (!ctx) {
    throw new Error('useExperience must be used within ExperienceProvider')
  }
  return ctx
}
