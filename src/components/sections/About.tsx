'use client'

import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { AboutOrbitCanvas } from '@/components/3d/AboutOrbit'
import { useQuality, useDevice } from '@/hooks/useDevice'

export function About() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(true)
  const [webglSupported, setWebglSupported] = useState(true)
  const quality = useQuality()
  const { isMobile: _isMobile } = useDevice()

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setWebglSupported(!!gl)
    } catch {
      setWebglSupported(false)
    }
  }, [])

  useEffect(() => {
    if (quality === 'low' || !webglSupported) return

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
  }, [quality, webglSupported])

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
    <section id="about" className="relative min-h-screen flex" ref={canvasRef}>
      <div className="absolute inset-0 z-0 overflow-hidden">
        {show3D ? (
          <AboutOrbitCanvas mousePosition={mousePosition} quality={quality} />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="relative z-10 flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center">
        <div className="w-full">
          {/* Section header */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="text-xs font-medium tracking-widest uppercase text-muted blend-text">
              01 / About
            </span>
            <motion.h2
              className="font-display font-light text-4xl md:text-6xl lg:text-7xl tracking-[-0.03em] mt-4 leading-[1.1] max-w-[800px] blend-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              A little about <span className="text-accent font-medium">me</span>.
            </motion.h2>
          </motion.div>

          {/* About content */}
          <motion.div
            className="grid md:grid-cols-12 gap-12 items-start"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="md:col-span-7">
              <div className="space-y-6 text-lg md:text-xl leading-relaxed font-light blend-text">
                <motion.p
                  className="max-w-[600px]"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                >
                  I'm a student passionate about <span className="text-accent font-medium">technology</span>, <span className="text-accent font-medium">programming</span>, <span className="text-accent font-medium">artificial intelligence</span> and building meaningful digital experiences.
                </motion.p>
                <motion.p
                  className="max-w-[600px]"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  I'm constantly exploring new <span className="text-accent font-medium">technologies</span>, experimenting with <span className="text-accent font-medium">ideas</span> and developing my skills in <span className="text-accent font-medium">software engineering</span>, <span className="text-accent font-medium">AI</span> and <span className="text-accent font-medium">machine learning</span>.
                </motion.p>
                <motion.p
                  className="max-w-[600px]"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  I believe in <span className="text-accent font-medium">learning by building</span>, <span className="text-accent font-medium">thinking creatively</span> and pushing beyond <span className="text-accent font-medium">conventional boundaries</span>.
                </motion.p>
                <motion.p
                  className="max-w-[600px]"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Currently exploring the intersection of <span className="text-accent font-medium">artificial intelligence</span>, <span className="text-accent font-medium">engineering</span> and <span className="text-accent font-medium">creative technology</span>.
                </motion.p>
              </div>
            </div>

            {/* Visual accent on the right - simplified for mobile */}
            <div className="md:col-span-5 relative">
              <div className="aspect-square relative hidden md:block">
                <svg
                  className="absolute inset-0 w-full h-full opacity-30"
                  viewBox="0 0 400 400"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#B7FF65" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#171717" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="200"
                    cy="200"
                    r="180"
                    fill="none"
                    stroke="url(#accentGradient)"
                    strokeWidth="1"
                    strokeDasharray="20 40"
                  />
                  <circle
                    cx="200"
                    cy="200"
                    r="120"
                    fill="none"
                    stroke="#171717"
                    strokeWidth="0.5"
                    strokeDasharray="10 30"
                    opacity="0.3"
                  />
                  <circle
                    cx="200"
                    cy="200"
                    r="60"
                    fill="none"
                    stroke="#B7FF65"
                    strokeWidth="0.5"
                    opacity="0.5"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}