'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useDevice } from '@/hooks/useDevice'

export function CustomCursor() {
  const { isMobile, prefersReducedMotion } = useDevice()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const followerX = useRef(0)
  const followerY = useRef(0)
  const rafRef = useRef<number>()

  // Disable entirely on mobile or reduced motion
  if (isMobile || prefersReducedMotion) return null

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', updatePosition, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mouseenter', handleMouseEnter)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isVisible])

  // Smooth follower animation - use refs to avoid re-renders
  useEffect(() => {
    const animate = () => {
      if (followerRef.current) {
        followerX.current += (position.x - followerX.current) * 0.15
        followerY.current += (position.y - followerY.current) * 0.15
        followerRef.current.style.transform = `translate(${followerX.current}px, ${followerY.current}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [position])

  if (!isVisible) return null

  return (
    <>
      <motion.div
        ref={cursorRef}
        className={cn(
          'fixed pointer-events-none z-[9999] mix-blend-difference',
          'w-1.5 h-1.5 rounded-full border-2 border-foreground',
          'transition-transform duration-100 ease-out'
        )}
        style={{
          transform: `translate(${position.x - 8}px, ${position.y - 8}px) ${isClicking ? 'scale(0.7)' : 'scale(1)'}`,
        }}
        animate={{
          scale: isClicking ? 0.7 : 1,
          borderColor: isClicking ? '#B7FF65' : '#171717',
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />
      <div
        ref={followerRef}
        className="fixed pointer-events-none z-[9998] w-6 h-6 rounded-full border border-foreground/30 mix-blend-difference translate-x-[-50%] translate-y-[-50%]"
        style={{ willChange: 'transform' }}
      />
    </>
  )
}