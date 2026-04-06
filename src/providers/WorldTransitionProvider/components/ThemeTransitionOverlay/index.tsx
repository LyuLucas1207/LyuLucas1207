import { useGSAP } from '@gsap/react'
import { useMemo, useRef } from 'react'

import type { Nullable } from 'nfx-ui/types'

import { useReducedMotion } from '@/hooks'
import type { TransitionRequest } from '@/stores/transitionStore'
import gsap from 'gsap'

import { scheduleBrowserIdleTask } from '../../scheduleBrowserIdle'
import { wrapGsapContextSafe } from '../../wrapGsapContextSafe'
import styles from './styles.module.css'
import { getThemeMoodShellBackground, ThemeMoodGraphics } from '../ThemeMoodGraphics'

type Props = {
  request: Nullable<TransitionRequest>
  onMidpoint: () => void
  onComplete: () => void
}

export function ThemeTransitionOverlay({ request, onMidpoint, onComplete }: Props) {
  const ref = useRef<Nullable<HTMLDivElement>>(null)
  const reducedMotion = useReducedMotion()

  const themeRequest = request?.type === 'theme' ? request : null

  const shellBackground = useMemo(() => {
    if (!themeRequest) return undefined
    return getThemeMoodShellBackground(themeRequest.theme)
  }, [themeRequest?.id, themeRequest?.theme])

  useGSAP(
    (_ctx, contextSafe) => {
      const node = ref.current
      if (!node || !themeRequest) return

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
          .to(
            copy,
            { opacity: 0, y: -16, duration: 0.32, stagger: 0.04, ease: 'power2.in' },
            '+=0.05',
          )
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
          { strokeDashoffset: 0, duration: 0.95, stagger: 0.08, ease: 'expo.out' },
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
          { opacity: 0.22, scale: 1.06, transformOrigin: 'center center', duration: 0.7, ease: 'sine.inOut' },
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
    { scope: ref, dependencies: [themeRequest?.id, reducedMotion, onMidpoint, onComplete] },
  )

  if (!themeRequest) return null

  return (
    <div ref={ref} className={styles.root}>
      <div className={styles.shell} style={shellBackground ? { background: shellBackground } : undefined} data-overlay-shell>
        <div className={styles.veil} data-overlay-veil />
        <div className={styles.copy}>
          <p data-overlay-copy>{themeRequest.title ?? 'Lyu Star Realm'}</p>
          {themeRequest.subtitle ? <span data-overlay-copy>{themeRequest.subtitle}</span> : null}
        </div>
        <div className={styles.graphic}>
          <ThemeMoodGraphics theme={themeRequest.theme} className={styles.svg} />
        </div>
      </div>
    </div>
  )
}

