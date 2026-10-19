import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = HTMLMotionProps<'button'> & {
  children: ReactNode
  variant?: 'solid' | 'ghost'
}

export function GoldButton({
  children,
  className = '',
  variant = 'solid',
  type = 'button',
  ...props
}: Props) {
  const styles =
    variant === 'solid'
      ? 'bg-gold text-navy shadow-[0_8px_30px_rgba(232,199,120,0.28)] hover:bg-gold-soft'
      : 'bg-transparent text-gold border border-gold/50 hover:bg-gold/10'

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`gold-btn ${styles} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
