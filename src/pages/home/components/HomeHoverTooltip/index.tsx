import type { Nilable } from 'nfx-ui/types'

import type { HoverInfo } from '@/elements/universe/scene'

import styles from './styles.module.css'

type Props = {
  hoverInfo: Nilable<HoverInfo>
}

export function HomeHoverTooltip({ hoverInfo }: Props) {
  return (
    <div
      className={`${styles.hoverTooltip} ${hoverInfo ? styles.hoverTooltipVisible : ''}`}
      aria-live="polite"
    >
      <span className={styles.hoverSystem}>{hoverInfo?.systemName}</span>
      {hoverInfo && hoverInfo.label !== hoverInfo.systemName && (
        <strong className={styles.hoverLabel}>{hoverInfo.label}</strong>
      )}
    </div>
  )
}

