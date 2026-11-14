import { Navigation } from '@/components/ui/Navigation'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Interests } from '@/components/sections/Interests'
import { Experience } from '@/components/sections/InteractiveExperience'
import { Projects } from '@/components/sections/Projects'
import { Contact } from '@/components/sections/Contact'

function App() {
  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <Navigation />
      <main className="relative">
        <Hero />
        <About />
        <Interests />
        <Experience />
        <Projects />
        <Contact />
      </main>
    </>
  )
}

export default App