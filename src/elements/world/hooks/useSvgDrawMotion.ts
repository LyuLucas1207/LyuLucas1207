import { useGSAP } from '@gsap/react'
import type { RefObject } from 'react'
import type { Nullable } from 'nfx-ui/types'

import { useReducedMotion } from '@/hooks'
import gsap from 'gsap'

type UseSvgDrawMotionOptions = {
  dependencies?: unknown[]
}

export function useSvgDrawMotion(
  ref: RefObject<Nullable<HTMLElement | SVGElement>>,
  options: UseSvgDrawMotionOptions = {},
) {
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const node = ref.current

      if (!node || reducedMotion) {
        return
      }

      const paths = node.querySelectorAll<SVGGeometryElement>('[data-draw]')
      const points = node.querySelectorAll<HTMLElement>('[data-pulse]')

      paths.forEach((path, index) => {
        const length = path.getTotalLength()
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0.35,
        })
        gsap.to(path, {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 1.1,
          delay: 0.18 * index,
          ease: 'power3.out',
        })
      })

      points.forEach((point, index) => {
        gsap.fromTo(
          point,
          { opacity: 0, scale: 0.4, transformOrigin: 'center center' },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: 0.35 + index * 0.08,
            ease: 'back.out(2)',
          },
        )
      })
    },
    { scope: ref, dependencies: [reducedMotion, ...(options.dependencies ?? [])] },
  )
}
