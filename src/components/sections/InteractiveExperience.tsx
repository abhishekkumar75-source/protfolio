'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { InteractiveExperienceCanvas } from '@/components/3d/InteractiveExperience'
import { useQuality, useDevice } from '@/hooks/useDevice'

export function Experience() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [webglSupported, setWebglSupported] = useState(true)
  const quality = useQuality()
  const { isMobile: _isMobile } = useDevice()
  const { scrollY } = useScroll()
  const opacityProgress = useTransform(scrollY, [0, window.innerHeight * 0.3], [0, 1])
  const scaleProgress = useTransform(scrollY, [0, window.innerHeight], [1, 0.95])

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setWebglSupported(!!gl)
    } catch {
      setWebglSupported(false)
    }
  }, [])

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

  const show3D = isVisible && webglSupported && quality !== 'low'

  return (
    <section id="experience" className="relative min-h-[100vh] w-full overflow-hidden" ref={canvasRef}>
      <div className="absolute inset-0 z-0">
        {show3D ? (
          <InteractiveExperienceCanvas quality={quality} />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5"
            aria-hidden="true"
          />
        )}
      </div>

      <motion.div
        className="relative z-10 flex min-h-[100vh] items-center justify-center px-6 md:px-12"
        style={{ opacity: opacityProgress }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div className="max-w-[1400px] w-full text-center">
          <motion.div
            className="mb-8"
            style={{ transform: `scale(${scaleProgress})` }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="text-xs font-medium tracking-widest uppercase text-muted blend-text">
              03 / Experience
            </span>
            <motion.h2
              className="font-display font-light text-4xl md:text-6xl lg:text-7xl tracking-[-0.03em] mt-4 leading-[1.1] max-w-[900px] mx-auto blend-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Interactive digital
              <br />
              <span className="text-accent">craftsmanship.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            className="inline-block px-8 py-6 md:px-12 md:py-8 rounded-2xl bg-background/80 backdrop-blur-md border border-foreground/10"
            style={{ transform: `scale(${scaleProgress})` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.p
              className="text-lg md:text-xl font-light max-w-[700px] mx-auto leading-relaxed blend-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              This environment responds to your presence. Move your cursor to explore the scene —
              geometric structures orbit, particles flow, and light shifts in real-time. Built with
              Three.js and React Three Fiber, demonstrating real-time 3D graphics in the browser.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-16 flex items-center justify-center gap-8"
            style={{ transform: `scale(${scaleProgress})` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex items-center gap-3 text-sm blend-text">
              <div className="w-3 h-3 rounded-full bg-accent/50 animate-pulse" />
              <span>60fps</span>
            </div>
            <div className="w-px h-6 bg-foreground/20" />
            <div className="flex items-center gap-3 text-sm blend-text">
              <div className="w-3 h-3 rounded-full bg-silver/50" />
              <span>WebGL</span>
            </div>
            <div className="w-px h-6 bg-foreground/20" />
            <div className="flex items-center gap-3 text-sm blend-text">
              <div className="w-3 h-3 rounded-full bg-foreground/30" />
              <span>No libraries</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        style={{ opacity: opacityProgress }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="flex flex-col items-center gap-2 text-xs text-muted blend-text">
          <span className="tracking-widest uppercase">Continue scrolling</span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-foreground/20 to-transparent"
            animate={{ scaleY: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}