import type { MetricItem } from '@/types'

import styles from './styles.module.css'

type MetricStripProps = {
  items: MetricItem[]
}

function MetricStrip({ items }: MetricStripProps) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <article key={item.label} className={styles.card}>
          <p className={styles.value}>{item.value}</p>
          <h3 className={styles.label}>{item.label}</h3>
          <p className={styles.detail}>{item.detail}</p>
        </article>
      ))}
    </div>
  )
}

export { MetricStrip }
