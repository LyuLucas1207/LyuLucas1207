import { Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'

import styles from './styles.module.css'

type Props = {
  label: string
  title: string
  description: string
}

export function HomeHud({ label, title, description }: Props) {
  const hudRef = useRef<HTMLDivElement | null>(null)
  const titleRef = useRef<HTMLElement | null>(null)
  const descRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    if (!hudRef.current) return

    gsap.fromTo(
      hudRef.current,
      { opacity: 0, y: 18, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out' },
    )
  }, [])

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' },
      )
    }

    if (descRef.current) {
      gsap.fromTo(
        descRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out', delay: 0.04 },
      )
    }
  }, [title, description])

  return (
    <div ref={hudRef} className={styles.hud} aria-live="polite">
      <span className={styles.hudLabel}>
        <Sparkles size={14} />
        {label}
      </span>
      <strong ref={titleRef} className={styles.hudTitle}>
        {title}
      </strong>
      <p ref={descRef} className={styles.hudDescription}>
        {description}
      </p>
    </div>
  )
}

