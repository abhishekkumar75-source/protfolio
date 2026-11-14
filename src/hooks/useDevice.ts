import { useState, useEffect } from 'react'

export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  prefersReducedMotion: boolean
  pixelRatio: number
  hasWebGL2: boolean
}

export function useDevice(): DeviceInfo {
  const [device, setDevice] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    prefersReducedMotion: false,
    pixelRatio: 1,
    hasWebGL2: false,
  })

  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const pixelRatio = Math.min(window.devicePixelRatio, 2)

      let hasWebGL2 = false
      try {
        const canvas = document.createElement('canvas')
        hasWebGL2 = !!canvas.getContext('webgl2')
      } catch {}

      setDevice({
        isMobile,
        isTablet,
        isDesktop: !isMobile && !isTablet,
        prefersReducedMotion,
        pixelRatio,
        hasWebGL2,
      })
    }

    updateDevice()
    window.addEventListener('resize', updateDevice, { passive: true })
    return () => window.removeEventListener('resize', updateDevice)
  }, [])

  return device
}

export function useQuality(): 'low' | 'medium' | 'high' {
  const { isMobile, isTablet, prefersReducedMotion, hasWebGL2 } = useDevice()

  if (prefersReducedMotion) return 'low'
  if (isMobile) return 'low'
  if (isTablet) return 'medium'
  if (!hasWebGL2) return 'medium'
  return 'high'
}