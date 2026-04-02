import styles from './styles.module.css'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'

type Props = {
  onReload: () => void
  buttonTitle: string
  buttonLabel: string
}

export function HomeActionDock({ onReload, buttonTitle, buttonLabel }: Props) {
  const dockRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const labelRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!dockRef.current) return

    gsap.fromTo(
      dockRef.current,
      { opacity: 0, x: 36, filter: 'blur(10px)' },
      { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out' },
    )
  }, [])

  useEffect(() => {
    if (!labelRef.current) return

    const tween = gsap.to(labelRef.current, {
      scale: 1.03,
      duration: 2.3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    return () => {
      tween.kill()
    }
  }, [])

  useEffect(() => {
    if (!buttonRef.current || !labelRef.current) return

    const btn = buttonRef.current
    const label = labelRef.current

    const onEnter = () => gsap.to(label, { scale: 1.08, duration: 0.18, ease: 'power2.out' })
    const onLeave = () => gsap.to(label, { scale: 1.03, duration: 0.18, ease: 'power2.out' })

    btn.addEventListener('pointerenter', onEnter)
    btn.addEventListener('pointerleave', onLeave)

    return () => {
      btn.removeEventListener('pointerenter', onEnter)
      btn.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={dockRef} className={styles.actionDock}>
      <button ref={buttonRef} type="button" className={styles.actionButton} onClick={onReload} title={buttonTitle}>
        <strong ref={labelRef}>{buttonLabel}</strong>
      </button>
    </div>
  )
}

