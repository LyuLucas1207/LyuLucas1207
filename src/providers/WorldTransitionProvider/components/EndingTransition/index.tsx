import { useGSAP } from '@gsap/react'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useTheme } from 'nfx-ui/themes'
import type { Nullable } from 'nfx-ui/types'

import { useReducedMotion } from '@/hooks'
import { ROUTES } from '@/navigations/routes'
import { TransitionStore, useTransitionStore } from '@/stores/transitionStore'
import gsap from 'gsap'

import { PageMoodGraphics } from '../PageMoodGraphics'
import styles from '../PageTransitionOverlay/styles.module.css'

/**
 * 与 `playWorldTransition({ type: 'page', page: WORLD, …, action: reload })` 同源入场动画（见 `PageTransitionOverlay`），
 * 播完后不播收口，直接 `reload`。
 */
export function EndingTransition() {
  const location = useLocation()
  const endingRefly = useTransitionStore((s) => s.endingRefly)
  const { t } = useTranslation(['components'])
  const reducedMotion = useReducedMotion()
  const { currentTheme } = useTheme()
  const ref = useRef<Nullable<HTMLDivElement>>(null)

  const isWorld = location.pathname === ROUTES.WORLD
  const showOverlay = isWorld && endingRefly

  const shellBackground = useMemo(() => {
    const vars = currentTheme.colors.variables as unknown as Record<string, string | undefined>
    const bg2 = vars.bg2 ?? 'rgba(10, 10, 14, 1)'
    const bg3 = vars.bg3 ?? 'rgba(6, 6, 10, 1)'
    const glow = vars.primaryTransparent ?? 'rgba(255, 255, 255, 0.16)'
    return `radial-gradient(circle at center, ${glow}, transparent 30%),linear-gradient(180deg, ${bg3}, ${bg2})`
  }, [currentTheme])

  useLayoutEffect(() => {
    if (location.pathname !== ROUTES.WORLD) {
      TransitionStore.getState().clearEndingRefly()
    }
  }, [location.pathname])

  useGSAP(
    (_ctx) => {
      const node = ref.current
      if (!node || !showOverlay) return

      const shell = node.querySelector<HTMLElement>('[data-overlay-shell]')
      const veil = node.querySelector<HTMLElement>('[data-overlay-veil]')
      const paths = node.querySelectorAll<SVGGeometryElement>('[data-overlay-draw]')
      const dots = node.querySelectorAll<SVGElement>('[data-overlay-dot]')
      const copy = node.querySelectorAll<HTMLElement>('[data-overlay-copy]')

      if (!shell || !veil) return

      if (reducedMotion) {
        window.location.reload()
        return
      }

      paths.forEach((path) => {
        const length = path.getTotalLength()
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      })

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
          window.location.reload()
        })
    },
    { scope: ref, dependencies: [showOverlay, reducedMotion] },
  )

  if (!showOverlay) return null

  return (
    <div ref={ref} className={styles.root}>
      <div className={styles.shell} style={{ background: shellBackground }} data-overlay-shell>
        <div className={styles.veil} data-overlay-veil />
        <div className={styles.copy}>
          <p data-overlay-copy>{t('brand.title')}</p>
          <span data-overlay-copy>{t('brand.subtitle')}</span>
        </div>
        <div className={styles.graphic}>
          <PageMoodGraphics page={ROUTES.WORLD} className={styles.svg} />
        </div>
      </div>
    </div>
  )
}
