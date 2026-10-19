# Happy Birthday, Abu

A cinematic birthday website — a digital love letter from the whole family to Abu.

The interface is in English. Only the shayari and the handwritten letter are in Urdu.
Original background music is included. Sound starts when the surprise button is pressed, if music is left enabled.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed in the terminal (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

## Personalize everything in one file

Edit `src/config/birthday.ts` to change:

- Father's title (default: `Abu`)
- Family signature
- Opening lines, hero copy, poetry, letter, duas, and finale
- Photo filenames and captions
- Music filenames and track titles
- Optional birthday date

You do not need to edit React components for ordinary personalization.

## Add photos

Place files in `public/images/` using these names:

- `abu-portrait.jpg`
- `father-son-1.jpg`
- `father-son-2.jpg`
- `family-photo.jpg`
- `favorite-memory.jpg`

Until a file exists, the gallery shows an honest placeholder.

## Music

Original, royalty-free music is already included in `public/audio/`:

- `birthday-song.wav` — main track, *Golden evening*
- `instrumental.wav` — softer track, *Soft light*

You can replace those files. Music starts after the surprise button is pressed, if **Play music** is checked.

## How the experience works

1. A midnight opening scene with a golden crescent
2. 3D birthday cake, stars, and a gift box
3. Original Urdu poetry, one couplet at a time
4. A letter that opens from an envelope
5. A larger 3D gift reveal
6. Family photo gallery
7. Duas
8. Candle-blowing wish
9. Final cinematic message

On phones or computers without WebGL, elegant CSS stand-ins replace the 3D scenes.
