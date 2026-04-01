import { useRef } from 'react'

import { useSvgDrawMotion } from '../hooks/useSvgDrawMotion'
import styles from './EditorialRails.module.css'

function EditorialRails() {
  const ref = useRef<SVGSVGElement | null>(null)

  useSvgDrawMotion(ref)

  return (
    <svg ref={ref} viewBox="0 0 1200 140" className={styles.rails} aria-hidden="true">
      <path d="M88 26V118" className={styles.line} data-draw />
      <path d="M1110 20V114" className={styles.line} data-draw />
      <path d="M88 46H312" className={styles.line} data-draw />
      <path d="M888 92H1110" className={styles.line} data-draw />
      <rect x="326" y="22" width="136" height="34" rx="17" className={styles.note} />
      <rect x="744" y="86" width="152" height="32" rx="16" className={styles.note} />
    </svg>
  )
}

export { EditorialRails }
