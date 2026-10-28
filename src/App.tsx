import { About } from './components/About'
import { Education } from './components/Education'
import { Experience } from './components/Experience'
import { GlitterBackground } from './components/GlitterBackground'
import { Header } from './components/Header'
import { Projects } from './components/Projects'
import { Resume } from './components/Resume'
import { sections } from './data/content'
import { useSectionNavigation } from './hooks/useSectionNavigation'
import styles from './App.module.css'

const ids = sections.map((s) => s.id)

export default function App() {
  const { panelRef, active, navigate } = useSectionNavigation(ids)

  return (
    <>
      <GlitterBackground />
      <Header active={active} onNavigate={navigate} />
      <main ref={panelRef} className={styles.panel}>
        <About />
        <Education />
        <Experience />
        <Projects />
        <Resume />
      </main>
    </>
  )
}
