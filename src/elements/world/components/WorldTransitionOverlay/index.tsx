import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { WorldMood } from '@/types/site'
import { ensureGsap } from '@/utils/motion/gsap'
import styles from './styles.module.css'

type TransitionRequest = {
  id: number
  mood: WorldMood
  title?: string
  subtitle?: string
} | null

type WorldTransitionOverlayProps = {
  request: TransitionRequest
  onMidpoint: () => void
  onComplete: () => void
}

function WorldTransitionOverlay({
  request,
  onMidpoint,
  onComplete,
}: WorldTransitionOverlayProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const node = ref.current
      if (!node || !request) {
        return
      }

      const { gsap } = ensureGsap()
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

      const timeline = gsap.timeline({
        onComplete,
      })

      timeline
        .set(node, { autoAlpha: 1 })
        .fromTo(
          shell,
          { clipPath: 'circle(0% at 50% 50%)', opacity: 0.92 },
          { clipPath: 'circle(78% at 50% 50%)', opacity: 1, duration: 0.9, ease: 'power4.inOut' },
        )
        .fromTo(
          paths,
          { strokeDashoffset: (_, target) => target.getTotalLength() },
          {
            strokeDashoffset: 0,
            duration: 0.95,
            stagger: 0.08,
            ease: request.mood === 'systems' ? 'expo.out' : 'power3.out',
          },
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
          {
            opacity: 0.24,
            scale: 1.06,
            transformOrigin: 'center center',
            duration: 0.7,
            ease: 'sine.inOut',
          },
          '<',
        )
        .add(onMidpoint)
        .to(
          copy,
          {
            opacity: 0,
            y: -16,
            duration: 0.32,
            stagger: 0.04,
            ease: 'power2.in',
          },
          '+=0.05',
        )
        .to(
          shell,
          {
            clipPath: 'circle(0% at 50% 50%)',
            opacity: 0,
            duration: 0.82,
            ease: 'power4.inOut',
          },
          '-=0.08',
        )
        .set(node, { autoAlpha: 0 })
    },
    { scope: ref, dependencies: [request, reducedMotion, onMidpoint, onComplete] },
  )

  if (!request) {
    return null
  }

  return (
    <div ref={ref} className={`${styles.root} ${styles[request.mood]}`}>
      <div className={styles.shell} data-overlay-shell>
        <div className={styles.veil} data-overlay-veil />
        <div className={styles.copy}>
          <p data-overlay-copy>{request.title ?? 'Lyu World'}</p>
          {request.subtitle ? <span data-overlay-copy>{request.subtitle}</span> : null}
        </div>
        <div className={styles.graphic}>{renderMoodGraphic(request.mood)}</div>
      </div>
    </div>
  )
}

function renderMoodGraphic(mood: WorldMood) {
  if (mood === 'entry') {
    return (
      <svg viewBox="0 0 640 340" className={styles.svg}>
        <ellipse cx="320" cy="170" rx="182" ry="88" data-overlay-draw />
        <ellipse cx="320" cy="170" rx="128" ry="50" data-overlay-draw />
        <path d="M96 222C162 160 216 124 290 122C374 120 438 162 544 224" data-overlay-draw />
        <circle cx="320" cy="170" r="16" data-overlay-dot />
        <circle cx="456" cy="190" r="8" data-overlay-dot />
      </svg>
    )
  }

  if (mood === 'editorial') {
    return (
      <svg viewBox="0 0 640 340" className={styles.svg}>
        <path d="M186 60V282" data-overlay-draw />
        <path d="M234 94V258" data-overlay-draw />
        <path d="M412 82V268" data-overlay-draw />
        <path d="M456 56V286" data-overlay-draw />
        <path d="M248 136H398" data-overlay-draw />
        <path d="M250 210H360" data-overlay-draw />
        <circle cx="402" cy="136" r="6" data-overlay-dot />
      </svg>
    )
  }

  if (mood === 'systems') {
    return (
      <svg viewBox="0 0 640 340" className={styles.svg}>
        <path d="M122 168H248L302 116H406L500 202H564" data-overlay-draw />
        <path d="M248 168V252" data-overlay-draw />
        <path d="M406 116V224" data-overlay-draw />
        <rect x="282" y="136" width="80" height="80" rx="14" data-overlay-dot />
        <circle cx="248" cy="168" r="8" data-overlay-dot />
        <circle cx="406" cy="116" r="8" data-overlay-dot />
      </svg>
    )
  }

  if (mood === 'fragments') {
    return (
      <svg viewBox="0 0 640 340" className={styles.svg}>
        <path d="M114 230C174 188 228 176 288 198C348 220 390 258 458 252C516 246 546 220 586 188" data-overlay-draw />
        <path d="M238 102C266 138 280 172 274 210C268 246 248 266 250 294" data-overlay-draw />
        <path d="M390 118C418 106 440 126 442 156C444 180 426 198 398 200C372 202 354 182 356 158C358 138 370 124 390 118Z" data-overlay-draw />
        <circle cx="456" cy="252" r="7" data-overlay-dot />
      </svg>
    )
  }

  if (mood === 'trajectory') {
    return (
      <svg viewBox="0 0 640 340" className={styles.svg}>
        <path d="M108 246C198 210 274 174 346 124C412 80 472 64 544 82" data-overlay-draw />
        <path d="M176 280C266 248 340 220 412 170C470 130 516 106 566 98" data-overlay-draw />
        <circle cx="346" cy="124" r="8" data-overlay-dot />
        <circle cx="544" cy="82" r="9" data-overlay-dot />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 640 340" className={styles.svg}>
      <path d="M320 82V256" data-overlay-draw />
      <path d="M240 140C278 116 362 116 400 140" data-overlay-draw />
      <path d="M198 194C252 154 388 154 442 194" data-overlay-draw />
      <circle cx="320" cy="82" r="11" data-overlay-dot />
      <circle cx="320" cy="82" r="72" data-overlay-draw />
    </svg>
  )
}

export { WorldTransitionOverlay }
