import { useEffect, useId, useRef, useState } from 'react'
import type { Project, ProjectDetails } from '../data/content'
import { FlowDiagram } from './FlowDiagram'
import styles from './ProjectDialog.module.css'

interface Props {
  project: Project & { details: ProjectDetails }
  onClose: () => void
}

/** The "Learn more" view of a project: screenshots, diagrams, hosting and highlights. */
export function ProjectDialog({ project, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const { details } = project

  // Mounted only while open, so open as a modal straight away. Esc, the close
  // button and backdrop clicks all end in the dialog's own close event. No
  // cleanup: unmounting removes the dialog, and closing it here would fire
  // onClose again (and, under StrictMode's remount, shut it immediately).
  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        // The content fills the dialog, so a click on the dialog itself is on the backdrop.
        if (e.target === e.currentTarget) e.currentTarget.close()
      }}
    >
      <div className={styles.content}>
        <header className={styles.header}>
          <div>
            <h2 id={titleId} className={styles.name}>
              {project.name}
            </h2>
            <p className={styles.stack}>{project.techStack.join(' · ')}</p>
            {details.links && (
              <p className={styles.links}>
                {details.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className={styles.link}>
                    {link.label} <span aria-hidden>↗</span>
                  </a>
                ))}
              </p>
            )}
          </div>
          <button
            type="button"
            className={styles.close}
            aria-label="Close"
            onClick={() => dialogRef.current?.close()}
          >
            <span aria-hidden>×</span>
          </button>
        </header>

        <Gallery screenshots={details.screenshots} />

        <section className={styles.block}>
          <h3 className={styles.heading}>Overview</h3>
          {details.overview.map((paragraph, i) => (
            <p key={i} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </section>

        <section className={styles.block}>
          <h3 className={styles.heading}>How it’s built</h3>
          <div className={styles.diagrams}>
            {details.diagrams.map((diagram) => (
              <FlowDiagram key={diagram.title} diagram={diagram} />
            ))}
          </div>
        </section>

        <section className={styles.block}>
          <h3 className={styles.heading}>Where it runs</h3>
          <dl className={styles.hosting}>
            {details.hosting.map(({ label, value }) => (
              <div key={label} className={styles.hostingRow}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.block}>
          <h3 className={styles.heading}>Highlights</h3>
          <ul className={styles.highlights}>
            {details.highlights.map(({ title, body }) => (
              <li key={title} className={styles.highlight}>
                <h4 className={styles.highlightTitle}>{title}</h4>
                <p>{body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </dialog>
  )
}

/** One large screenshot with its caption, and thumbnails to switch between them. */
function Gallery({ screenshots }: { screenshots: ProjectDetails['screenshots'] }) {
  const [index, setIndex] = useState(0)
  const current = screenshots[index]
  if (!current) return null

  return (
    <div className={styles.gallery}>
      <figure className={styles.shot}>
        <a href={current.src} target="_blank" rel="noreferrer" className={styles.shotLink}>
          <img src={current.src} alt={current.alt} className={styles.shotImage} />
        </a>
        <figcaption className={styles.shotCaption}>{current.caption}</figcaption>
      </figure>
      {screenshots.length > 1 && (
        <div className={styles.thumbs}>
          {screenshots.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              className={styles.thumb}
              aria-label={`Screenshot ${i + 1} of ${screenshots.length}: ${shot.alt}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              <img src={shot.src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
