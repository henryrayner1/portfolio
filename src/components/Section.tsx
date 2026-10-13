import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { SectionId } from '../data/content'
import styles from './Section.module.css'

interface Props {
  id: SectionId
  title?: string
  centeredTitle?: boolean
  className?: string
  children: ReactNode
}

export function Section({ id, title, centeredTitle, className = '', children }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hasMore, setHasMore] = useState(false)
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

  // Show the bottom fade while there's more content below.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const update = () => {
      setHasMore(el.scrollHeight - el.scrollTop - el.clientHeight > 4)
      setScrollbarWidth(el.offsetWidth - el.clientWidth)
    }
    update()

    // Content can grow after mount (fonts, images), so watch the children too.
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(el)
    for (const child of el.children) resizeObserver.observe(child)

    el.addEventListener('scroll', update, { passive: true })
    return () => {
      resizeObserver.disconnect()
      el.removeEventListener('scroll', update)
    }
  }, [])

  return (
    <section id={id} className={styles.section}>
      <div ref={scrollRef} className={`${styles.scroller} ${className}`}>
        {title && (
          <h2 className={centeredTitle ? styles.centeredTitle : styles.title}>{title}</h2>
        )}
        {children}
      </div>
      <div
        aria-hidden
        className={`${styles.fade} ${hasMore ? styles.fadeVisible : ''}`}
        style={{ right: scrollbarWidth }}
      />
    </section>
  )
}
