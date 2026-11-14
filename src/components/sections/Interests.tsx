'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Sparkles, Brain, Code, Globe, Calculator, Zap } from 'lucide-react'

const interests = [
  {
    number: '01',
    title: 'Artificial Intelligence',
    description: 'Exploring <span className="text-accent font-medium">neural networks</span>, <span className="text-accent font-medium">deep learning architectures</span>, and the frontier of <span className="text-accent font-medium">machine intelligence</span>.',
    icon: Brain,
    color: '#B7FF65',
  },
  {
    number: '02',
    title: 'Machine Learning',
    description: 'Building <span className="text-accent font-medium">models that learn from data</span> — from <span className="text-accent font-medium">classical algorithms</span> to <span className="text-accent font-medium">modern transformer architectures</span>.',
    icon: Sparkles,
    color: '#171717',
  },
  {
    number: '03',
    title: 'Software Engineering',
    description: 'Crafting <span className="text-accent font-medium">clean, scalable, and maintainable systems</span> with <span className="text-accent font-medium">modern development practices</span>.',
    icon: Code,
    color: '#C0C0C0',
  },
  {
    number: '04',
    title: 'Creative Development',
    description: 'Merging <span className="text-accent font-medium">code with creativity</span> — <span className="text-accent font-medium">generative art</span>, <span className="text-accent font-medium">interactive experiences</span>, and <span className="text-accent font-medium">digital craftsmanship</span>.',
    icon: Zap,
    color: '#B7FF65',
  },
  {
    number: '05',
    title: 'Web Technologies',
    description: 'Pushing the boundaries of what\'s possible in the <span className="text-accent font-medium">browser</span> with <span className="text-accent font-medium">modern frameworks</span> and <span className="text-accent font-medium">WebGL</span>.',
    icon: Globe,
    color: '#171717',
  },
  {
    number: '06',
    title: 'Mathematics',
    description: 'The universal language — <span className="text-accent font-medium">linear algebra</span>, <span className="text-accent font-medium">calculus</span>, <span className="text-accent font-medium">probability</span>, and the beauty of <span className="text-accent font-medium">mathematical structures</span>.',
    icon: Calculator,
    color: '#C0C0C0',
  },
]

interface InterestItemProps {
  item: typeof interests[0]
  index: number
  isActive: boolean
  onHover: () => void
  onLeave: () => void
}

function InterestItem({ item, index, isActive, onHover, onLeave }: InterestItemProps) {
  const Icon = item.icon

  return (
    <motion.div
      className={cn(
        'group relative cursor-pointer',
        'border-l-2 border-transparent transition-colors duration-500',
        isActive ? 'border-accent pl-6' : 'border-foreground/10 pl-6 hover:border-accent/50'
      )}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-start gap-4">
        <motion.div
          className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center overflow-hidden"
          animate={{
            scale: isActive ? 1.05 : 1,
            backgroundColor: isActive ? item.color + '20' : 'rgba(23,23,23,0.05)'
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.span
            className="absolute inset-0 bg-current opacity-0"
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ backgroundColor: item.color }}
          />
          <Icon
            className={cn(
              'relative z-10 w-6 h-6 transition-colors duration-300',
              isActive ? 'text-accent' : 'text-muted group-hover:text-foreground'
            )}
            style={{ color: isActive ? item.color : undefined }}
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          <motion.div
            className="flex items-baseline gap-3 mb-2"
            animate={{ opacity: isActive ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xs font-medium tracking-widest uppercase text-muted blend-text">
              {item.number}
            </span>
            <h3 className="font-display font-medium text-xl tracking-tight blend-text">
              {item.title}
            </h3>
          </motion.div>

          <motion.p
            className="text-foreground/70 leading-relaxed max-w-[400px] font-light blend-text"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isActive ? 1 : 0, height: isActive ? 'auto' : 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden' }}
          >
            <span dangerouslySetInnerHTML={{ __html: item.description }} />
          </motion.p>
        </div>
      </div>

      {/* Accent line */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full"
        style={{ backgroundColor: item.color }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isActive ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      />

      {/* Floating particles on hover */}
      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
        style={{ backgroundColor: item.color }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 0.6 : 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />
    </motion.div>
  )
}

export function Interests() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section id="interests" className="relative min-h-screen py-24 md:py-32 px-6 md:px-12">
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
            02 / Interests
          </span>
          <motion.h2
            className="font-display font-light text-4xl md:text-6xl lg:text-7xl tracking-[-0.03em] mt-4 leading-[1.1] blend-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            What fascinates me.
          </motion.h2>
          <motion.p
            className="mt-6 text-lg md:text-xl text-foreground/60 font-light max-w-[600px] mx-auto blend-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Areas I'm deeply curious about and actively exploring.
          </motion.p>
        </motion.div>

        {/* Interests list */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 md:gap-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {interests.map((item, index) => (
            <InterestItem
              key={item.title}
              item={item}
              index={index}
              isActive={activeIndex === index}
              onHover={() => setActiveIndex(index)}
              onLeave={() => setActiveIndex(null)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}