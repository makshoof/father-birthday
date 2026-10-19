"""Compress family photos and compose a public-domain Happy Birthday melody."""

from __future__ import annotations

import math
import os
import shutil
import struct
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INCOMING = ROOT / "_incoming_photos"
IMAGES = ROOT / "public" / "images"
AUDIO = ROOT / "public" / "audio"
SAMPLE_RATE = 16000

PHOTO_MAP = [
    ("WhatsApp Image 2026-10-19 at 10.20.25 PM.jpeg", "family-photo.jpg"),
    ("WhatsApp Image 2026-10-19 at 10.20.25 PM (1).jpeg", "waterfall.jpg"),
    ("WhatsApp Image 2026-10-19 at 10.20.25 PM (2).jpeg", "pines.jpg"),
    ("WhatsApp Image 2026-10-19 at 10.20.26 PM.jpeg", "murree.jpg"),
    ("WhatsApp Image 2026-10-19 at 10.20.26 PM (1).jpeg", "together.jpg"),
    ("WhatsApp Image 2026-10-19 at 10.20.27 PM.jpeg", "garden.jpg"),
    ("WhatsApp Image 2026-10-19 at 10.20.27 PM (1).jpeg", "snow.jpg"),
    ("WhatsApp Image 2026-10-19 at 10.20.28 PM.jpeg", "river.jpg"),
    ("WhatsApp Image 2026-10-19 at 10.20.28 PM (1).jpeg", "all-of-us.jpg"),
    ("WhatsApp Image 2026-10-19 at 10.20.28 PM (2).jpeg", "balcony.jpg"),
]


def midi_to_hz(note: float) -> float:
    return 440.0 * (2.0 ** ((note - 69.0) / 12.0))


def env(i: int, n: int) -> float:
    a = max(1, int(n * 0.04))
    r = max(1, int(n * 0.28))
    if i < a:
        return i / a
    if i > n - r:
        return max(0.0, (n - i) / r)
    return 1.0


def compress_photos() -> None:
    IMAGES.mkdir(parents=True, exist_ok=True)
    try:
        from PIL import Image
    except ImportError:
        Image = None

    for src_name, dest_name in PHOTO_MAP:
        src = INCOMING / src_name
        dest = IMAGES / dest_name
        if not src.exists():
            print("missing", src_name)
            continue
        if Image is None:
            shutil.copyfile(src, dest)
            print("copied", dest_name)
            continue
        img = Image.open(src).convert("RGB")
        img.thumbnail((1400, 1400))
        img.save(dest, "JPEG", quality=78, optimize=True)
        print(dest_name, dest.stat().st_size)


def write_happy_birthday() -> None:
    AUDIO.mkdir(parents=True, exist_ok=True)
    bpm = 96
    beat = 60.0 / bpm
    # Public-domain Happy Birthday melody (notes are not copyrighted).
    melody = [
        (60, 0.75), (60, 0.25), (62, 1), (60, 1), (65, 1), (64, 2),
        (60, 0.75), (60, 0.25), (62, 1), (60, 1), (67, 1), (65, 2),
        (60, 0.75), (60, 0.25), (72, 1), (69, 1), (65, 1), (64, 1), (62, 2),
        (70, 0.75), (70, 0.25), (69, 1), (65, 1), (67, 1), (65, 2.5),
    ]
    samples: list[float] = []
    t = 0.0
    for _ in range(2):
        for note, beats in melody:
            length = int(SAMPLE_RATE * beat * beats)
            freq = midi_to_hz(note)
            for i in range(length):
                x = i / SAMPLE_RATE
                wave_form = (
                    math.sin(2 * math.pi * freq * x)
                    + 0.22 * math.sin(2 * math.pi * freq * 2 * x)
                    + 0.12 * math.sin(2 * math.pi * midi_to_hz(note - 12) * x)
                )
                samples.append(wave_form * 0.22 * env(i, length))
            t += beats

    fade = int(SAMPLE_RATE * 0.8)
    for i in range(min(fade, len(samples))):
        samples[i] *= i / fade
        samples[-1 - i] *= i / fade
    peak = max(abs(v) for v in samples) or 1.0
    path = AUDIO / "happy-birthday.wav"
    with wave.open(str(path), "w") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        frames = b"".join(
            struct.pack("<h", int(max(-1, min(1, v / peak * 0.9)) * 32767))
            for v in samples
        )
        wav.writeframes(frames)
    print("happy-birthday.wav", path.stat().st_size)


def main() -> None:
    compress_photos()
    write_happy_birthday()
    for name in ("birthday-song.wav", "instrumental.wav"):
        old = AUDIO / name
        if old.exists():
            old.unlink()
            print("removed", name)


if __name__ == "__main__":
    main()
