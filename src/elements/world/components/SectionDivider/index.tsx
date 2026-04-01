import { useRef } from 'react'

import { useSvgDrawMotion } from '../../hooks/useSvgDrawMotion'
import styles from './styles.module.css'

type SectionDividerProps = {
  mirrored?: boolean
}

function SectionDivider({ mirrored = false }: SectionDividerProps) {
  const ref = useRef<SVGSVGElement | null>(null)

  useSvgDrawMotion(ref)

  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 72"
      className={styles.divider}
      style={mirrored ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      <path
        d="M18 38C116 12 182 13 278 34C367 53 431 56 533 31C644 4 711 6 815 34C922 63 1030 58 1182 24"
        className={styles.path}
        data-draw
      />
      <circle cx="280" cy="34" r="4.5" className={styles.point} data-pulse />
      <circle cx="814" cy="34" r="4.5" className={styles.point} data-pulse />
    </svg>
  )
}

export { SectionDivider }
