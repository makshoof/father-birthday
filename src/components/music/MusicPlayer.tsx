import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { birthdayConfig } from '../../config/birthday'
import { useExperience } from '../../context/ExperienceContext'
import { formatTime } from '../../lib/format'
import { getSharedAudio, playTrackFile } from '../../lib/music'

export function MusicPlayer() {
  const { started, playNonce } = useExperience()
  const tracks = birthdayConfig.music.tracks
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const barsRef = useRef<HTMLSpanElement[]>([])
  const rafRef = useRef(0)

  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.55)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [missing, setMissing] = useState(false)

  const track = tracks[index]

  useEffect(() => {
    const audio = getSharedAudio()
    audio.volume = volume
    audio.muted = muted
  }, [volume, muted])

  useEffect(() => {
    const audio = getSharedAudio()
    setProgress(0)
    setMissing(false)
    const next = new URL(`/audio/${track.file}`, window.location.href).href
    if (audio.src !== next) {
      audio.src = next
      audio.load()
    }
    if (audio.error) setMissing(true)

    const onTime = () => setProgress(audio.currentTime)
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    const onEnded = () => {
      setPlaying(false)
      setIndex((current) => (current + 1) % tracks.length)
    }
    const onError = () => {
      setMissing(true)
      setPlaying(false)
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [track.file, tracks.length])

  useEffect(() => {
    if (!playNonce || missing) return
    void playTrackFile(track.file).catch(() => setPlaying(false))
  }, [playNonce, missing, track.file])

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const ensureAnalyser = async () => {
    const audio = getSharedAudio()
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      if (!Ctor) return
      ctxRef.current = new Ctor()
    }
    if (ctxRef.current.state === 'suspended') await ctxRef.current.resume()
    if (!sourceRef.current) {
      sourceRef.current = ctxRef.current.createMediaElementSource(audio)
      analyserRef.current = ctxRef.current.createAnalyser()
      analyserRef.current.fftSize = 32
      sourceRef.current.connect(analyserRef.current)
      analyserRef.current.connect(ctxRef.current.destination)
    }
    const analyser = analyserRef.current
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    const tick = () => {
      analyser.getByteFrequencyData(data)
      barsRef.current.forEach((bar, i) => {
        if (!bar) return
        const value = data[i] / 255
        bar.style.transform = `scaleY(${0.15 + value * 0.95})`
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    cancelAnimationFrame(rafRef.current)
    tick()
  }

  const togglePlay = async () => {
    const audio = getSharedAudio()
    if (missing) return
    if (playing) {
      audio.pause()
      return
    }
    try {
      await playTrackFile(track.file)
      await ensureAnalyser()
    } catch {
      setMissing(true)
      setPlaying(false)
    }
  }

  return (
    <aside
      className={`music-player ${started ? '' : 'hidden'}`}
      dir="ltr"
      aria-label="Music player"
      aria-hidden={!started}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="player-icon"
          onClick={() => void togglePlay()}
          disabled={missing}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div className="min-w-0">
          <p className="truncate font-label text-[11px] tracking-[0.16em] uppercase text-gold">
            {missing ? birthdayConfig.music.missing : track.title}
          </p>
          <div className="mt-1 flex items-center gap-[3px]" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                ref={(node) => {
                  if (node) barsRef.current[i] = node
                }}
                className="vis-bar"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="w-8 text-[10px] text-ivory/60">{formatTime(progress)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={progress}
          className="player-range flex-1"
          aria-label="Seek"
          onChange={(event) => {
            const value = Number(event.target.value)
            getSharedAudio().currentTime = value
            setProgress(value)
          }}
        />
        <span className="w-8 text-[10px] text-ivory/60">{formatTime(duration)}</span>
        <button
          type="button"
          className="player-icon"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          className="player-range w-16"
          aria-label="Volume"
          onChange={(event) => setVolume(Number(event.target.value))}
        />
      </div>

      {tracks.length > 1 ? (
        <div className="mt-2 flex gap-2">
          {tracks.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={`rounded-full px-2 py-0.5 text-[10px] tracking-wide ${
                i === index ? 'bg-gold/20 text-gold' : 'text-ivory/50'
              }`}
              onClick={() => setIndex(i)}
            >
              {item.title}
            </button>
          ))}
        </div>
      ) : null}
    </aside>
  )
}
