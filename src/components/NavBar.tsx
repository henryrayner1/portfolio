import { Fragment, useEffect, useId, useRef, useState } from 'react'
import { sections, type SectionId } from '../data/content'
import { AVOID_ATTR } from './CrackBackground'
import styles from './NavBar.module.css'

interface Props {
  active: SectionId
  onNavigate: (id: SectionId) => void
}

// Matches the 800px mobile breakpoint in NavBar.module.css.
const MOBILE_QUERY = '(max-width: 800px)'

/**
 * A row of section links on desktop. On phones the row collapses behind a
 * menu button and opens as a dropdown under the header.
 */
export function NavBar({ active, onNavigate }: Props) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // While open: Esc closes (and returns focus to the button), so does a tap
  // anywhere outside the menu, and so does widening past the breakpoint.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    const onPointer = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const mobile = window.matchMedia(MOBILE_QUERY)
    const onBreakpoint = () => {
      if (!mobile.matches) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    mobile.addEventListener('change', onBreakpoint)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      mobile.removeEventListener('change', onBreakpoint)
    }
  }, [open])

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.menuButton} ${open ? styles.menuButtonOpen : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden className={styles.bars}>
          <span />
          <span />
          <span />
        </span>
      </button>

      <nav
        id={menuId}
        className={`${styles.nav} ${open ? styles.open : ''}`}
        aria-label="Sections"
        {...{ [AVOID_ATTR]: '' }}
      >
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
                setOpen(false)
                onNavigate(id)
              }}
            >
              {label}
            </a>
          </Fragment>
        ))}
        <span className={`${styles.line} ${styles.edge}`} />
      </nav>
    </div>
  )
}
