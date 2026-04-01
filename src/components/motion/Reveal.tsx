import type { PropsWithChildren } from 'react'

import { motion } from 'motion/react'

type RevealProps = PropsWithChildren<{
  className?: string
  delay?: number
  y?: number
}>

function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

export { Reveal }
