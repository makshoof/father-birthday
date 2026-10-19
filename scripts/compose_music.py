"""Original, royalty-free birthday music for the family website."""

from __future__ import annotations

import math
import struct
import wave
from pathlib import Path

SAMPLE_RATE = 22050


def midi_to_hz(note: float) -> float:
    return 440.0 * (2.0 ** ((note - 69.0) / 12.0))


def clamp(value: float, low: float = -1.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def env(index: int, length: int, attack: float = 0.04, release: float = 0.22) -> float:
    if length <= 0:
        return 0.0
    attack_n = max(1, int(length * attack))
    release_n = max(1, int(length * release))
    if index < attack_n:
        return index / attack_n
    if index > length - release_n:
        return max(0.0, (length - index) / release_n)
    return 1.0


def tone(freq: float, length: int, volume: float, warmth: float = 0.18) -> list[float]:
    samples: list[float] = []
    for i in range(length):
        t = i / SAMPLE_RATE
        wave_form = (
            math.sin(2 * math.pi * freq * t)
            + warmth * math.sin(2 * math.pi * freq * 2 * t)
            + warmth * 0.35 * math.sin(2 * math.pi * freq * 3 * t)
        )
        samples.append(wave_form * volume * env(i, length))
    return samples


def add_at(target: list[float], source: list[float], start: int) -> None:
    needed = start + len(source)
    if needed > len(target):
        target.extend([0.0] * (needed - len(target)))
    for i, value in enumerate(source):
        target[start + i] += value


def delay(target: list[float], ms: int = 280, mix: float = 0.22) -> None:
    offset = int(SAMPLE_RATE * ms / 1000)
    extra = list(target)
    for i, value in enumerate(extra):
        j = i + offset
        if j < len(target):
            target[j] += value * mix


def render_piece(kind: str) -> list[float]:
    bpm = 72 if kind == "song" else 64
    beat = 60.0 / bpm
    samples: list[float] = []

    # Original C-major theme. Not the Happy Birthday melody.
    melody = [
        (64, 1.0),
        (67, 1.0),
        (69, 1.0),
        (67, 1.0),
        (72, 2.0),
        (69, 1.0),
        (67, 1.0),
        (64, 1.0),
        (62, 1.0),
        (60, 2.0),
        (64, 1.0),
        (67, 2.0),
        (None, 1.0),
        (69, 1.0),
        (71, 1.0),
        (72, 2.0),
        (76, 1.0),
        (74, 1.0),
        (72, 1.0),
        (69, 1.0),
        (67, 2.0),
        (64, 2.0),
        (62, 1.0),
        (60, 3.0),
        (None, 1.0),
    ]

    chords = [
        (48, 52, 55, 60),
        (45, 48, 52, 57),
        (41, 45, 48, 53),
        (43, 47, 50, 55),
    ]

    cursor = int(SAMPLE_RATE * 0.4)
    melody_gain = 0.18 if kind == "song" else 0.09
    pad_gain = 0.045 if kind == "song" else 0.07

    for repeat in range(2):
        chord_index = 0
        chord_hold = 0.0
        for note, beats in melody:
            length = int(SAMPLE_RATE * beat * beats)
            if note is not None:
                lift = 0 if repeat == 0 else 7 if kind == "song" else 0
                add_at(samples, tone(midi_to_hz(note + lift), length, melody_gain), cursor)
                add_at(
                    samples,
                    tone(midi_to_hz(note + lift + 7), length, melody_gain * 0.28, 0.08),
                    cursor,
                )
            if chord_hold <= 0:
                chord = chords[chord_index % len(chords)]
                pad_len = int(SAMPLE_RATE * beat * 4)
                for pad_note in chord:
                    add_at(samples, tone(midi_to_hz(pad_note), pad_len, pad_gain, 0.12), cursor)
                chord_index += 1
                chord_hold = 4.0
            chord_hold -= beats
            cursor += length

    delay(samples, 320 if kind == "song" else 420, 0.18 if kind == "song" else 0.26)
    fade = int(SAMPLE_RATE * 1.8)
    for i in range(fade):
        samples[i] *= i / fade
        samples[-1 - i] *= i / fade
    peak = max(abs(value) for value in samples) or 1.0
    return [clamp(value / peak * 0.86) for value in samples]


def write_wav(path: Path, samples: list[float]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "w") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        frames = bytearray()
        for i, value in enumerate(samples):
            left = int(value * 32767)
            right = int(value * 32767 * (0.96 if i % 2 == 0 else 1.0))
            frames.extend(struct.pack("<hh", left, right))
        wav.writeframes(frames)


def main() -> None:
    audio_dir = Path(__file__).resolve().parents[1] / "public" / "audio"
    write_wav(audio_dir / "birthday-song.wav", render_piece("song"))
    write_wav(audio_dir / "instrumental.wav", render_piece("pad"))
    print(f"Wrote original music to {audio_dir}")


if __name__ == "__main__":
    main()
