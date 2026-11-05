import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Sections are stacked inside a panel that users can't scroll directly; each section
 * scrolls on its own. Navigating smooth-scrolls the panel to the chosen section.
 */
export function useSectionNavigation<T extends string>(ids: readonly T[]) {
  const panelRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState<T>(() => {
    const hash = window.location.hash.slice(1) as T
    return ids.includes(hash) ? hash : ids[0]
  })

  // Read inside navigate without re-creating it on every section change.
  const activeRef = useRef(active)
  activeRef.current = active

  const scrollToSection = useCallback((id: T, behavior: ScrollBehavior) => {
    const section = document.getElementById(id)
    if (section) panelRef.current?.scrollTo({ top: section.offsetTop, behavior })
  }, [])

  const navigate = useCallback(
    (id: T) => {
      const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
      // Every visit starts at the top of the section. Arriving from elsewhere,
      // the section is off screen, so it can jump there unseen; choosing the
      // section you're already on scrolls it back up instead.
      const scroller = document
        .getElementById(id)
        ?.querySelector<HTMLElement>('[data-section-scroller]')
      if (id === activeRef.current) scroller?.scrollTo({ top: 0, behavior })
      else if (scroller) scroller.scrollTop = 0

      setActive(id)
      history.replaceState(null, '', `#${id}`)
      scrollToSection(id, behavior)
    },
    [scrollToSection],
  )

  // Jump straight to the section in the URL on first load.
  useLayoutEffect(() => {
    scrollToSection(active, 'auto')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the panel aligned when the viewport resizes, and keep keyboard focus
  // (Tab) inside the visible section so the browser never scrolls to a hidden one.
  useEffect(() => {
    ids.forEach((id) => {
      const section = document.getElementById(id)
      if (section) section.inert = id !== active
    })

    const realign = () => scrollToSection(active, 'auto')
    window.addEventListener('resize', realign)
    return () => window.removeEventListener('resize', realign)
  }, [active, ids, scrollToSection])

  // Manual hash edits and back/forward.
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.slice(1) as T
      if (ids.includes(hash)) navigate(hash)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [ids, navigate])

  return { panelRef, active, navigate }
}
