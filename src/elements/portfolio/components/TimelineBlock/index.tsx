import type { TimelineItem } from '@/types/site'

import styles from './styles.module.css'

type TimelineBlockProps = {
  items: TimelineItem[]
}

function TimelineBlock({ items }: TimelineBlockProps) {
  return (
    <div className={styles.timeline}>
      {items.map((item) => (
        <article key={`${item.period}-${item.title}`} className={styles.item}>
          <div className={styles.rail} aria-hidden="true" />
          <div className={styles.meta}>
            <p className={styles.period}>{item.period}</p>
            <p className={styles.company}>{item.company}</p>
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.summary}>{item.summary}</p>
            <ul className={styles.achievements}>
              {item.achievements.map((achievement) => (
                <li key={achievement}>{achievement}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  )
}

export { TimelineBlock }
