'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { HeroCenterpieceCanvas } from '@/components/3d/HeroCenterpiece'
import { MousePointerClick } from 'lucide-react'
import { useQuality } from '@/hooks/useDevice'

export function Hero() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(true)
  const quality = useQuality()
  const { scrollY } = useScroll()
  const scaleProgress = useTransform(scrollY, [0, window.innerHeight * 0.5], [1, 0.85])
  const opacityProgress = useTransform(scrollY, [0, window.innerHeight * 0.7], [1, 0])

  useEffect(() => {
    if (quality === 'low') return // Skip mouse tracking on low quality

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / (rect.width / 2),
          y: (e.clientY - rect.top - rect.height / 2) / (rect.height / 2),
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [quality])

  // Pause 3D when off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    const el = canvasRef.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex flex-col" ref={canvasRef}>
      <div className="absolute inset-0 z-0 overflow-hidden">
        {isVisible && <HeroCenterpieceCanvas mousePosition={mousePosition} quality={quality} />}
      </div>

      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-12"
        style={{ opacity: opacityProgress, transform: `scale(${scaleProgress})` }}
      >
        {/* Top accent line */}
        <motion.div
          className="w-full max-w-[1400px] mb-12"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent flex-1"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            <span className="text-xs font-medium tracking-widest uppercase text-muted blend-text">
              Portfolio
            </span>
            <motion.div
              className="h-px bg-gradient-to-l from-transparent via-foreground/20 to-transparent flex-1"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          className="font-display font-light text-6xl md:text-8xl lg:text-[clamp(5rem,12vw,14rem)] tracking-[-0.04em] text-center leading-[1.05] max-w-[1400px] blend-text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Abhishek<span className="font-medium text-accent"> Kumar</span>
        </motion.h1>

        {/* Headline */}
        <motion.div
          className="mt-8 max-w-[900px] text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="font-display font-medium text-2xl md:text-3xl lg:text-4xl leading-[1.2] tracking-tight blend-text">
            Curious mind.<br />
            <span className="text-accent font-semibold">Building what&apos;s next.</span>
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          className="mt-6 text-lg md:text-xl max-w-[700px] text-center leading-relaxed font-light blend-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Exploring the intersection of <span className="text-accent font-medium">AI</span>, <span className="text-accent font-medium">engineering</span> and <span className="text-accent font-medium">creative technology</span>.
        </motion.p>

        {/* Status indicator */}
        <motion.div
          className="mt-12 flex items-center gap-3 text-sm text-muted blend-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.span
            className="relative flex items-center gap-2"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="w-2 h-2 rounded-full bg-accent" />
            Currently learning & building
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        style={{ opacity: opacityProgress }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div
          className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <MousePointerClick className="w-5 h-5 text-muted" />
        </motion.div>
        <motion.div
          className="w-px h-16 bg-gradient-to-b from-foreground/20 to-transparent"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-xs font-medium tracking-widest uppercase text-muted hidden sm:block">
          Scroll to explore
        </span>
      </motion.div>
    </section>
  )
}