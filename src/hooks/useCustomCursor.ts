import { useState, useEffect, useRef, useCallback } from 'react'

interface CursorPosition {
  x: number
  y: number
}

export function useCustomCursor() {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const rafRef = useRef<number>()

  const updatePosition = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
    if (!isVisible) setIsVisible(true)
  }, [isVisible])

  useEffect(() => {
    window.addEventListener('mousemove', updatePosition)
    window.addEventListener('mouseleave', () => setIsVisible(false))
    window.addEventListener('mouseenter', () => setIsVisible(true))

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('mouseleave', () => setIsVisible(false))
      window.removeEventListener('mouseenter', () => setIsVisible(true))
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [updatePosition])

  return { position, isVisible, isHovering, setIsHovering }
}