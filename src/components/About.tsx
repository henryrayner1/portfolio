import { profile } from '../data/content'
import moanaLogo from '../assets/moana-logo.png'
import { DotLogo } from './DotLogo'
import { Section } from './Section'
import shared from './shared.module.css'
import styles from './About.module.css'

export function About() {
  return (
    <Section id="about" className={styles.about}>
      <div className={`${shared.row} ${styles.row}`}>
        <div>
          <h1 className={styles.name}>{profile.name}</h1>
          {profile.taglines.map((line) => (
            <p key={line} className={shared.subtitle}>
              {line}
            </p>
          ))}
          {profile.blurb.length > 0 && (
            <div className={styles.blurb}>
              {profile.blurb.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          )}
        </div>
        <DotLogo
          src={moanaLogo}
          label="Moana logo drawn in dots"
          whiteIsBackground
          className={styles.photo}
        />
      </div>
    </Section>
  )
}
