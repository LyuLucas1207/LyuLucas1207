import { useGSAP } from '@gsap/react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useWorldTransition } from '@/hooks/useWorldTransition'
import type { WorldMood } from '@/types/site'
import { ensureGsap } from '@/utils/motion/gsap'
import styles from './styles.module.css'

type GalaxyWorld = {
  id: string
  path: string
  title: string
  description: string
  mood: WorldMood
  orbit: number
  angle: number
  size: number
}

type GalaxyNavigatorProps = {
  worlds: GalaxyWorld[]
  activePath: string
}

function GalaxyNavigator({ worlds, activePath }: GalaxyNavigatorProps) {
  const { t } = useTranslation(['common', 'home'])
  const navigate = useNavigate()
  const { playWorldTransition } = useWorldTransition()
  const stageRef = useRef<HTMLDivElement | null>(null)
  const rotationProxy = useRef({ value: -18 })
  const autoRotateRef = useRef<{
    pause: () => void
    play: () => void
    kill: () => void
  } | null>(null)
  const dragState = useRef({ active: false, startX: 0, startRotation: -18 })
  const [rotation, setRotation] = useState(-18)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const activeWorld = useMemo(
    () => worlds.find((world) => world.path === activePath) ?? worlds[0],
    [activePath, worlds],
  )
  const focusedWorld = useMemo(
    () => worlds.find((world) => world.id === hoveredId) ?? activeWorld,
    [activeWorld, hoveredId, worlds],
  )

  useGSAP(
    () => {
      const { gsap } = ensureGsap()

      autoRotateRef.current = gsap.to(rotationProxy.current, {
        value: '+=360',
        duration: 58,
        repeat: -1,
        ease: 'none',
        onUpdate: () => setRotation(rotationProxy.current.value),
      })

      return () => {
        autoRotateRef.current?.kill()
        autoRotateRef.current = null
      }
    },
    { scope: stageRef },
  )

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragState.current.active) {
        return
      }

      const nextRotation =
        dragState.current.startRotation + (event.clientX - dragState.current.startX) * 0.22
      rotationProxy.current.value = nextRotation
      setRotation(nextRotation)
    }

    const handlePointerUp = () => {
      if (!dragState.current.active) {
        return
      }

      dragState.current.active = false
      autoRotateRef.current?.play()
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  const handleStagePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragState.current.active = true
    dragState.current.startX = event.clientX
    dragState.current.startRotation = rotationProxy.current.value
    autoRotateRef.current?.pause()
  }

  const focusWorld = (world: GalaxyWorld) => {
    const { gsap } = ensureGsap()
    const targetRotation = 18 - world.angle

    autoRotateRef.current?.pause()
    gsap.to(rotationProxy.current, {
      value: targetRotation,
      duration: 1.05,
      ease: 'power3.inOut',
      onUpdate: () => setRotation(rotationProxy.current.value),
      onComplete: () => {
        setHoveredId(world.id)
        autoRotateRef.current?.play()
      },
    })
  }

  const enterWorld = (world: GalaxyWorld) => {
    focusWorld(world)

    playWorldTransition({
      mood: world.mood,
      title: world.title,
      subtitle:
        activePath === world.path ? t('actions.reenterWorld') : t('labels.worldShift'),
      action:
        activePath === world.path
          ? () => window.scrollTo({ top: 0, behavior: 'auto' })
          : () => navigate(world.path),
    })
  }

  return (
    <div className={styles.shell} data-page-chunk>
      <div className={styles.caption}>
        <span>{t('home:galaxy.eyebrow')}</span>
        <h2>{focusedWorld.title}</h2>
        <p>{focusedWorld.description}</p>
      </div>

      <div
        ref={stageRef}
        className={styles.stage}
        onPointerDown={handleStagePointerDown}
        role="presentation"
      >
        <svg viewBox="0 0 980 720" className={styles.backdrop} aria-hidden="true">
          <ellipse cx="490" cy="360" rx="326" ry="146" className={styles.orbitLine} />
          <ellipse cx="490" cy="360" rx="244" ry="102" className={styles.orbitLine} />
          <ellipse cx="490" cy="360" rx="166" ry="66" className={styles.orbitLine} />
          <path
            d="M70 200C194 124 336 102 480 126C610 146 750 216 908 310"
            className={styles.constellation}
          />
          <path
            d="M102 528C234 444 350 420 466 436C614 456 742 522 878 606"
            className={styles.constellation}
          />
        </svg>

        <div className={styles.core}>
          <div className={styles.coreHalo} />
          <div className={styles.coreLabel}>
            <small>{t('navigation.world')}</small>
            <strong>Lyu World</strong>
          </div>
        </div>

        {worlds.map((world) => {
          const angle = ((world.angle + rotation) * Math.PI) / 180
          const x = Math.cos(angle) * world.orbit
          const y = Math.sin(angle) * (world.orbit * 0.36)
          const isActive = activePath === world.path
          const isFocused = focusedWorld.id === world.id

          return (
            <button
              key={world.id}
              type="button"
              className={`${styles.planet} ${styles[world.mood]} ${
                isActive ? styles.active : ''
              } ${isFocused ? styles.focused : ''}`}
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                width: `${world.size}px`,
                height: `${world.size}px`,
              }}
              onClick={(event) => {
                event.stopPropagation()
                enterWorld(world)
              }}
              onMouseEnter={() => setHoveredId(world.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <span className={styles.planetCore} />
              <span className={styles.planetRing} />
              <span className={styles.planetLabel}>{world.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { GalaxyNavigator }
