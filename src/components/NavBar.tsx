import { Fragment } from 'react'
import { sections, type SectionId } from '../data/content'
import styles from './NavBar.module.css'

interface Props {
  active: SectionId
  onNavigate: (id: SectionId) => void
}

export function NavBar({ active, onNavigate }: Props) {
  return (
    <nav className={styles.nav} aria-label="Sections">
      <span className={`${styles.line} ${styles.edge}`} />
      {sections.map(({ id, label }, i) => (
        <Fragment key={id}>
          {i > 0 && <span className={styles.line} />}
          <a
            href={`#${id}`}
            className={styles.link}
            aria-current={active === id ? 'location' : undefined}
            onClick={(e) => {
              e.preventDefault()
              onNavigate(id)
            }}
          >
            {label}
          </a>
        </Fragment>
      ))}
      <span className={`${styles.line} ${styles.edge}`} />
    </nav>
  )
}
