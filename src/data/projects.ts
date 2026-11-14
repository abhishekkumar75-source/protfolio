import { Code, Server } from 'lucide-react'

export type ProjectStatus = 'Completed' | 'In Progress' | 'Planning' | 'Experimental'

export interface Project {
  id: string
  name: string
  description: string
  longDescription: string
  problem: string
  solution: string
  techStack: string[]
  languages: string[]
  category: string
  githubUrl: string
  demoUrl: string | null
  status: ProjectStatus
  featured: boolean
  createdAt: string
  updatedAt: string
  stars: number
  forks: number
  topics: string[]
  hasLiveDemo: boolean
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export const projects: Project[] = [
  {
    id: 'reddys-store',
    name: 'Reddy\'s Store API',
    description: '<span className="text-accent font-medium">FastAPI-based e-commerce backend</span> with <span className="text-accent font-medium">order management</span>, <span className="text-accent font-medium">invoicing</span>, and <span className="text-accent font-medium">coupon system</span> for a college presentation.',
    longDescription: `A complete <span className="text-accent font-medium">RESTful e-commerce API</span> built with <span className="text-accent font-medium">FastAPI (Python)</span> demonstrating modern backend development practices.
    Features include <span className="text-accent font-medium">product catalog management</span>, <span className="text-accent font-medium">shopping cart with checkout flow</span>, <span className="text-accent font-medium">order persistence</span> with
    <span className="text-accent font-medium">JSON-based storage</span>, <span className="text-accent font-medium">automated invoice generation</span>, and a <span className="text-accent font-medium">coupon discount system</span>.

    The API includes interactive <span className="text-accent font-medium">Swagger/OpenAPI documentation</span> at /docs, making it easy to test endpoints.
    Built with <span className="text-accent font-medium">Uvicorn ASGI server</span>, <span className="text-accent font-medium">Pydantic for data validation</span>, and follows <span className="text-accent font-medium">REST conventions</span> with proper
    HTTP status codes and error handling. Designed as a college presentation project showcasing
    full <span className="text-accent font-medium">CRUD operations</span> and business logic implementation.`,
    problem: 'Build a functional <span className="text-accent font-medium">e-commerce backend API</span> from scratch for a college presentation, demonstrating <span className="text-accent font-medium">REST API design</span>, <span className="text-accent font-medium">data validation</span>, <span className="text-accent font-medium">order processing</span>, and <span className="text-accent font-medium">invoice generation</span>.',
    solution: 'Implemented with <span className="text-accent font-medium">FastAPI</span> for automatic OpenAPI docs, <span className="text-accent font-medium">Pydantic models</span> for request/response validation, <span className="text-accent font-medium">JSON file storage</span> for persistence (no external DB required for demo), and <span className="text-accent font-medium">Uvicorn</span> for high-performance ASGI serving.',
    techStack: ['Python', 'FastAPI', 'Uvicorn', 'Pydantic', 'Pydantic Settings', 'JSON Storage', 'Swagger UI'],
    languages: ['Python'],
    category: 'Web Applications',
    githubUrl: 'https://github.com/abhishekkumar75-source/Reddy-s-store',
    demoUrl: null,
    status: 'Completed',
    featured: true,
    createdAt: '2026-06-09',
    updatedAt: '2026-06-09',
    stars: 0,
    forks: 0,
    topics: ['fastapi', 'ecommerce', 'api', 'python', 'college-project', 'rest-api'],
    hasLiveDemo: false,
    icon: Server,
    color: '#171717',
  },
  {
    id: 'scientific-calculator',
    name: 'Scientific Calculator (React + Vite)',
    description: '<span className="text-accent font-medium">React + Vite starter template</span> configured for a <span className="text-accent font-medium">scientific calculator</span> — minimal setup with <span className="text-accent font-medium">HMR</span> and <span className="text-accent font-medium">ESLint</span>.',
    longDescription: `A minimal <span className="text-accent font-medium">React + Vite project template</span> initialized for building a <span className="text-accent font-medium">scientific calculator application</span>.
    The repository contains the foundational setup with <span className="text-accent font-medium">fast refresh (HMR)</span> via @vitejs/plugin-react,
    <span className="text-accent font-medium">ESLint configuration</span>, and modern tooling. It serves as a starting point for a calculator that would
    handle <span className="text-accent font-medium">trigonometry</span>, <span className="text-accent font-medium">calculus equations</span>, and <span className="text-accent font-medium">scientific functions</span>.

    Currently a <span className="text-accent font-medium">template/scaffold</span> — the actual calculator logic would be implemented on top of this foundation.
    Demonstrates familiarity with <span className="text-accent font-medium">modern React tooling</span>, <span className="text-accent font-medium">Vite build system</span>, and <span className="text-accent font-medium">project scaffolding</span>.`,
    problem: 'Set up a modern <span className="text-accent font-medium">React development environment</span> optimized for building a <span className="text-accent font-medium">scientific calculator</span> with <span className="text-accent font-medium">trigonometric</span> and <span className="text-accent font-medium">calculus functions</span>.',
    solution: 'Initialized with <span className="text-accent font-medium">Vite + React + Babel</span> for fast HMR, configured <span className="text-accent font-medium">ESLint</span> for code quality, and structured for <span className="text-accent font-medium">TypeScript migration</span>. Ready for calculator component implementation.',
    techStack: ['React', 'Vite', 'JavaScript', 'Babel', 'ESLint', 'HMR'],
    languages: ['JavaScript', 'HTML', 'CSS'],
    category: 'Experiments',
    githubUrl: 'https://github.com/abhishekkumar75-source/Simple-scienctific-calucalator-',
    demoUrl: null,
    status: 'Experimental',
    featured: false,
    createdAt: '2025-11-24',
    updatedAt: '2025-11-24',
    stars: 0,
    forks: 0,
    topics: ['react', 'vite', 'calculator', 'template', 'starter', 'javascript'],
    hasLiveDemo: false,
    icon: Code,
    color: '#C0C0C0',
  },
]

export const githubProfile = {
  username: 'abhishekkumar75-source',
  name: 'Abhishek',
  bio: 'A teen coder!😎',
  avatarUrl: 'https://avatars.githubusercontent.com/u/245905045?v=4',
  profileUrl: 'https://github.com/abhishekkumar75-source',
  publicRepos: 3,
  followers: 0,
  following: 0,
  createdAt: '2025-11-24',
  updatedAt: '2026-10-19',
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(p => p.featured)
}

export function getProjectsByCategory(category: string): Project[] {
  return projects.filter(p => p.category === category)
}

export function getAllCategories(): string[] {
  return [...new Set(projects.map(p => p.category))]
}