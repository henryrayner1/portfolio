import { useEffect, useRef, useState } from 'react'
import { certifications, projects, type Project, type ProjectDetails } from '../data/content'
import { ImagePlaceholder } from './ImagePlaceholder'
import { ProjectDialog } from './ProjectDialog'
import { Section } from './Section'
import shared from './shared.module.css'
import styles from './Projects.module.css'

// Room left between the stuck sidebar's last card and the section's bottom edge:
// the section's own bottom padding, so the card clears its bottom fade.
const STICK_GAP = 96

/** The nearest ancestor that scrolls vertically. */
function scrollParent(el: HTMLElement) {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const { overflowY } = getComputedStyle(p)
    if (overflowY === 'auto' || overflowY === 'scroll') return p
  }
  return null
}

export function Projects() {
  const [open, setOpen] = useState<(Project & { details: ProjectDetails }) | null>(null)
  const sidebarRef = useRef<HTMLElement>(null)

  // The certifications scroll with the projects until their last card reaches the
  // bottom of the section, then stay put: a sticky top that is negative by however
  // much taller the sidebar is than the section. A short sidebar just sticks at the top.
  useEffect(() => {
    const sidebar = sidebarRef.current
    const scroller = sidebar && scrollParent(sidebar)
    if (!sidebar || !scroller) return

    const update = () => {
      const top = Math.min(0, scroller.clientHeight - sidebar.offsetHeight - STICK_GAP)
      sidebar.style.setProperty('--stick-top', `${top}px`)
    }
    update()
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(sidebar)
    resizeObserver.observe(scroller)
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <Section id="projects" title="Projects & Certifications">
      <div className={styles.layout}>
        <div>
          <h3 className={styles.columnTitle}>Personal Projects</h3>
          <div className={styles.list}>
            {projects.map(({ details, ...project }, i) => (
              <article
                key={project.name}
                className={`${styles.project} ${i % 2 === 1 ? styles.reversed : ''}`}
              >
                <ImagePlaceholder
                  src={project.image}
                  alt={project.name}
                  rounded
                  className={styles.image}
                />
                <div className={styles.head}>
                  <h4 className={styles.name}>
                    {project.link ? <a href={project.link}>{project.name}</a> : project.name}
                  </h4>
                  <p className={shared.subtitle}>{project.techStack.join(' · ')}</p>
                </div>
                <div className={styles.body}>
                  <h5 className={`${shared.subheading} ${styles.descriptionHeading}`}>Description:</h5>
                  {project.description.map((paragraph, j) => (
                    <p key={j} className={`${shared.subtitle} ${styles.paragraph}`}>
                      {paragraph}
                    </p>
                  ))}

                  {details && (
                    <button
                      type="button"
                      className={styles.learnMore}
                      aria-haspopup="dialog"
                      onClick={() => setOpen({ ...project, details })}
                    >
                      Learn more <span aria-hidden>→</span>
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside ref={sidebarRef} className={styles.sidebar} aria-labelledby="certifications-title">
          <h3 id="certifications-title" className={styles.columnTitle}>
            Certifications
          </h3>
          <ul className={styles.certs}>
            {certifications.map((cert) => (
              <li key={cert.name} className={styles.cert}>
                {cert.badge ? (
                  <img src={cert.badge} alt="" className={styles.badge} />
                ) : (
                  <span aria-hidden className={styles.badge}>
                    {cert.short}
                  </span>
                )}
                <p className={styles.issuer}>{cert.issuer}</p>
                <h4 className={styles.certName}>
                  {cert.link ? <a href={cert.link}>{cert.name}</a> : cert.name}
                </h4>
                {cert.earned && <p className={styles.earned}>Earned {cert.earned}</p>}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {open && <ProjectDialog project={open} onClose={() => setOpen(null)} />}
    </Section>
  )
}
