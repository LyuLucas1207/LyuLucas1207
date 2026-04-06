import type { Nilable, Nullable } from 'nfx-ui/types'

import type { HoverInfo } from '@/elements/universe/scene'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'

import styles from './styles.module.css'

type Props = {
  hoverInfo: Nilable<HoverInfo>
}

export function HomeHoverTooltip({ hoverInfo }: Props) {
  const rootRef = useRef<Nullable<HTMLDivElement>>(null)
  const labelRef = useRef<Nullable<HTMLElement>>(null)

  useEffect(() => {
    if (!rootRef.current) return

    const el = rootRef.current
    const visible = Boolean(hoverInfo)

    if (visible) {
      gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: 'power2.out' })
    } else {
      gsap.to(el, { opacity: 0, y: 6, scale: 0.98, duration: 0.14, ease: 'power2.out' })
    }
  }, [hoverInfo])

  useEffect(() => {
    if (!labelRef.current) return
    if (!hoverInfo) return
    if (hoverInfo.label === hoverInfo.systemName) return

    gsap.fromTo(
      labelRef.current,
      { opacity: 0, scale: 0.94, y: 4 },
      { opacity: 1, scale: 1, y: 0, duration: 0.22, ease: 'power2.out' },
    )
  }, [hoverInfo?.label, hoverInfo?.systemName])

  return (
    <div
      ref={rootRef}
      className={`${styles.hoverTooltip} ${hoverInfo ? styles.hoverTooltipVisible : ''}`}
      aria-live="polite"
    >
      <span className={styles.hoverSystem}>{hoverInfo?.systemName}</span>
      {hoverInfo && hoverInfo.label !== hoverInfo.systemName && (
        <strong ref={labelRef} className={styles.hoverLabel}>
          {hoverInfo.label}
        </strong>
      )}
    </div>
  )
}

