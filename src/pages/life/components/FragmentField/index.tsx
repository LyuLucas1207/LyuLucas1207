import { useRef } from 'react'

import { useSvgDrawMotion } from '@/elements/world/hooks/useSvgDrawMotion'
import styles from './styles.module.css'

function FragmentField() {
  const ref = useRef<SVGSVGElement | null>(null)

  useSvgDrawMotion(ref)

  return (
    <svg ref={ref} viewBox="0 0 1200 180" className={styles.field} aria-hidden="true">
      <path
        d="M40 110C126 40 198 28 276 54C366 84 430 136 532 130C612 126 674 88 738 86C810 84 896 116 972 122C1042 128 1098 106 1160 62"
        className={styles.line}
        data-draw
      />
      <path
        d="M90 142C170 120 236 122 318 138C396 154 454 160 522 144"
        className={styles.line}
        data-draw
      />
      <path d="M304 70C312 56 322 48 340 44C330 62 318 76 304 70Z" className={styles.leaf} />
      <path d="M816 116C830 96 844 88 864 84C850 112 838 122 816 116Z" className={styles.leaf} />
      <circle cx="532" cy="130" r="5" className={styles.dot} data-pulse />
      <circle cx="972" cy="122" r="4" className={styles.dot} data-pulse />
    </svg>
  )
}

export { FragmentField }
