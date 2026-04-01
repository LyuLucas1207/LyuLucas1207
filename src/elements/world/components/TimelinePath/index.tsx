import { useRef } from 'react'

import { useSvgDrawMotion } from '../../hooks/useSvgDrawMotion'
import styles from './styles.module.css'

function TimelinePath() {
  const ref = useRef<SVGSVGElement | null>(null)

  useSvgDrawMotion(ref)

  return (
    <svg ref={ref} viewBox="0 0 1200 120" className={styles.path} aria-hidden="true">
      <path
        d="M40 76C132 24 224 24 318 76C408 128 510 126 602 74C702 18 804 18 900 72C988 120 1080 116 1160 54"
        className={styles.line}
        data-draw
      />
      <circle cx="318" cy="76" r="6" className={styles.node} data-pulse />
      <circle cx="602" cy="74" r="6" className={styles.node} data-pulse />
      <circle cx="900" cy="72" r="6" className={styles.node} data-pulse />
    </svg>
  )
}

export { TimelinePath }
