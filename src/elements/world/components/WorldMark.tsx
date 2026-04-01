import styles from './WorldMark.module.css'

type WorldMarkProps = {
  className?: string
}

function WorldMark({ className }: WorldMarkProps) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={`${styles.mark} ${className ?? ''}`.trim()}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="worldMarkGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <circle cx="80" cy="80" r="52" className={styles.halo} />
      <g data-orbit-ring>
        <circle cx="80" cy="80" r="46" className={styles.ring} data-draw />
      </g>
      <g data-orbit-ring>
        <ellipse cx="80" cy="80" rx="58" ry="34" className={`${styles.ring} ${styles.ringStrong}`} data-draw />
      </g>
      <g data-orbit-ring>
        <ellipse cx="80" cy="80" rx="30" ry="62" className={styles.ring} data-draw transform="rotate(30 80 80)" />
      </g>
      <path
        d="M54 93C66 75 75 63 82 57C89 50 100 47 114 47"
        className={styles.line}
        data-draw
      />
      <circle cx="80" cy="80" r="12" className={styles.core} data-scene="world-mark" />
      <circle cx="80" cy="80" r="4.5" className={styles.coreSecondary} data-scene="world-mark" />
      <circle cx="122" cy="47" r="4" className={styles.nodeGlow} data-orbit-dot data-pulse />
      <circle cx="49" cy="78" r="3.5" className={styles.node} data-orbit-dot data-pulse />
      <circle cx="95" cy="119" r="3" className={styles.nodeGlow} data-orbit-dot data-pulse />
    </svg>
  )
}

export { WorldMark }
