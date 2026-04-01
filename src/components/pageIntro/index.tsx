import type { ReactNode } from 'react'

import styles from './styles.module.css'

type PageIntroProps = {
  eyebrow: string
  title: string
  description: string
  aside?: ReactNode
}

function PageIntro({ eyebrow, title, description, aside }: PageIntroProps) {
  return (
    <section className={styles.intro} data-page-chunk>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>
      {aside ? <div className={styles.aside}>{aside}</div> : null}
    </section>
  )
}

export { PageIntro }
