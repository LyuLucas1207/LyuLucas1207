import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useTheme } from 'nfx-ui/themes'
import type { Nullable } from 'nfx-ui/types'

import { prefetchWorldEntryAssets } from '@/elements/universe/utils/prefetchWorldEntry'
import { useReducedMotion } from '@/hooks'
import { ROUTES } from '@/navigations/routes'
import { consumeWorldEntryHandledByPageTransition, useTransitionStore } from '@/stores/transitionStore'
import gsap from 'gsap'

import { scheduleBrowserIdleTask } from '../../scheduleBrowserIdle'
import { PageMoodGraphics } from '../PageMoodGraphics'
import styles from '../PageTransitionOverlay/styles.module.css'

/**
 * 仅处理冷启动 / 刷新落在 `/` 的首屏：全屏已展开态、`prefetchWorldEntryAssets` 完成后再播收口动画。
 * 与 `PageTransitionOverlay` 解耦；经 `playWorldTransition` 进入 World 时由 store 标记，避免重复叠层。
 */
export function EnteringTransition() {
  const location = useLocation()
  const request = useTransitionStore((s) => s.request)
  const { t } = useTranslation(['components', 'WorldPage'])
  const reducedMotion = useReducedMotion()
  const { currentTheme } = useTheme()
  const ref = useRef<Nullable<HTMLDivElement>>(null)
  const [done, setDone] = useState(false)

  const isWorld = location.pathname === ROUTES.WORLD
  const showOverlay = isWorld && !done && request === null

  const shellBackground = useMemo(() => {
    const vars = currentTheme.colors.variables as unknown as Record<string, string | undefined>
    const bg2 = vars.bg2 ?? 'rgba(10, 10, 14, 1)'
    const bg3 = vars.bg3 ?? 'rgba(6, 6, 10, 1)'
    const glow = vars.primaryTransparent ?? 'rgba(255, 255, 255, 0.16)'
    return `radial-gradient(circle at center, ${glow}, transparent 30%),linear-gradient(180deg, ${bg3}, ${bg2})`
  }, [currentTheme])

  useLayoutEffect(() => {
    if (consumeWorldEntryHandledByPageTransition()) {
      setDone(true)
    }
  }, [location.pathname, request])

  useLayoutEffect(() => {
    if (request !== null && isWorld) {
      setDone(true)
    }
  }, [request, isWorld])

  useLayoutEffect(() => {
    if (!showOverlay) return
    const node = ref.current
    if (!node) return

    const shell = node.querySelector<HTMLElement>('[data-overlay-shell]')
    const veil = node.querySelector<HTMLElement>('[data-overlay-veil]')
    const paths = node.querySelectorAll<SVGGeometryElement>('[data-overlay-draw]')
    const dots = node.querySelectorAll<SVGElement>('[data-overlay-dot]')
    const copy = node.querySelectorAll<HTMLElement>('[data-overlay-copy]')

    if (!shell || !veil) return

    let cancelled = false
    let exitTween: Nullable<gsap.core.Tween | gsap.core.Timeline> = null
    let idleExit: { cancel: () => void } | null = null

    paths.forEach((path) => {
      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 })
    })
    gsap.set(node, { autoAlpha: 1 })
    gsap.set(shell, { clipPath: 'circle(78% at 50% 50%)', opacity: 1 })
    gsap.set(dots, { opacity: 1, scale: 1, transformOrigin: 'center center' })
    gsap.set(copy, { opacity: 1, y: 0, filter: 'blur(0px)' })
    gsap.set(veil, { opacity: 0.24, scale: 1.06, transformOrigin: 'center center' })

    const playExit = () => {
      if (cancelled) return
      if (reducedMotion) {
        gsap.set(node, { autoAlpha: 0 })
        setDone(true)
        return
      }
      exitTween = gsap
        .timeline({
          onComplete: () => {
            if (!cancelled) setDone(true)
          },
        })
        .to(copy, { opacity: 0, y: -16, duration: 0.32, stagger: 0.04, ease: 'power2.in' })
        .to(
          shell,
          { clipPath: 'circle(0% at 50% 50%)', opacity: 0, duration: 0.82, ease: 'power4.inOut' },
          '-=0.08',
        )
        .set(node, { autoAlpha: 0 })
    }

    void (async () => {
      await prefetchWorldEntryAssets()
      if (cancelled) return
      idleExit = scheduleBrowserIdleTask(playExit)
    })()

    return () => {
      cancelled = true
      idleExit?.cancel()
      if (exitTween) exitTween.kill()
    }
  }, [showOverlay, reducedMotion])

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
