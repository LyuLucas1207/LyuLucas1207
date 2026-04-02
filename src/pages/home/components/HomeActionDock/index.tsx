import styles from './styles.module.css'

type Props = {
  onReload: () => void
  buttonTitle: string
  buttonLabel: string
}

export function HomeActionDock({ onReload, buttonTitle, buttonLabel }: Props) {
  return (
    <div className={styles.actionDock}>
      <button type="button" className={styles.actionButton} onClick={onReload} title={buttonTitle}>
        <strong>{buttonLabel}</strong>
      </button>
    </div>
  )
}

