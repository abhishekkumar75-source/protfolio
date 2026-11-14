'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Mail, Github, Linkedin, ArrowRight } from 'lucide-react'

const contacts = [
  {
    label: 'Email',
    value: 'abhisheksmart811@gmail.com',
    href: 'mailto:abhisheksmart811@gmail.com',
    icon: Mail,
  },
  {
    label: 'GitHub',
    value: 'github.com/abhishekkumar75-source',
    href: 'https://github.com/abhishekkumar75-source',
    icon: Github,
    external: true,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/abhishek-undefined-5b166944b',
    href: 'https://www.linkedin.com/in/abhishek-undefined-5b166944b/',
    icon: Linkedin,
    external: true,
  },
]

export function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-20 md:mb-28 text-center max-w-[800px] mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="text-xs font-medium tracking-widest uppercase text-muted blend-text">
            05 / Contact
          </span>
          <motion.h2
            className="font-display font-light text-4xl md:text-6xl lg:text-7xl tracking-[-0.03em] mt-4 leading-[1.1] blend-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Have an interesting idea?
          </motion.h2>
          <motion.p
            className="mt-6 text-lg md:text-xl text-muted font-light max-w-[600px] mx-auto blend-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            I'm always interested in exploring ideas, learning something new and building meaningful things.
          </motion.p>
        </motion.div>

        {/* Contact links */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 max-w-[800px] mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {contacts.map((contact, index) => (
            <motion.a
              key={contact.label}
              href={contact.href}
              target={contact.external ? '_blank' : undefined}
              rel={contact.external ? 'noopener noreferrer' : undefined}
              className={cn(
                'group relative flex items-center gap-4 p-6',
                'bg-foreground/5 border border-foreground/10',
                'hover:border-accent/50 hover:bg-accent/5',
                'transition-all duration-500 ease-out'
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ x: 8 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(183, 255, 101, 0.1)' }}
                transition={{ duration: 0.3 }}
              >
                <contact.icon
                  className="relative z-10 w-6 h-6 text-muted group-hover:text-accent transition-colors duration-300"
                />
                <motion.span
                  className="absolute inset-0 bg-accent opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              <div className="flex-1 min-w-0 text-left">
                <span className="text-xs font-medium tracking-widest uppercase text-muted blend-text">
                  {contact.label}
                </span>
                <p className="mt-1 font-medium text-foreground truncate blend-text">
                  {contact.value}
                </p>
              </div>

              <motion.div
                className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-muted group-hover:text-accent transition-colors duration-300"
                whileHover={{ rotate: 45, scale: 1.1 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.a>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="mt-24 md:mt-32 pt-12 border-t border-foreground/10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted blend-text">
              2026
            </span>
            <div className="w-24 h-px bg-gradient-to-l from-transparent via-foreground/20 to-transparent" />
          </div>
          <p className="text-muted font-light tracking-wide blend-text">
            Designed with curiosity. Built with intention.
          </p>
        </motion.footer>
      </div>
    </section>
  )
}