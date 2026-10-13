import { useState } from 'react'
import { profile } from '../data/content'
import { Section } from './Section'
import styles from './Resume.module.css'

export function Resume() {
  const [current, setCurrent] = useState(profile.resumes[0])

  return (
    <Section id="resume" title="Resume">
      <div className={styles.controls}>
        <div className={styles.versions} role="group" aria-label="Resume version">
          {profile.resumes.map((version) => (
            <button
              key={version.file}
              type="button"
              aria-pressed={version === current}
              className={styles.version}
              onClick={() => setCurrent(version)}
            >
              {version.label}
            </button>
          ))}
        </div>
        <a href={current.file} download className={styles.download}>
          Download {current.label} PDF
        </a>
      </div>
      <object
        key={current.file}
        data={current.file}
        type="application/pdf"
        className={styles.viewer}
      >
        <p className={styles.fallback}>
          Your browser can’t display the PDF here.{' '}
          <a href={current.file}>Open the {current.label.toLowerCase()} resume</a> instead.
        </p>
      </object>
    </Section>
  )
}
