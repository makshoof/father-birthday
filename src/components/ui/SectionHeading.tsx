import { motion } from 'framer-motion'
import { Ornament } from './Ornament'

type Props = {
  heading: string
  subheading?: string
  english?: string
}

export function SectionHeading({ heading, subheading, english }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mb-12 max-w-3xl px-4 text-center"
    >
      <Ornament />
      <h2 className="font-display mt-6 text-3xl leading-snug text-ivory sm:text-4xl md:text-[2.6rem]">
        {heading}
      </h2>
      {subheading ? (
        <p className="font-display mt-4 text-lg text-ivory/80 sm:text-xl">{subheading}</p>
      ) : null}
      {english ? (
        <p className="font-display mt-3 text-sm tracking-wide text-champagne/80" dir="ltr">
          {english}
        </p>
      ) : null}
    </motion.header>
  )
}
