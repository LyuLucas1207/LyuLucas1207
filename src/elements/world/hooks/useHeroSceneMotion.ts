import { useGSAP } from '@gsap/react'
import type { RefObject } from 'react'

import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { ensureGsap } from '../../../utils/motion/gsap'

type UseHeroSceneMotionOptions = {
  dependencies?: unknown[]
}

export function useHeroSceneMotion(
  ref: RefObject<HTMLElement | null>,
  options: UseHeroSceneMotionOptions = {},
) {
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const node = ref.current

      if (!node || reducedMotion) {
        return
      }

      const { gsap } = ensureGsap()
      const scene = node.querySelectorAll<HTMLElement>('[data-scene]')
      const rings = node.querySelectorAll<HTMLElement>('[data-orbit-ring]')
      const dots = node.querySelectorAll<HTMLElement>('[data-orbit-dot]')

      gsap.fromTo(
        scene,
        { opacity: 0, y: 24, filter: 'blur(12px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
        },
      )

      rings.forEach((ring, index) => {
        gsap.to(ring, {
          rotate: index % 2 === 0 ? 360 : -360,
          duration: 26 + index * 5,
          repeat: -1,
          ease: 'none',
          transformOrigin: 'center center',
        })
      })

      dots.forEach((dot, index) => {
        gsap.to(dot, {
          scale: 1.15,
          opacity: 1,
          duration: 1.8 + index * 0.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          transformOrigin: 'center center',
        })
      })
    },
    { scope: ref, dependencies: [reducedMotion, ...(options.dependencies ?? [])] },
  )
}
