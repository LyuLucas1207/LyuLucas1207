import type { ReactNode } from 'react'
import { useRef } from 'react'

import { useHeroSceneMotion } from '../hooks/useHeroSceneMotion'
import { useSvgDrawMotion } from '../hooks/useSvgDrawMotion'
import { WorldMark } from './WorldMark'
import styles from './OrbitScene.module.css'

type OrbitSceneProps = {
  eyebrow: string
  title: string
  accent?: ReactNode
}

function OrbitScene({ eyebrow, title, accent }: OrbitSceneProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const accentRef = useRef<SVGSVGElement | null>(null)

  useHeroSceneMotion(ref)
  useSvgDrawMotion(accentRef)

  return (
    <div ref={ref} className={styles.scene}>
      <svg viewBox="0 0 400 260" className={styles.grid} aria-hidden="true">
        <path
          d="M12 68H388M12 128H388M12 188H388M78 20V240M178 20V240M278 20V240"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1"
          fill="none"
          data-scene="grid"
        />
      </svg>
      <div className={styles.mark} data-scene="world-mark">
        <WorldMark />
      </div>
      <svg
        ref={accentRef}
        viewBox="0 0 220 160"
        className={styles.accent}
        aria-hidden="true"
      >
        <path
          d="M12 122C44 112 58 84 86 74C116 63 143 82 165 70C184 60 193 39 208 28"
          fill="none"
          stroke="rgba(255,255,255,0.78)"
          strokeWidth="2"
          strokeLinecap="round"
          data-draw
        />
        <circle cx="86" cy="74" r="5" fill="var(--color-primary)" data-pulse />
        <circle cx="165" cy="70" r="4" fill="var(--color-fg-heading)" data-pulse />
      </svg>
      {accent}
      <div className={styles.copy}>
        <span data-scene="copy">{eyebrow}</span>
        <strong data-scene="copy">{title}</strong>
      </div>
    </div>
  )
}

export { OrbitScene }
