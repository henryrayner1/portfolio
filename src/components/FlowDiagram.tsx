import type { Diagram } from '../data/content'
import styles from './FlowDiagram.module.css'

/** A row of stages joined by labelled arrows; it turns into a column on phones. */
export function FlowDiagram({ diagram }: { diagram: Diagram }) {
  const { title, caption, stages } = diagram
  return (
    <figure className={styles.figure}>
      <figcaption className={styles.heading}>
        <span className={styles.title}>{title}</span>
        {caption && <span className={styles.caption}>{caption}</span>}
      </figcaption>
      <ol className={styles.flow}>
        {stages.map((stage, i) => (
          <li key={i} className={styles.stage}>
            <div className={styles.nodes}>
              {stage.nodes.map((node) => (
                <div key={node.title} className={styles.node}>
                  {node.tag && <span className={styles.tag}>{node.tag}</span>}
                  <span className={styles.nodeTitle}>{node.title}</span>
                  {node.detail && <span className={styles.detail}>{node.detail}</span>}
                </div>
              ))}
            </div>
            {i < stages.length - 1 && (
              <div className={styles.link}>
                {stage.link && <span className={styles.linkLabel}>{stage.link}</span>}
                <span aria-hidden className={styles.arrow} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </figure>
  )
}
