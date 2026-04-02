import { ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import type { Dispatch, RefObject, SetStateAction } from 'react'
import { useEffect, useRef } from 'react'

import type { StarSystemConfig } from '@/elements/universe/types'

import styles from './styles.module.css'

type Props = {
  systems: StarSystemConfig[]
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  focusedSystemId?: string
  setFocusedSystemId: Dispatch<SetStateAction<string | undefined>>
  activeSystemName?: string
  selectGalaxyLabel: string
}

export function HomeSystemSidebar({
  systems,
  sidebarOpen,
  setSidebarOpen,
  focusedSystemId,
  setFocusedSystemId,
  activeSystemName,
  selectGalaxyLabel,
}: Props) {
  const sidebarRef = useRef<HTMLElement | null>(null)
  const panelRef = useRef<HTMLElement | null>(null)
  const toggleIndicatorRef = useRef<HTMLSpanElement | null>(null)

  // Entrance (no dependency on universe palette).
  useEffect(() => {
    if (!sidebarRef.current) return

    gsap.fromTo(
      sidebarRef.current,
      { opacity: 0, y: -14, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
    )
  }, [])

  // Gentle idle pulse on the indicator.
  useEffect(() => {
    if (!toggleIndicatorRef.current) return

    const tween = gsap.to(toggleIndicatorRef.current, {
      scale: 1.18,
      duration: 1.9,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    return () => {
      tween.kill()
    }
  }, [])

  useEffect(() => {
    if (!sidebarOpen) return

    const handlePointerDown = (e: PointerEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [sidebarOpen, setSidebarOpen])

  useEffect(() => {
    if (!panelRef.current) return

    if (sidebarOpen) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: -6, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.34, ease: 'power2.out' },
      )
    } else {
      gsap.to(panelRef.current, { opacity: 0, y: -4, duration: 0.18, ease: 'power2.out' })
    }
  }, [sidebarOpen])

  return (
    <aside
      ref={sidebarRef as RefObject<HTMLElement>}
      className={styles.systemSidebar}
      aria-label="System navigation"
    >
      <button
        type="button"
        className={`${styles.sidebarToggle} ${sidebarOpen ? styles.sidebarToggleOpen : ''}`}
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        <span ref={toggleIndicatorRef} className={styles.toggleIndicator} />
        <span className={styles.toggleLabel}>{activeSystemName ?? selectGalaxyLabel}</span>
        <ChevronDown size={14} className={styles.toggleChevron} />
      </button>

      <nav
        ref={panelRef as unknown as RefObject<HTMLElement>}
        className={`${styles.sidebarPanel} ${sidebarOpen ? styles.sidebarPanelOpen : ''}`}
      >
        {systems.map((system) => (
          <button
            key={system.id}
            type="button"
            className={`${styles.galaxyOption} ${focusedSystemId === system.id ? styles.galaxyOptionActive : ''}`}
            onClick={() => {
              setFocusedSystemId(system.id)
              setSidebarOpen(false)
            }}
          >
            <span className={styles.galaxyDot} />
            <span className={styles.galaxyInfo}>
              <strong>{system.name}</strong>
              <span>
                {system.planets.length} {system.summary}
              </span>
            </span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

