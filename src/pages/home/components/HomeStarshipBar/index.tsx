import { useEffect, useRef } from 'react'
import { Rocket } from 'lucide-react'
import gsap from 'gsap'

import styles from './styles.module.css'

type Props = {
  activeLaneIndex: number | null
  onSelectLane: (laneIndex: number) => void
  title: string
  shipLabels: readonly string[]
}

export function HomeStarshipBar({ activeLaneIndex, onSelectLane, title, shipLabels }: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (activeLaneIndex != null) return
    const root = panelRef.current
    if (!root) return
    const ae = document.activeElement
    if (ae instanceof HTMLElement && root.contains(ae)) {
      ae.blur()
    }
  }, [activeLaneIndex])

  useEffect(() => {
    if (!panelRef.current) return

    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: -16, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out', delay: 0.08 },
    )
  }, [])

  useEffect(() => {
    if (activeLaneIndex == null || !panelRef.current) return
    const btn = panelRef.current.querySelector<HTMLElement>(`[data-lane-index="${activeLaneIndex}"]`)
    btn?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [activeLaneIndex])

  return (
    <div className={styles.wrap}>
      <div ref={panelRef} className={styles.panel} role="toolbar" aria-label={title}>
        <div className={styles.panelHeader}>
          <span className={styles.panelIcon} aria-hidden>
            <Rocket size={14} strokeWidth={2.25} />
          </span>
          <span className={styles.panelTitle}>{title}</span>
        </div>

        <div className={styles.segments}>
          {shipLabels.map((label, index) => {
            const active = activeLaneIndex === index
            return (
              <button
                key={`starship-lane-${index}`}
                type="button"
                data-lane-index={index}
                className={active ? `${styles.segment} ${styles.segmentActive}` : styles.segment}
                aria-pressed={active}
                onClick={() => onSelectLane(index)}
              >
                <span className={styles.segmentDot} aria-hidden />
                <span className={styles.segmentName}>{label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
