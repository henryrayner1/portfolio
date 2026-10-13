import { projects } from '../data/content'
import { ImagePlaceholder } from './ImagePlaceholder'
import { Section } from './Section'
import shared from './shared.module.css'
import styles from './Projects.module.css'

export function Projects() {
  return (
    <Section id="projects" title="Personal Projects" centeredTitle>
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
              <h3 className={styles.name}>
                {project.link ? <a href={project.link}>{project.name}</a> : project.name}
              </h3>
              <p className={shared.subtitle}>{project.techStack.join(' · ')}</p>

              <h4 className={shared.subheading}>Description:</h4>
              {project.description.map((paragraph, j) => (
                <p key={j} className={`${shared.subtitle} ${styles.paragraph}`}>
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
