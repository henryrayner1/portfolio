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
      <div className={shared.row}>
        <div>
          <h3 className={styles.school}>{name}</h3>
          <p className={shared.subtitle}>
            {degree}, <span className={styles.year}>{year}</span>
          </p>

          <h4 className={shared.subheading}>Relevant Coursework:</h4>
          {courses.map((course) => (
            <div key={course.code} className={styles.course}>
              <p className={styles.courseName}>
                <span className={styles.courseCode}>{course.code}</span> {course.name}
              </p>
              <ul className={shared.bullets}>
                <li>{course.description}</li>
              </ul>
            </div>
          ))}
        </div>
        <DotLogo
          src={brownLogo}
          label={`${name} crest drawn in dots`}
          dotsAcross={64}
          tint={WARM_WHITE}
          className={styles.photo}
        />
      </div>
    </Section>
  )
}
