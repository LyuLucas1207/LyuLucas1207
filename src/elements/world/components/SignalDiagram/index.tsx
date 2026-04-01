import { useRef } from 'react'

import { useSvgDrawMotion } from '../../hooks/useSvgDrawMotion'
import styles from './styles.module.css'

type SignalDiagramProps = {
  variant?: 'project' | 'contact'
}

function SignalDiagram({ variant = 'project' }: SignalDiagramProps) {
  const ref = useRef<SVGSVGElement | null>(null)

  useSvgDrawMotion(ref, { dependencies: [variant] })

  const contact = variant === 'contact'

  return (
    <svg ref={ref} viewBox="0 0 420 240" className={styles.diagram} aria-hidden="true">
      <rect x="12" y="12" width="396" height="216" rx="24" className={styles.frame} />
      <rect x="28" y="30" width="168" height="56" rx="18" className={styles.wash} />
      <path
        d={
          contact
            ? 'M48 174C104 152 138 116 176 96C216 76 258 90 294 74C322 62 346 48 372 44'
            : 'M48 176C92 154 126 120 172 106C218 91 258 112 300 90C330 75 348 58 372 46'
        }
        className={styles.path}
        data-draw
      />
      <path
        d={contact ? 'M62 126H168M62 144H144' : 'M58 116H198M58 136H178'}
        className={styles.frame}
        data-draw
      />
      <circle cx={contact ? 176 : 172} cy={contact ? 96 : 106} r="7" className={styles.primary} data-pulse />
      <circle cx={contact ? 294 : 300} cy={contact ? 74 : 90} r="5" className={styles.point} data-pulse />
      <circle cx="372" cy={contact ? 44 : 46} r="5" className={styles.primary} data-pulse />
    </svg>
  )
}

export { SignalDiagram }
