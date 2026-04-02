import gsap from 'gsap'
import { useEffect, useRef } from 'react'

import { useReducedMotion } from '@/hooks'

import { MiniUniverseGlyph } from './MiniUniverseGlyph'
import styles from './styles.module.css'

type Props = {
  onReload: () => void
  buttonTitle: string
  buttonLabel: string
}

export function HomeActionDock({ onReload, buttonTitle, buttonLabel }: Props) {
  const dockRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!dockRef.current) return

    gsap.fromTo(
      dockRef.current,
      { opacity: 0, x: 28, filter: 'blur(8px)' },
      { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.65, ease: 'power3.out' },
    )
  }, [])

  return (
    <div ref={dockRef} className={styles.actionDock}>
      <button
        type="button"
        className={styles.actionButton}
        onClick={onReload}
        title={buttonTitle}
      >
        <span className={styles.universeSlot} aria-hidden>
          <MiniUniverseGlyph reducedMotion={reducedMotion} />
        </span>
        <span className={styles.copy}>
          <span className={styles.copyTitle}>{buttonLabel}</span>
          <span className={styles.copyHint}>{buttonTitle}</span>
        </span>
      </button>
    </div>
  )
}
