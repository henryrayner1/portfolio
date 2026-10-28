import { jobs } from '../data/content'
import { DotLogo } from './DotLogo'
import { ImagePlaceholder } from './ImagePlaceholder'
import { Section } from './Section'
import shared from './shared.module.css'
import styles from './Experience.module.css'

// Cool white highlight to suit the navy and red logos.
const COOL_WHITE = [0.92, 0.96, 1]

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      {jobs.map((job) => (
        <article key={job.company} className={styles.job}>
          <header className={styles.header}>
            {job.logo ? (
              <DotLogo
                src={job.logo}
                label={`${job.company} logo drawn in dots`}
                whiteIsBackground
                dotsAcross={90}
                tint={COOL_WHITE}
                className={styles.logo}
              />
            ) : (
              <ImagePlaceholder src={job.image} alt={job.company} className={styles.logo} />
            )}
            <div>
              <h3 className={styles.company}>{job.company}</h3>
              <p className={shared.subtitle}>{job.title}</p>
              <p className={shared.subtitle}>
                {job.dates} · {job.location}
              </p>
              <ul className={styles.tags} aria-label="Technologies">
                {job.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>
          </header>

          <h4 className={shared.subheading}>Role Description:</h4>
          <ul className={`${shared.bullets} ${styles.bullets}`}>
            {job.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>
      ))}
    </Section>
  )
}
