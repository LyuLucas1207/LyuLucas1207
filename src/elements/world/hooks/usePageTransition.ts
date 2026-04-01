import { useGSAP } from '@gsap/react'
import type { RefObject } from 'react'

import { useReducedMotion } from '../../../hooks/useReducedMotion'
import type { WorldMood } from '../../../types/site'
import { ensureGsap } from '../../../utils/motion/gsap'

export function usePageTransition(
  ref: RefObject<HTMLElement | null>,
  pageKey: string,
  mood: WorldMood,
) {
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const node = ref.current

      if (!node || reducedMotion) {
        return
      }

      const { gsap } = ensureGsap()
      const targets = node.querySelectorAll<HTMLElement>('[data-page-chunk]')
      const transitionMap: Record<
        WorldMood,
        { y: number; duration: number; stagger: number; ease: string; rotate?: number; scale?: number }
      > = {
        entry: { y: 26, duration: 0.9, stagger: 0.07, ease: 'power4.out', scale: 0.985 },
        editorial: { y: 16, duration: 0.78, stagger: 0.05, ease: 'power2.out' },
        systems: { y: 18, duration: 0.68, stagger: 0.04, ease: 'expo.out', rotate: -0.35 },
        fragments: { y: 24, duration: 0.88, stagger: 0.06, ease: 'sine.out', scale: 0.992 },
        trajectory: { y: 20, duration: 0.72, stagger: 0.045, ease: 'power3.out', rotate: 0.25 },
        beacon: { y: 14, duration: 0.64, stagger: 0.035, ease: 'power2.out', scale: 0.995 },
      }
      const config = transitionMap[mood]

      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: config.y,
          filter: 'blur(10px)',
          rotate: config.rotate ?? 0,
          scale: config.scale ?? 1,
        },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: config.duration,
          stagger: config.stagger,
          ease: config.ease,
        },
      )
    },
    { scope: ref, dependencies: [pageKey, mood, reducedMotion] },
  )
}
