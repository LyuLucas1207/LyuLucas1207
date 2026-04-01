import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

import { useReducedMotion } from '@/hooks'
import type { WorldMood } from '@/types'
import gsap from 'gsap'
import styles from './styles.module.css'

type WorldAtmosphereProps = {
  mood: WorldMood
  pageKey: string
}

function WorldAtmosphere({ mood, pageKey }: WorldAtmosphereProps) {
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
            ease: mood === 'systems' ? 'power2.out' : 'sine.out',
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
        const y = mood === 'fragments' ? 24 : mood === 'entry' ? 14 : 10
        const x = mood === 'trajectory' ? 12 : mood === 'editorial' ? 4 : 8
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
        const rotation = mood === 'entry' ? 18 : mood === 'beacon' ? 10 : 6
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
    { scope: ref, dependencies: [mood, pageKey, reducedMotion] },
  )

  return (
    <div ref={ref} className={`${styles.root} ${styles[mood]}`} aria-hidden="true">
      {mood === 'entry' ? <EntryAtmosphere /> : null}
      {mood === 'editorial' ? <EditorialAtmosphere /> : null}
      {mood === 'systems' ? <SystemsAtmosphere /> : null}
      {mood === 'fragments' ? <FragmentsAtmosphere /> : null}
      {mood === 'trajectory' ? <TrajectoryAtmosphere /> : null}
      {mood === 'beacon' ? <BeaconAtmosphere /> : null}
    </div>
  )
}

function EntryAtmosphere() {
  return (
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
  )
}

function EditorialAtmosphere() {
  return (
    <svg viewBox="0 0 1600 960" className={styles.svg}>
      <g className={styles.layerSoft}>
        <path d="M172 84V872" data-atmos-line />
        <path d="M244 132V836" data-atmos-line />
        <path d="M1278 122V826" data-atmos-line />
        <path d="M1344 82V868" data-atmos-line />
        <path d="M318 208H654" data-atmos-line />
        <path d="M972 710H1266" data-atmos-line />
      </g>
      <g className={styles.layerBright}>
        <circle cx="650" cy="208" r="8" data-atmos-dot />
        <circle cx="972" cy="710" r="7" data-atmos-dot />
        <rect x="694" y="214" width="184" height="1.5" data-atmos-float />
        <rect x="764" y="704" width="136" height="1.5" data-atmos-float />
      </g>
    </svg>
  )
}

function SystemsAtmosphere() {
  return (
    <svg viewBox="0 0 1600 960" className={styles.svg}>
      <g className={styles.layerSoft}>
        <path d="M152 228H602L720 342H1006L1168 208H1438" data-atmos-line />
        <path d="M248 612H518L652 474H972L1150 624H1386" data-atmos-line />
        <path d="M602 228V472" data-atmos-line />
        <path d="M1006 342V610" data-atmos-line />
      </g>
      <g className={styles.layerBright}>
        <circle cx="602" cy="228" r="8" data-atmos-dot />
        <circle cx="1006" cy="342" r="10" data-atmos-dot />
        <circle cx="652" cy="474" r="7" data-atmos-dot />
        <circle cx="1150" cy="624" r="8" data-atmos-dot />
        <rect x="748" y="286" width="176" height="176" rx="26" data-atmos-float />
      </g>
    </svg>
  )
}

function FragmentsAtmosphere() {
  return (
    <svg viewBox="0 0 1600 960" className={styles.svg}>
      <g className={styles.layerSoft}>
        <path
          d="M160 670C280 582 390 566 498 606C608 648 672 742 792 746C936 752 1014 626 1126 604C1244 580 1352 640 1462 744"
          data-atmos-line
        />
        <path
          d="M388 142C444 218 470 306 460 384C450 468 396 530 404 622"
          data-atmos-line
        />
      </g>
      <g className={styles.layerBright}>
        <path
          d="M1006 214C1048 190 1090 212 1100 256C1108 296 1082 334 1034 342C988 350 950 314 952 270C956 242 976 224 1006 214Z"
          data-atmos-float
        />
        <path
          d="M1192 316C1222 296 1260 312 1268 348C1276 378 1252 414 1218 418C1180 424 1144 390 1150 352C1154 334 1170 320 1192 316Z"
          data-atmos-float
        />
        <circle cx="718" cy="698" r="8" data-atmos-dot />
        <circle cx="1402" cy="704" r="7" data-atmos-dot />
      </g>
    </svg>
  )
}

function TrajectoryAtmosphere() {
  return (
    <svg viewBox="0 0 1600 960" className={styles.svg}>
      <g className={styles.layerSoft}>
        <path
          d="M134 714C306 648 450 584 604 472C744 370 828 268 1038 206C1184 162 1322 160 1476 196"
          data-atmos-line
        />
        <path
          d="M220 802C426 724 590 658 748 552C928 430 1042 314 1250 256"
          data-atmos-line
        />
      </g>
      <g className={styles.layerBright}>
        <circle cx="604" cy="472" r="8" data-atmos-dot />
        <circle cx="1038" cy="206" r="10" data-atmos-dot />
        <circle cx="1250" cy="256" r="7" data-atmos-dot />
        <path d="M1012 178L1082 108" data-atmos-float />
      </g>
    </svg>
  )
}

function BeaconAtmosphere() {
  return (
    <svg viewBox="0 0 1600 960" className={styles.svg}>
      <g className={styles.layerSoft}>
        <path d="M800 140V760" data-atmos-line />
        <path d="M666 274C736 230 866 230 934 274" data-atmos-line />
        <path d="M610 384C710 314 892 314 992 384" data-atmos-line />
        <path d="M552 516C686 414 914 414 1048 516" data-atmos-line />
      </g>
      <g className={styles.layerBright}>
        <circle cx="800" cy="140" r="12" data-atmos-dot />
        <circle cx="800" cy="140" r="94" data-atmos-spin />
        <circle cx="800" cy="140" r="164" data-atmos-spin />
      </g>
    </svg>
  )
}

export { WorldAtmosphere }
