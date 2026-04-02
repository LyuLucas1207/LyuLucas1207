import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

import { useReducedMotion } from '@/hooks'
import gsap from 'gsap'
import styles from './styles.module.css'

function WorldAtmosphere() {
  const ref = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const node = ref.current
      if (!node || reducedMotion) {
        return
      }

      const lines = node.querySelectorAll<SVGGeometryElement>('[data-atmos-line]')
      const dots = node.querySelectorAll<SVGElement>('[data-atmos-dot]')
      const floats = node.querySelectorAll<SVGElement>('[data-atmos-float]')
      const spins = node.querySelectorAll<SVGElement>('[data-atmos-spin]')

      lines.forEach((line, index) => {
        if ('getTotalLength' in line) {
          const length = line.getTotalLength()
          gsap.set(line, {
            strokeDasharray: length,
            strokeDashoffset: length,
            opacity: 0.32,
          })

          gsap.to(line, {
            strokeDashoffset: 0,
            duration: 1.4 + index * 0.18,
            delay: 0.1 + index * 0.05,
            ease: 'sine.out',
          })
        }
      })

      dots.forEach((dot, index) => {
        gsap.fromTo(
          dot,
          { opacity: 0.22, scale: 0.86, transformOrigin: 'center center' },
          {
            opacity: 0.74,
            scale: 1.08,
            duration: 1.5 + index * 0.15,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          },
        )
      })

      floats.forEach((item, index) => {
        const y = 14
        const x = 8
        gsap.to(item, {
          x: index % 2 === 0 ? x : -x,
          y: index % 2 === 0 ? -y : y,
          duration: 5.5 + index * 0.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })

      spins.forEach((item, index) => {
        const rotation = 18
        gsap.to(item, {
          rotate: index % 2 === 0 ? rotation : -rotation,
          duration: 10 + index * 1.5,
          repeat: -1,
          yoyo: true,
          transformOrigin: 'center center',
          ease: 'sine.inOut',
        })
      })
    },
    { scope: ref, dependencies: [reducedMotion] },
  )

  return (
    <div ref={ref} className={`${styles.root} ${styles.layer}`} aria-hidden="true">
      <svg viewBox="0 0 1600 960" className={styles.svg}>
        <g className={styles.layerSoft}>
          <path
            d="M-18 294C98 162 254 118 400 148C544 176 660 274 828 274C994 274 1070 170 1224 142C1360 118 1498 166 1616 234"
            data-atmos-line
          />
          <path
            d="M24 398C186 296 324 304 464 364C606 424 712 512 904 500C1084 490 1186 362 1328 330C1456 300 1548 326 1644 402"
            data-atmos-line
          />
          <path
            d="M196 64C312 112 412 244 430 388C446 510 396 612 434 736"
            data-atmos-line
          />
        </g>
        <g className={styles.layerBright}>
          <ellipse cx="1110" cy="224" rx="280" ry="140" data-atmos-spin />
          <ellipse cx="1110" cy="224" rx="190" ry="86" data-atmos-spin />
          <circle cx="1110" cy="224" r="22" data-atmos-dot />
          <circle cx="1284" cy="244" r="7" data-atmos-dot />
          <circle cx="958" cy="178" r="9" data-atmos-dot />
        </g>
      </svg>
    </div>
  )
}

export { WorldAtmosphere }
