'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Github, ExternalLink, ChevronRight, Star, GitFork, Code2, Globe, Server, Sparkles } from 'lucide-react'
import { projects, githubProfile, type Project } from '@/data/projects'

const statusStyles: Record<Project['status'], string> = {
  Completed: 'bg-accent text-foreground',
  'In Progress': 'bg-silver/20 text-silver border border-silver/30',
  Planning: 'bg-foreground/5 text-muted border border-foreground/10',
  Experimental: 'bg-accent/20 text-accent border border-accent/30',
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Creative & Personal': Globe,
  'Web Applications': Server,
  'Experiments': Sparkles,
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = project.icon
  const CategoryIcon = categoryIcons[project.category] || Code2

  return (
    <motion.article
      className={cn(
        'group relative overflow-hidden bg-foreground/5 border border-foreground/10',
        'transition-all duration-500 ease-out',
        isHovered && 'border-accent/30 shadow-[0_20px_60px_-10px_rgba(23,23,23,0.1)]'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        transform: isHovered
          ? 'perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-8px)'
          : 'none',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Preview area with animated background */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-accent/5"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Decorative geometric pattern */}
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
            <defs>
              <pattern id={`grid-${project.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="400" height="300" fill={`url(#grid-${project.id})`} />
          </svg>
        </div>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-24 h-24 rounded-2xl border border-foreground/10 bg-foreground/5 flex items-center justify-center"
            animate={{
              rotate: isHovered ? 180 : 0,
              scale: isHovered ? 1.1 : 1,
              borderColor: isHovered ? project.color : 'rgba(23,23,23,0.1)',
              backgroundColor: isHovered ? `${project.color}15` : 'rgba(23,23,23,0.05)',
            }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Icon className={cn('w-10 h-10 transition-colors duration-300', isHovered ? 'text-accent' : 'text-muted')} />
          </motion.div>
        </div>

        {/* Status badge */}
        <motion.div
          className="absolute top-4 left-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className={cn(
            'px-3 py-1 text-xs font-medium tracking-widest uppercase rounded-full',
            statusStyles[project.status]
          )}>
            {project.status}
          </span>
        </motion.div>

        {/* Category tag */}
        <motion.div
          className="absolute top-4 right-4 flex items-center gap-1.5"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CategoryIcon className="w-3 h-3 text-muted/50" />
          <span className="text-xs font-medium text-muted/70 uppercase tracking-wide hidden sm:block">
            {project.category}
          </span>
        </motion.div>

        {/* Links on hover */}
        <motion.div
          className="absolute bottom-4 right-4 flex gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
        >
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-background/80 backdrop-blur-sm border border-foreground/10 flex items-center justify-center text-muted hover:text-foreground hover:border-accent/50 transition-all duration-300"
            aria-label={`View ${project.name} on GitHub`}
          >
            <Github className="w-5 h-5" />
          </a>
          {project.hasLiveDemo && project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-background/80 backdrop-blur-sm border border-foreground/10 flex items-center justify-center text-muted hover:text-foreground hover:border-accent/50 transition-all duration-300"
              aria-label={`View ${project.name} live demo`}
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Tech stack preview */}
        <motion.div
          className="flex items-center gap-2 flex-wrap"
          animate={{ opacity: isHovered ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
        >
          {project.languages.slice(0, 3).map((lang) => (
            <span
              key={lang}
              className="px-2 py-0.5 text-xs font-medium tracking-wide rounded bg-foreground/5 text-muted border border-foreground/10"
            >
              {lang}
            </span>
          ))}
          {project.languages.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-medium tracking-wide rounded bg-foreground/5 text-muted/50 border border-foreground/10">
              +{project.languages.length - 3} more
            </span>
          )}
        </motion.div>

        <motion.h3
          className="font-display font-medium text-xl tracking-tight blend-text group-hover:text-accent transition-colors duration-300"
        >
          {project.name}
        </motion.h3>

        <motion.p
          className="text-foreground/70 leading-relaxed font-light blend-text"
        >
          <span dangerouslySetInnerHTML={{ __html: project.description }} />
        </motion.p>

        {/* GitHub stats */}
        <motion.div
          className="flex items-center gap-4 text-xs text-muted/60 pt-2 border-t border-foreground/5 blend-text"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {project.stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            {project.forks}
          </span>
          <span className="flex items-center gap-1">
            <Code2 className="w-3 h-3" />
            {project.techStack.length} technologies
          </span>
        </motion.div>
      </div>

      {/* Accent line at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ transformOrigin: 'left' }}
      />
    </motion.article>
  )
}

function ProjectDetailModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  if (!project) return null

  const Icon = project.icon
  const CategoryIcon = categoryIcons[project.category] || Code2

  return (
    <motion.div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <motion.div
        className="fixed inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border border-foreground/10 rounded-2xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 md:p-8 border-b border-foreground/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center justify-center text-muted hover:text-foreground hover:border-accent/50 transition-all duration-300"
            aria-label="Close project details"
          >
            <ChevronRight className="w-5 h-5 rotate-45" />
          </button>

          <div className="flex items-start gap-4">
            <motion.div
              className="w-16 h-16 rounded-2xl border border-foreground/10 bg-foreground/5 flex items-center justify-center flex-shrink-0"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ borderColor: `${project.color}40`, backgroundColor: `${project.color}10` }}
            >
              <span style={{ color: project.color }}><Icon className="w-8 h-8" /></span>
            </motion.div>

            <motion.div className="flex-1 min-w-0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: project.color }}><CategoryIcon className="w-4 h-4" /></span>
                <span className="text-xs font-medium tracking-widest uppercase" style={{ color: project.color }}>
                  {project.category}
                </span>
                <span className={cn(
                  'px-2 py-0.5 text-xs font-medium tracking-widest uppercase rounded-full',
                  statusStyles[project.status]
                )}>
                  {project.status}
                </span>
              </div>
              <h2 id="project-modal-title" className="font-display font-medium text-2xl md:text-3xl tracking-tight text-foreground">
                {project.name}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-2.5 py-1 text-xs font-medium tracking-wide rounded bg-foreground/5 text-muted border border-foreground/10"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="font-display font-medium text-lg tracking-tight blend-text mb-3">
              Overview
            </h3>
            <p className="text-foreground/70 leading-relaxed font-light blend-text">
              <span dangerouslySetInnerHTML={{ __html: project.longDescription }} />
            </p>
          </motion.div>

          {/* Problem & Solution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/10">
                <h4 className="font-medium text-sm tracking-wide uppercase text-muted blend-text mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Problem
                </h4>
                <p className="text-foreground/70 leading-relaxed text-sm blend-text">
                  <span dangerouslySetInnerHTML={{ __html: project.problem }} />
                </p>
              </div>
              <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/10">
                <h4 className="font-medium text-sm tracking-wide uppercase text-muted blend-text mb-3 flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Solution
                </h4>
                <p className="text-foreground/70 leading-relaxed text-sm blend-text">
                  <span dangerouslySetInnerHTML={{ __html: project.solution }} />
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h3 className="font-display font-medium text-lg tracking-tight blend-text mb-4">
              Technology Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-sm font-medium tracking-wide rounded-lg bg-foreground/5 text-foreground border border-foreground/10 hover:border-accent/50 transition-colors blend-text"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            className="flex flex-wrap gap-3 pt-4 border-t border-foreground/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-accent/50 hover:bg-accent/5 text-foreground transition-all duration-300 blend-text"
            >
              <Github className="w-5 h-5" />
              <span className="font-medium">View Source Code</span>
            </a>
            {project.hasLiveDemo && project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-foreground hover:opacity-90 transition-opacity font-medium"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Live Demo</span>
              </a>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function GitHubProfileCard() {
  const [profile, setProfile] = useState<typeof githubProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('https://api.github.com/users/abhishekkumar75-source')
        if (response.ok) {
          const data = await response.json()
          setProfile({
            ...githubProfile,
            publicRepos: data.public_repos,
            followers: data.followers,
            following: data.following,
            avatarUrl: data.avatar_url,
            bio: data.bio,
          })
        } else {
          setProfile(githubProfile)
        }
      } catch {
        setProfile(githubProfile)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <motion.div
        className="p-6 md:p-8 bg-foreground/5 border border-foreground/10 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-foreground/10 animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-1/3 bg-foreground/10 animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-foreground/10 animate-pulse rounded" />
          </div>
        </div>
      </motion.div>
    )
  }

  const displayProfile = profile ?? githubProfile

  return (
    <motion.div
      className="p-6 md:p-8 bg-foreground/5 border border-foreground/10 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 rounded-2xl border border-foreground/10 bg-foreground/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img
            src={displayProfile.avatarUrl}
            alt={displayProfile.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-2">
            <h3 className="font-display font-medium text-xl tracking-tight text-foreground">
              {displayProfile.name}
            </h3>
            <a
              href={displayProfile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-accent transition-colors flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              @{displayProfile.username}
            </a>
          </div>

          <p className="text-muted font-light mb-4">{displayProfile.bio}</p>

          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-1.5 text-muted/70">
              <Code2 className="w-4 h-4" />
              <span>{displayProfile.publicRepos} repositories</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted/70">
              <Star className="w-4 h-4" />
              <span>{displayProfile.followers} followers</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const featuredProjects = projects.filter(p => p.featured)
  const otherProjects = projects.filter(p => !p.featured)

  return (
    <section id="projects" className="relative py-24 md:py-32 px-6 md:px-12">
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
            04 / Selected Explorations
          </span>
          <motion.h2
            className="font-display font-light text-4xl md:text-6xl lg:text-7xl tracking-[-0.03em] mt-4 leading-[1.1] blend-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            A collection of things I&apos;ve <span className="text-accent font-medium">built</span>, <span className="text-accent font-medium">experimented with</span> and <span className="text-accent font-medium">explored</span>.
          </motion.h2>
        </motion.div>

        {/* Featured Projects - Large Cards */}
        {featuredProjects.length > 0 && (
          <motion.div
            className="mb-24 md:mb-32"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Other Projects - Grid */}
        {otherProjects.length > 0 && (
          <motion.div
            className="mb-24 md:mb-32"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h3 className="font-display font-light text-3xl md:text-4xl tracking-tight blend-text mb-8">
              Other Experiments
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {otherProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* GitHub Profile */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <GitHubProfileCard />
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <a
            href={githubProfile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-foreground/10 bg-foreground/5 hover:border-accent/50 transition-all duration-300"
          >
            <span className="text-sm font-medium tracking-wide text-foreground">
              View all on GitHub
            </span>
            <motion.div
              className="w-8 h-8 rounded-full bg-accent flex items-center justify-center"
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <ChevronRight className="w-4 h-4 text-foreground" />
            </motion.div>
          </a>
        </motion.div>

        {/* Project Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  )
}