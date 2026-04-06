import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import type { Nullable } from 'nfx-ui/types'

import { useReducedMotion } from '@/hooks'
import gsap from 'gsap'
import styles from './styles.module.css'

type WorldMarkProps = {
  className?: string
}

function WorldMark({ className }: WorldMarkProps) {
  const reducedMotion = useReducedMotion()
  const markRef = useRef<Nullable<SVGSVGElement>>(null)

  useGSAP(
    (context) => {
      if (reducedMotion) return

      const rings = context.selector?.('[data-orbit-ring]')
      const dots = context.selector?.('[data-orbit-dot]')
      const core = context.selector?.('[data-mark-core]')
      const halo = context.selector?.('[data-mark-halo]')
      const shell = context.selector?.('[data-mark-shell]')
      const lines = context.selector?.('[data-mark-line]')

      if (rings?.length) {
        rings.forEach((ring: Element, index: number) => {
          gsap.to(ring, {
            rotate: index % 2 === 0 ? 360 : -360,
            duration: 9 + index * 2.5,
            ease: 'none',
            repeat: -1,
            transformOrigin: '50% 50%',
          })
        })
      }

      if (dots?.length) {
        dots.forEach((dot: Element, index: number) => {
          gsap.to(dot, {
            rotate: index % 2 === 0 ? 360 : -360,
            duration: 5.8 + index * 1.1,
            ease: 'none',
            repeat: -1,
            transformOrigin: '80px 80px',
          })

          gsap.to(dot, {
            scale: 1.12 + index * 0.05,
            opacity: 0.66,
            duration: 1.4 + index * 0.35,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          })
        })
      }

      if (core?.length) {
        gsap.to(core, {
          scale: 1.12,
          transformOrigin: '50% 50%',
          duration: 1.9,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

      if (halo?.length) {
        gsap.to(halo, {
          scale: 1.12,
          opacity: 0.96,
          transformOrigin: '50% 50%',
          duration: 2.2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

      if (shell?.length) {
        gsap.to(shell, {
          y: -1.6,
          duration: 2.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

      if (lines?.length) {
        lines.forEach((line: Element, index: number) => {
          gsap.fromTo(
            line,
            { strokeDasharray: '10 14', strokeDashoffset: 0 },
            {
              strokeDashoffset: index % 2 === 0 ? -48 : 48,
              duration: 2.8 + index * 0.45,
              ease: 'none',
              repeat: -1,
            },
          )
        })
      }
    },
    { scope: markRef, dependencies: [reducedMotion] },
  )

  return (
    <svg
      ref={markRef}
      viewBox="0 0 160 160"
      className={`${styles.mark} ${className ?? ''}`.trim()}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="worldMarkGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <g data-mark-shell>
        <circle cx="80" cy="80" r="52" className={styles.halo} data-mark-halo />
        <g data-orbit-ring>
          <circle cx="80" cy="80" r="46" className={styles.ring} />
        </g>
        <g data-orbit-ring>
          <ellipse cx="80" cy="80" rx="58" ry="34" className={`${styles.ring} ${styles.ringStrong}`} />
        </g>
        <g data-orbit-ring>
          <ellipse cx="80" cy="80" rx="30" ry="62" className={styles.ring} transform="rotate(30 80 80)" />
        </g>
        <path
          d="M54 93C66 75 75 63 82 57C89 50 100 47 114 47"
          className={styles.line}
          data-mark-line
        />
        <g data-mark-core>
          <circle cx="80" cy="80" r="12" className={styles.core} data-scene="world-mark" />
          <circle cx="80" cy="80" r="4.5" className={styles.coreSecondary} data-scene="world-mark" />
        </g>
        <circle cx="122" cy="47" r="4" className={styles.nodeGlow} data-orbit-dot data-pulse />
        <circle cx="49" cy="78" r="3.5" className={styles.node} data-orbit-dot data-pulse />
        <circle cx="95" cy="119" r="3" className={styles.nodeGlow} data-orbit-dot data-pulse />
      </g>
    </svg>
  )
}

export { WorldMark }
