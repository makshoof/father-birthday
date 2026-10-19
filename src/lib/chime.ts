let sharedContext: AudioContext | null = null

function getContext(): AudioContext | null {
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!Ctor) return null
  if (!sharedContext || sharedContext.state === 'closed') {
    sharedContext = new Ctor()
  }
  return sharedContext
}

export async function resumeAudio(): Promise<AudioContext | null> {
  const ctx = getContext()
  if (ctx && ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {
      /* browsers may still block; caller already used a gesture */
    }
  }
  return ctx
}

export async function playGoldenChime(): Promise<void> {
  const ctx = await resumeAudio()
  if (!ctx) return

  const notes = [659.25, 783.99, 987.77, 1318.51]
  const now = ctx.currentTime

  notes.forEach((frequency, index) => {
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    filter.type = 'lowpass'
    filter.frequency.value = 2400

    const start = now + index * 0.11
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(0.07, start + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.35)

    oscillator.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start(start)
    oscillator.stop(start + 1.4)
  })
}

export async function playSoftWhoosh(): Promise<void> {
  const ctx = await resumeAudio()
  if (!ctx) return

  const now = ctx.currentTime
  const bufferSize = ctx.sampleRate * 0.6
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }

  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(420, now)
  filter.frequency.exponentialRampToValueAtTime(1400, now + 0.5)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.045, now + 0.05)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55)

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  noise.start(now)
  noise.stop(now + 0.6)
}
