import { useGSAP } from '@gsap/react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { ensureGsap } from '../../../utils/motion/gsap'
import { WorldMark } from './WorldMark'
import styles from './HomeOpeningGate.module.css'

function HomeOpeningGate() {
  const { t } = useTranslation(['common', 'home'])
  const reducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    const hasEntered = window.sessionStorage.getItem('lyu-world-entered')

    if (hasEntered) {
      return false
    }

    window.sessionStorage.setItem('lyu-world-entered', 'true')
    return true
  })
  const ref = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const node = ref.current
      if (!node || !visible) {
        return
      }

      const { gsap } = ensureGsap()
      const paths = node.querySelectorAll<SVGGeometryElement>('[data-gate-draw]')
      const dots = node.querySelectorAll<SVGCircleElement>('[data-gate-dot]')
      const title = node.querySelector('[data-gate-title]')
      const subtitle = node.querySelector('[data-gate-subtitle]')
      const mark = node.querySelector('[data-gate-mark]')
      const veil = node.querySelector('[data-gate-veil]')

      if (reducedMotion) {
        gsap.to(node, {
          opacity: 0,
          duration: 0.35,
          delay: 0.45,
          onComplete: () => setVisible(false),
        })
        return
      }

      paths.forEach((path) => {
        const length = path.getTotalLength()
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      })

      const timeline = gsap.timeline({
        onComplete: () => setVisible(false),
      })

      timeline
        .fromTo(mark, { opacity: 0, scale: 0.72 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power4.out' })
        .to(
          paths,
          {
            strokeDashoffset: 0,
            duration: 1,
            stagger: 0.08,
            ease: 'power3.out',
          },
          '-=0.35',
        )
        .fromTo(
          dots,
          { opacity: 0, scale: 0.35, transformOrigin: 'center center' },
          { opacity: 1, scale: 1, duration: 0.45, stagger: 0.06, ease: 'back.out(2)' },
          '-=0.55',
        )
        .fromTo(
          [title, subtitle],
          { opacity: 0, y: 22, filter: 'blur(12px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.75, stagger: 0.08, ease: 'power3.out' },
          '-=0.5',
        )
        .to(
          veil,
          {
            scale: 1.08,
            opacity: 0.15,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          '<',
        )
        .to(node, {
          opacity: 0,
          duration: 0.7,
          delay: 0.15,
          ease: 'power2.inOut',
        })
    },
    { scope: ref, dependencies: [visible, reducedMotion] },
  )

  if (!visible) {
    return null
  }

  return (
    <div ref={ref} className={`${styles.overlay} ${!visible ? styles.hidden : ''}`}>
      <div className={styles.veil} data-gate-veil />
      <div className={styles.inner}>
        <div className={styles.mark} data-gate-mark>
          <WorldMark />
        </div>
        <svg viewBox="0 0 420 140" className={styles.diagram} aria-hidden="true">
          <path
            d="M32 88C82 34 126 22 174 42C220 60 247 108 296 102C334 98 356 66 388 36"
            className={styles.diagramPath}
            data-gate-draw
          />
          <path
            d="M54 112C98 84 130 82 176 96C219 108 266 126 312 120"
            className={styles.diagramPath}
            data-gate-draw
          />
          <circle cx="174" cy="42" r="5.5" className={styles.diagramDot} data-gate-dot />
          <circle cx="296" cy="102" r="4.5" className={styles.diagramDot} data-gate-dot />
          <circle cx="388" cy="36" r="4.5" className={styles.diagramDot} data-gate-dot />
        </svg>
        <h1 className={styles.title} data-gate-title>
          Lyu World
        </h1>
        <p className={styles.subtitle} data-gate-subtitle>
          {t('home:copy.manifestoBody')}
        </p>
      </div>
    </div>
  )
}

export { HomeOpeningGate }
