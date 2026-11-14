'use client'

import { useScrollProgress } from '@/hooks/useScrollProgress'
import { motion } from 'framer-motion'

export function ScrollProgress() {
  const progress = useScrollProgress()

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] h-1 bg-background"
      style={{ width: '100%' }}
      aria-hidden="true"
    >
      <motion.div
        className="h-full bg-accent origin-left"
        style={{ transformOrigin: 'left center' }}
        animate={{ scaleX: progress }}
        transition={{ duration: 0.1, ease: 'linear' }}
      />
    </motion.div>
  )
}