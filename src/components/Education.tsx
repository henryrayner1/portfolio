import { education } from '../data/content'
import brownLogo from '../assets/brown-logo.png'
import { DotLogo } from './DotLogo'
import { Section } from './Section'
import shared from './shared.module.css'
import styles from './Education.module.css'

// Warm highlight that suits the crest's red and gold better than aqua.
const WARM_WHITE = [1, 0.95, 0.82]

export function Education() {
  const { name, degree, year, courses } = education

  return (
    <Section id="education" title="Education">
      <div className={styles.intro}>
        <DotLogo
          src={brownLogo}
          label={`${name} crest drawn in dots`}
          dotsAcross={64}
          tint={WARM_WHITE}
          className={styles.crest}
        />
        <div>
          <h3 className={styles.school}>{name}</h3>
          <p className={shared.subtitle}>{degree}</p>
          <p className={shared.subtitle}>Class of {year}</p>
        </div>
      </div>

      <h4 className={shared.subheading}>Relevant Coursework:</h4>
      <ul className={styles.courses}>
        {courses.map((course) => (
          <li key={course.code} className={styles.course}>
            <span className={styles.courseCode}>{course.code}</span>
            <h5 className={styles.courseName}>{course.name}</h5>
            <p className={styles.courseDescription}>{course.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
