import { useRef } from 'react'

import { useSvgDrawMotion } from '../hooks/useSvgDrawMotion'
import styles from './LanguageHalo.module.css'

function LanguageHalo() {
  const ref = useRef<SVGSVGElement | null>(null)

  useSvgDrawMotion(ref)

  return (
    <svg ref={ref} viewBox="0 0 120 120" className={styles.halo} aria-hidden="true">
      <circle cx="60" cy="60" r="40" className={styles.ring} data-draw />
      <ellipse cx="60" cy="60" rx="48" ry="24" className={styles.ring} data-draw />
      <circle cx="60" cy="60" r="18" className={styles.core} />
      <circle cx="92" cy="42" r="4.5" className={styles.point} data-pulse />
      <circle cx="31" cy="64" r="3.8" className={styles.point} data-pulse />
    </svg>
  )
}

export { LanguageHalo }
