import { useGSAP } from '@gsap/react'
import type { RefObject } from 'react'
import type { Nullable } from 'nfx-ui/types'

import { useReducedMotion } from '@/hooks'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type UseScrollAtmosphereOptions = {
  selector?: string
  y?: number
}

export function useScrollAtmosphere(
  ref: RefObject<Nullable<HTMLElement>>,
  options: UseScrollAtmosphereOptions = {},
) {
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const node = ref.current

      if (!node || reducedMotion) {
        return
      }

      const targets = options.selector
        ? node.querySelectorAll<HTMLElement>(options.selector)
        : [node]

      targets.forEach((target, index) => {
        gsap.fromTo(
          target,
          {
            opacity: 0,
            y: options.y ?? 26,
            x: 0,
            scale: 1,
            filter: 'blur(6px)',
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.85,
            ease: 'power4.out',
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
    { scope: ref, dependencies: [reducedMotion, options.selector, options.y] },
  )
}
