import { useEffect, useState } from 'react'
import { profile, type SectionId } from '../data/content'
import { NavBar } from './NavBar'
import styles from './Header.module.css'

interface Props {
  active: SectionId
  onNavigate: (id: SectionId) => void
}

export function Header({ active, onNavigate }: Props) {
  const [hasSignature, setHasSignature] = useState(true)

  // The signature renders as a CSS mask so it can take a theme color;
  // probe the file separately so it stays hidden until it exists.
  useEffect(() => {
    const probe = new Image()
    probe.onerror = () => setHasSignature(false)
    probe.src = profile.signature
  }, [])

  return (
    <header className={styles.header}>
      <a
        href="#about"
        className={styles.brand}
        onClick={(e) => {
          e.preventDefault()
          onNavigate('about')
        }}
      >
        {hasSignature && (
          <span
            aria-hidden
            className={styles.signature}
            style={{ maskImage: `url(${profile.signature})` }}
          />
        )}
        <span className={styles.name}>{profile.name}</span>
      </a>
      <NavBar active={active} onNavigate={onNavigate} />
    </header>
  )
}
