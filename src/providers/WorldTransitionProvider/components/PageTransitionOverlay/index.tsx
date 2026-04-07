import { useGSAP } from '@gsap/react'
import { useMemo, useRef } from 'react'
import { useTheme } from 'nfx-ui/themes'
import { scheduleBrowserIdleTask } from 'nfx-ui/utils'

import type { Nullable } from 'nfx-ui/types'

import { useReducedMotion } from '@/hooks'
import type { TransitionRequest } from '@/stores/transitionStore'
import gsap from 'gsap'

import { wrapGsapContextSafe } from '../../wrapGsapContextSafe'
import styles from './styles.module.css'
import { PageMoodGraphics } from '../PageMoodGraphics'

type Props = {
  request: Nullable<TransitionRequest>
  onMidpoint: () => void
  onComplete: () => void
}

export function PageTransitionOverlay({ request, onMidpoint, onComplete }: Props) {
  const ref = useRef<Nullable<HTMLDivElement>>(null)
  const reducedMotion = useReducedMotion()
  const { currentTheme } = useTheme()

  const pageRequest = request?.type === 'page' ? request : null

  const shellBackground = useMemo(() => {
    if (!pageRequest) return undefined
    const vars = currentTheme.colors.variables as unknown as Record<string, string | undefined>
    const bg2 = vars.bg2 ?? 'rgba(10, 10, 14, 1)'
    const bg3 = vars.bg3 ?? 'rgba(6, 6, 10, 1)'
    const glow = vars.primaryTransparent ?? 'rgba(255, 255, 255, 0.16)'
    return `radial-gradient(circle at center, ${glow}, transparent 30%),linear-gradient(180deg, ${bg3}, ${bg2})`
  }, [pageRequest?.id, currentTheme])

  useGSAP(
    (_ctx, contextSafe) => {
      const node = ref.current
      if (!node || !pageRequest) return

      const shell = node.querySelector<HTMLElement>('[data-overlay-shell]')
      const veil = node.querySelector<HTMLElement>('[data-overlay-veil]')
      const paths = node.querySelectorAll<SVGGeometryElement>('[data-overlay-draw]')
      const dots = node.querySelectorAll<SVGElement>('[data-overlay-dot]')
      const copy = node.querySelectorAll<HTMLElement>('[data-overlay-copy]')

      if (reducedMotion) {
        onMidpoint()
        onComplete()
        return
      }

      paths.forEach((path) => {
        const length = path.getTotalLength()
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      })

      const runExit = wrapGsapContextSafe(contextSafe)(() => {
        gsap
          .timeline({ onComplete })
          .to(copy, { opacity: 0, y: -16, duration: 0.32, stagger: 0.04, ease: 'power2.in' })
          .to(
            shell,
            { clipPath: 'circle(0% at 50% 50%)', opacity: 0, duration: 0.82, ease: 'power4.inOut' },
            '-=0.08',
          )
          .set(node, { autoAlpha: 0 })
      })

      let idleExit: { cancel: () => void } | null = null

      gsap
        .timeline()
        .set(node, { autoAlpha: 1 })
        .fromTo(
          shell,
          { clipPath: 'circle(0% at 50% 50%)', opacity: 0.92 },
          { clipPath: 'circle(78% at 50% 50%)', opacity: 1, duration: 0.9, ease: 'power4.inOut' },
        )
        .fromTo(
          paths,
          { strokeDashoffset: (_, target) => target.getTotalLength() },
          { strokeDashoffset: 0, duration: 0.95, stagger: 0.08, ease: 'power3.out' },
          '-=0.35',
        )
        .fromTo(
          dots,
          { opacity: 0, scale: 0.45, transformOrigin: 'center center' },
          { opacity: 1, scale: 1, duration: 0.45, stagger: 0.05, ease: 'back.out(2)' },
          '-=0.55',
        )
        .fromTo(
          copy,
          { opacity: 0, y: 22, filter: 'blur(12px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, stagger: 0.06, ease: 'power3.out' },
          '-=0.46',
        )
        .to(
          veil,
          { opacity: 0.24, scale: 1.06, transformOrigin: 'center center', duration: 0.7, ease: 'sine.inOut' },
          '<',
        )
        .add(() => {
          onMidpoint()
          idleExit = scheduleBrowserIdleTask(runExit)
        })

      return () => {
        idleExit?.cancel()
      }
    },
    { scope: ref, dependencies: [pageRequest?.id, reducedMotion, onMidpoint, onComplete] },
  )

  if (!pageRequest) return null

  return (
    <div ref={ref} className={styles.root}>
      <div className={styles.shell} style={shellBackground ? { background: shellBackground } : undefined} data-overlay-shell>
        <div className={styles.veil} data-overlay-veil />
        <div className={styles.copy}>
          <p data-overlay-copy>{pageRequest.title ?? 'Lyu Star Realm'}</p>
          {pageRequest.subtitle ? <span data-overlay-copy>{pageRequest.subtitle}</span> : null}
        </div>
        <div className={styles.graphic}>
          <PageMoodGraphics page={pageRequest.page} className={styles.svg} />
        </div>
      </div>
    </div>
  )
}

