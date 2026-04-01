import { useGSAP } from '@gsap/react'
import type { RefObject } from 'react'

import { useReducedMotion } from '../../../hooks/useReducedMotion'
import type { WorldMood } from '../../../types/site'
import { ensureGsap } from '../../../utils/motion/gsap'

type UseScrollAtmosphereOptions = {
  selector?: string
  y?: number
  mood?: WorldMood
}

export function useScrollAtmosphere(
  ref: RefObject<HTMLElement | null>,
  options: UseScrollAtmosphereOptions = {},
) {
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const node = ref.current

      if (!node || reducedMotion) {
        return
      }

      const { gsap, ScrollTrigger } = ensureGsap()
      const mood = options.mood ?? 'entry'
      const targets = options.selector
        ? node.querySelectorAll<HTMLElement>(options.selector)
        : [node]

      targets.forEach((target, index) => {
        const distanceMap: Record<WorldMood, number> = {
          entry: 32,
          editorial: 16,
          systems: 22,
          fragments: 28,
          trajectory: 24,
          beacon: 18,
        }
        const easeMap: Record<WorldMood, string> = {
          entry: 'power4.out',
          editorial: 'power2.out',
          systems: 'expo.out',
          fragments: 'sine.out',
          trajectory: 'power3.out',
          beacon: 'power2.out',
        }

        gsap.fromTo(
          target,
          {
            opacity: 0,
            y: options.y ?? distanceMap[mood],
            x: mood === 'systems' ? 10 : mood === 'trajectory' ? -8 : 0,
            scale: mood === 'fragments' ? 0.985 : 1,
            filter: mood === 'editorial' ? 'blur(8px)' : 'blur(6px)',
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.85,
            ease: easeMap[mood],
            delay: index * 0.03,
            scrollTrigger: {
              trigger: target,
              start: 'top 82%',
              once: true,
            },
          },
        )
      })

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (node.contains(trigger.trigger as Node)) {
            trigger.kill()
          }
        })
      }
    },
    { scope: ref, dependencies: [reducedMotion, options.selector, options.y, options.mood] },
  )
}
