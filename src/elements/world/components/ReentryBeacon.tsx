import { RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import styles from './ReentryBeacon.module.css'

type ReentryBeaconProps = {
  onActivate: () => void
}

function ReentryBeacon({ onActivate }: ReentryBeaconProps) {
  const { t } = useTranslation('common')

  return (
    <button
      type="button"
      className={styles.beacon}
      onClick={onActivate}
      aria-label={t('actions.reenterWorld')}
    >
      <span className={styles.orbit} />
      <span className={styles.core}>
        <RotateCcw size={15} />
      </span>
      <span className={styles.label}>{t('actions.reenterWorld')}</span>
    </button>
  )
}

export { ReentryBeacon }
