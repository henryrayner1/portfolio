import { certifications, projects } from '../data/content'
import { ImagePlaceholder } from './ImagePlaceholder'
import { Section } from './Section'
import shared from './shared.module.css'
import styles from './Projects.module.css'

export function Projects() {
  return (
    <Section id="projects" title="Projects & Certifications">
      <div className={styles.layout}>
        <div>
          <h3 className={styles.columnTitle}>Personal Projects</h3>
          <div className={styles.list}>
            {projects.map((project, i) => (
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
                <div className={styles.body}>
                  <h4 className={styles.name}>
                    {project.link ? <a href={project.link}>{project.name}</a> : project.name}
                  </h4>
                  <p className={shared.subtitle}>{project.techStack.join(' · ')}</p>

                  <h5 className={shared.subheading}>Description:</h5>
                  {project.description.map((paragraph, j) => (
                    <p key={j} className={`${shared.subtitle} ${styles.paragraph}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className={styles.sidebar} aria-labelledby="certifications-title">
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
    </Section>
  )
}
