import { useGSAP } from '@gsap/react'
import type { RefObject } from 'react'

import { useReducedMotion } from '@/hooks'
import gsap from 'gsap'

const CHUNK_IN = {
  y: 26,
  duration: 0.9,
  stagger: 0.07,
  ease: 'power4.out',
  scale: 0.985,
} as const

export function usePageTransition(ref: RefObject<HTMLElement | null>, pageKey: string) {
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const node = ref.current

      if (!node || reducedMotion) {
        return
      }

      const targets = node.querySelectorAll<HTMLElement>('[data-page-chunk]')

      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: CHUNK_IN.y,
          filter: 'blur(10px)',
          rotate: 0,
          scale: CHUNK_IN.scale,
        },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: CHUNK_IN.duration,
          stagger: CHUNK_IN.stagger,
          ease: CHUNK_IN.ease,
        },
      )
    },
    { scope: ref, dependencies: [pageKey, reducedMotion] },
  )
}
