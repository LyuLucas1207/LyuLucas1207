import { ChevronDown } from 'lucide-react'
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
        <span className={styles.toggleIndicator} />
        <span className={styles.toggleLabel}>{activeSystemName ?? selectGalaxyLabel}</span>
        <ChevronDown size={14} className={styles.toggleChevron} />
      </button>

      <nav className={`${styles.sidebarPanel} ${sidebarOpen ? styles.sidebarPanelOpen : ''}`}>
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

