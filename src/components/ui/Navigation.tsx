'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useDevice } from '@/hooks/useDevice'

const navItems = [
  { href: '#about', label: 'About' },
  { href: '#interests', label: 'Interests' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export function Navigation() {
  const { isMobile: _isMobile } = useDevice()
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isDark, setIsDark] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    )

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark
    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle('dark', newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <motion.nav
      className={cn(
        'fixed top-0 left-0 right-0 z-[1000] px-6 md:px-12',
        'transition-all duration-500 ease-out',
        isScrolled
          ? 'py-4 bg-background/80 backdrop-blur-md border-b border-foreground/5'
          : 'py-6 bg-transparent'
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center justify-between max-w-[1400px] mx-auto">
        <motion.div
          className="font-display font-medium text-lg tracking-tight"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Abhishek Kumar
        </motion.div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item, index) => (
            <motion.a
              key={item.href}
              href={item.href}
              className={cn(
                'relative text-sm font-medium tracking-wide',
                'transition-colors duration-300',
                activeSection === item.href.slice(1) ? 'text-accent' : 'text-muted hover:text-foreground'
              )}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={closeMenu}
            >
              {item.label}
              <motion.span
                className="absolute bottom-[-4px] left-0 h-0.5 bg-accent rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: activeSection === item.href.slice(1) ? 1 : 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </motion.a>
          ))}
        </div>

        <motion.div
          className="hidden md:flex items-center gap-3 text-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <span className="relative px-3 py-1 rounded-full border border-foreground/10 bg-foreground/5 text-muted">
            Currently learning & building
          </span>

          <button
            onClick={toggleTheme}
            className="relative p-2 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 text-muted hover:text-foreground"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <motion.div
              initial={{ rotate: isDark ? 180 : 0, scale: 0.8 }}
              animate={{ rotate: isDark ? 0 : 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </button>
        </motion.div>

        {/* Mobile menu button */}
        <motion.button
          className="md:hidden p-2 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-accent/50 transition-all duration-300 text-muted hover:text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          whileTap={{ scale: 0.95 }}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Mobile menu */}
      <motion.div
        className={cn(
          'md:hidden absolute top-full left-0 right-0 px-6 pb-6 bg-background/95 backdrop-blur-md border-b border-foreground/5',
          'flex flex-col items-start gap-4'
        )}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isMenuOpen ? 1 : 0, height: isMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {navItems.map((item, index) => (
          <motion.a
            key={item.href}
            href={item.href}
            className={cn(
              'w-full text-left px-4 py-3 rounded-xl text-base font-medium',
              'transition-colors duration-300',
              activeSection === item.href.slice(1) ? 'text-accent bg-accent/10' : 'text-muted hover:text-foreground hover:bg-foreground/5'
            )}
            onClick={closeMenu}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
          >
            {item.label}
          </motion.a>
        ))}
        <motion.div
          className="w-full pt-4 flex items-center justify-between gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <span className="flex-1 px-4 py-2 rounded-full border border-foreground/10 bg-foreground/5 text-sm text-muted">
            Currently learning & building
          </span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 text-muted hover:text-foreground"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </motion.div>
      </motion.div>
    </motion.nav>
  )
}