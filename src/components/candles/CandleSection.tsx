import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { birthdayConfig } from '../../config/birthday'
import { useExperience } from '../../context/ExperienceContext'
import { playGoldenChime } from '../../lib/chime'
import { CssCake } from '../three/CssCake'
import { GoldButton } from '../ui/GoldButton'
import { SectionHeading } from '../ui/SectionHeading'

export function CandleSection() {
  const copy = birthdayConfig.candles
  const { soundEnabled } = useExperience()
  const [lit, setLit] = useState(true)
  const [celebrating, setCelebrating] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef(0)

  const blowOut = async () => {
    if (!lit) return
    setLit(false)
    setCelebrating(true)
    if (soundEnabled) await playGoldenChime()
  }

  const relight = () => {
    setLit(true)
    setCelebrating(false)
  }

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const listenMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const ctx = new AudioContext()
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      source.connect(analyser)
      const data = new Uint8Array(analyser.fftSize)

      const tick = () => {
        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (const value of data) {
          const v = (value - 128) / 128
          sum += v * v
        }
        const rms = Math.sqrt(sum / data.length)
        if (rms > 0.08) {
          void blowOut()
          stream.getTracks().forEach((track) => track.stop())
          void ctx.close()
          return
        }
        rafRef.current = requestAnimationFrame(tick)
      }
      tick()
    } catch {
      await blowOut()
    }
  }

  return (
    <section id="candles" className="relative py-24">
      <SectionHeading heading={copy.heading} />
      <div className="relative mx-auto h-[280px] max-w-xl sm:h-[340px]">
        {celebrating ? <div className="hero-burst" aria-hidden="true" /> : null}
        <div className="flex h-full items-center justify-center">
          <CssCake flames={lit} />
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4 px-4">
        {lit ? (
          <>
            <GoldButton onClick={() => void blowOut()}>{copy.button}</GoldButton>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm text-champagne/70"
              onClick={() => void listenMic()}
            >
              <Mic size={14} />
              <span className="font-display">{copy.micButton}</span>
            </button>
          </>
        ) : (
          <>
            <motion.p
              className="font-display max-w-xl text-center text-2xl leading-relaxed text-gold"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {copy.after}
            </motion.p>
            <GoldButton variant="ghost" onClick={relight}>
              {copy.relight}
            </GoldButton>
          </>
        )}
      </div>
    </section>
  )
}
