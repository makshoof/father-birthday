import { motion } from 'framer-motion'
import { birthdayConfig } from '../../config/birthday'
import { SectionHeading } from '../ui/SectionHeading'

export function BlessingsSection() {
  const { heading, duas } = birthdayConfig.blessings

  return (
    <section id="blessings" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,199,120,0.12),transparent_55%)]" />
      <SectionHeading heading={heading} />
      <div className="mx-auto grid max-w-4xl gap-5 px-4">
        {duas.map((dua, index) => (
          <motion.p
            key={dua}
            className="dua-card font-display text-xl leading-relaxed text-ivory sm:text-2xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: index * 0.08 }}
          >
            {dua}
          </motion.p>
        ))}
      </div>
    </section>
  )
}
