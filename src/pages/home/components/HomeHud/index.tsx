import { Sparkles } from 'lucide-react'

import styles from './styles.module.css'

type Props = {
  label: string
  title: string
  description: string
}

export function HomeHud({ label, title, description }: Props) {
  return (
    <div className={styles.hud} aria-live="polite">
      <span className={styles.hudLabel}>
        <Sparkles size={14} />
        {label}
      </span>
      <strong className={styles.hudTitle}>{title}</strong>
      <p className={styles.hudDescription}>{description}</p>
    </div>
  )
}

