import { Sparkles } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { ThemeEnum, useTheme } from 'nfx-ui/themes'

import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { createUniverseScene } from './universe/scene'
import { readUniversePalette } from './universe/theme'
import type { UniversePalette } from './universe/types'
import styles from './HomePlanetHero.module.css'

type ThemeOption = {
  value: ThemeEnum
  label: string
}

const themeOptions: ThemeOption[] = [
  { value: ThemeEnum.DEFAULT, label: 'Default' },
  { value: ThemeEnum.LIGHT, label: 'Light' },
  { value: ThemeEnum.CORPORATE, label: 'Corporate' },
  { value: ThemeEnum.FOREST, label: 'Forest' },
  { value: ThemeEnum.WINE, label: 'Wine' },
  { value: ThemeEnum.COSMIC, label: 'Cosmic' },
  { value: ThemeEnum.DARK, label: 'Dark' },
  { value: ThemeEnum.WHEAT, label: 'Wheat' },
  { value: ThemeEnum.COFFEE, label: 'Coffee' },
]

function HomePlanetHero() {
  const { themeName, setTheme } = useTheme()
  const prefersReducedMotion = useReducedMotion()
  const sceneHostRef = useRef<HTMLDivElement | null>(null)
  const [dragging, setDragging] = useState(false)
  const [palette, setPalette] = useState<UniversePalette>(() => readUniversePalette())

  useEffect(() => {
    let frameId = 0
    frameId = window.requestAnimationFrame(() => {
      setPalette(readUniversePalette())
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [themeName])

  useEffect(() => {
    const host = sceneHostRef.current
    if (!host) {
      return
    }

    return createUniverseScene({
      host,
      palette,
      prefersReducedMotion,
      onDraggingChange: setDragging,
    })
  }, [palette, prefersReducedMotion])

  return (
    <section
      className={styles.hero}
      style={
        {
          '--space-bg': palette.bg,
          '--space-bg-2': palette.bg2,
          '--space-bg-3': palette.bg3,
          '--space-star-primary': palette.primary,
          '--space-star-secondary': palette.primaryLight,
          '--space-star-highlight': palette.fgHighlight,
          '--space-overlay': palette.overlay,
          '--space-border': palette.border2,
          '--space-veil': palette.primaryTransparent,
          '--space-text': palette.fgHeading,
        } as CSSProperties
      }
    >
      <div className={styles.sceneCanvas} ref={sceneHostRef} />
      <div className={styles.atmosphere} aria-hidden="true" />

      <div className={styles.toolbar}>
        <label className={styles.themePicker}>
          <span>Theme</span>
          <select value={themeName} onChange={(event) => setTheme(event.target.value as ThemeEnum)}>
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.hud}>
        <span className={styles.hudLabel}>
          <Sparkles size={14} />
          Deep Space
        </span>
        <strong>{dragging ? 'Free look engaged' : 'Drag to look around, wheel to fly'}</strong>
      </div>
    </section>
  )
}

export { HomePlanetHero }
