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
          <div>
            <h3 className={styles.company}>{job.company}</h3>
            <p className={shared.subtitle}>{job.title}</p>
            <p className={shared.subtitle}>
              {job.dates} · {job.location}
            </p>

            <h4 className={styles.subheading}>Role Description:</h4>
            <ul className={shared.bullets}>
              {job.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <p className={styles.technologies}>
              <span className={styles.label}>Technologies:</span> {job.technologies.join(', ')}
            </p>
          </div>
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
        </article>
      ))}
    </Section>
  )
}
