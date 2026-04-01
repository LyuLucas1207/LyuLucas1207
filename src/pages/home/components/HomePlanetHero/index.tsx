import { ChevronDown, Sparkles } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { changeLanguage, LanguageEnum, useThemeLabel } from 'nfx-ui/languages'
import { ThemeEnum, useTheme } from 'nfx-ui/themes'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { routeMoods } from '@/constants/siteContent'
import { useWorldTransition } from '@/hooks/useWorldTransition'
import { ROUTES } from '@/navigations/routes'
import { createUniverseScene } from '../universe/scene'
import { buildUniversePalette } from '../universe/theme'
import type { StarSystemConfig } from '../universe/types'
import styles from './styles.module.css'

const themeOptions: ThemeEnum[] = [
  ThemeEnum.DEFAULT,
  ThemeEnum.LIGHT,
  ThemeEnum.CORPORATE,
  ThemeEnum.FOREST,
  ThemeEnum.WINE,
  ThemeEnum.COSMIC,
  ThemeEnum.DARK,
  ThemeEnum.WHEAT,
  ThemeEnum.COFFEE,
]

function HomePlanetHero() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation(['common', 'home'])
  const { currentTheme, setTheme } = useTheme()
  const { getThemeDisplayName } = useThemeLabel()
  const { playWorldTransition } = useWorldTransition()
  const prefersReducedMotion = useReducedMotion()
  const sceneHostRef = useRef<HTMLDivElement | null>(null)
  const sceneControllerRef = useRef<ReturnType<typeof createUniverseScene> | null>(null)
  const sidebarRef = useRef<HTMLElement | null>(null)
  const [sessionSeed] = useState(() => Math.random())
  const [, setDragging] = useState(false)
  const palette = useMemo(() => buildUniversePalette(currentTheme.colors.variables), [currentTheme])
  const [focusedSystemId, setFocusedSystemId] = useState<string | undefined>(undefined)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const systemDescriptions = useMemo<Record<string, string>>(
    () => ({
      'theme-system': t('home:scene.themeGalaxyDescription'),
      'language-system': t('home:scene.languageGalaxyDescription'),
      'page-system': t('home:scene.pageGalaxyDescription'),
    }),
    [t],
  )

  const languagePlanets = useMemo(
    () => [
      {
        id: `lang-${LanguageEnum.ZH}`,
        value: LanguageEnum.ZH,
        label: t(`language.${LanguageEnum.ZH}`),
        orbitRadius: 11,
        planetRadius: 1.5,
        orbitSpeed: 0.0085,
      },
      {
        id: `lang-${LanguageEnum.EN}`,
        value: LanguageEnum.EN,
        label: t(`language.${LanguageEnum.EN}`),
        orbitRadius: 18,
        planetRadius: 1.5,
        orbitSpeed: 0.0055,
      },
      {
        id: `lang-${LanguageEnum.FR}`,
        value: LanguageEnum.FR,
        label: t(`language.${LanguageEnum.FR}`),
        orbitRadius: 25,
        planetRadius: 1.45,
        orbitSpeed: 0.0044,
      },
    ],
    [t],
  )

  const themePlanets = useMemo(
    () =>
      themeOptions.map((option, index) => ({
        id: `theme-${option}`,
        label: getThemeDisplayName(option),
        orbitRadius: 10 + index * 4.4,
        planetRadius: index % 3 === 0 ? 1.55 : index % 2 === 0 ? 1.35 : 1.2,
        orbitSpeed: Math.max(0.0025, 0.009 - index * 0.00055),
        onSelect: () =>
          playWorldTransition({
            mood: 'systems',
            title: getThemeDisplayName(option),
            subtitle: t('labels.worldShift'),
            action: () => setTheme(option),
          }),
      })),
    [playWorldTransition, setTheme, t],
  )

  const systems = useMemo<StarSystemConfig[]>(
    () => [
      {
        id: 'theme-system',
        name: t('home:scene.themeGalaxy'),
        summary: t('home:scene.planetUnit'),
        planets: themePlanets,
      },
      {
        id: 'language-system',
        name: t('home:scene.languageGalaxy'),
        summary: t('home:scene.planetUnit'),
        planets: languagePlanets.map((planet) => ({
          id: planet.id,
          label: planet.label,
          orbitRadius: planet.orbitRadius,
          planetRadius: planet.planetRadius,
          orbitSpeed: planet.orbitSpeed,
          onSelect: () =>
            playWorldTransition({
              mood: 'beacon',
              title: planet.label,
              subtitle: t('labels.worldShift'),
              action: () => changeLanguage(planet.value),
            }),
        })),
      },
      {
        id: 'page-system',
        name: t('home:scene.pageGalaxy'),
        summary: t('home:scene.planetUnit'),
        planets: [
          {
            id: 'page-about',
            label: t('navigation.about'),
            orbitRadius: 11,
            planetRadius: 1.35,
            orbitSpeed: 0.0085,
            onSelect: () =>
              playWorldTransition({
                mood: routeMoods[ROUTES.ABOUT],
                title: t('navigation.about'),
                subtitle: t('labels.worldShift'),
                action: () => navigate(ROUTES.ABOUT),
              }),
          },
          {
            id: 'page-projects',
            label: t('navigation.projects'),
            orbitRadius: 17,
            planetRadius: 1.55,
            orbitSpeed: 0.006,
            onSelect: () =>
              playWorldTransition({
                mood: routeMoods[ROUTES.PROJECTS],
                title: t('navigation.projects'),
                subtitle: t('labels.worldShift'),
                action: () => navigate(ROUTES.PROJECTS),
              }),
          },
          {
            id: 'page-life',
            label: t('navigation.life'),
            orbitRadius: 22,
            planetRadius: 1.3,
            orbitSpeed: 0.0048,
            onSelect: () =>
              playWorldTransition({
                mood: routeMoods[ROUTES.LIFE],
                title: t('navigation.life'),
                subtitle: t('labels.worldShift'),
                action: () => navigate(ROUTES.LIFE),
              }),
          },
          {
            id: 'page-contact',
            label: t('navigation.contact'),
            orbitRadius: 27,
            planetRadius: 1.25,
            orbitSpeed: 0.0038,
            onSelect: () =>
              playWorldTransition({
                mood: routeMoods[ROUTES.CONTACT],
                title: t('navigation.contact'),
                subtitle: t('labels.worldShift'),
                action: () => navigate(ROUTES.CONTACT),
              }),
          },
        ],
      },
    ],
    [languagePlanets, navigate, playWorldTransition, t, themePlanets],
  )

  const activeSystem = systems.find((system) => system.id === focusedSystemId)
  const handleReloadWorld = () => {
    playWorldTransition({
      mood: 'entry',
      title: 'Lyu World',
      subtitle: t('brand.subtitle'),
      action: () => window.location.reload(),
    })
  }

  useEffect(() => {
    const host = sceneHostRef.current
    if (!host) {
      return
    }

    const controller = createUniverseScene({
      host,
      palette,
      prefersReducedMotion,
      onDraggingChange: setDragging,
      systems,
      sessionSeed,
      onFocusSystemChange: setFocusedSystemId,
    })
    sceneControllerRef.current = controller

    return () => {
      sceneControllerRef.current = null
      controller.destroy()
    }
  }, [palette, prefersReducedMotion, sessionSeed, systems, location.pathname])

  useEffect(() => {
    sceneControllerRef.current?.setFocusSystem(focusedSystemId)
  }, [focusedSystemId])

  useEffect(() => {
    if (!sidebarOpen) return
    const handlePointerDown = (e: PointerEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [sidebarOpen])

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

      <aside ref={sidebarRef} className={styles.systemSidebar} aria-label="System navigation">
        <button
          type="button"
          className={`${styles.sidebarToggle} ${sidebarOpen ? styles.sidebarToggleOpen : ''}`}
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          <span className={styles.toggleIndicator} />
          <span className={styles.toggleLabel}>
            {activeSystem?.name ?? t('home:scene.selectGalaxy')}
          </span>
          <ChevronDown size={14} className={styles.toggleChevron} />
        </button>
        <nav
          className={`${styles.sidebarPanel} ${sidebarOpen ? styles.sidebarPanelOpen : ''}`}
        >
          {systems.map((system) => (
            <button
              key={system.id}
              type="button"
              className={`${styles.galaxyOption} ${
                focusedSystemId === system.id ? styles.galaxyOptionActive : ''
              }`}
              onClick={() => {
                setFocusedSystemId(system.id)
                setSidebarOpen(false)
              }}
            >
              <span className={styles.galaxyDot} />
              <span className={styles.galaxyInfo}>
                <strong>{system.name}</strong>
                <span>{system.planets.length} {system.summary}</span>
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <div className={styles.actionDock}>
        <button
          type="button"
          className={styles.actionButton}
          onClick={handleReloadWorld}
          title={t('home:scene.reflyIdle')}
        >
          <strong>{t('home:scene.reflySystem')}</strong>
        </button>
      </div>

      <div className={styles.hud} aria-live="polite">
        <span className={styles.hudLabel}>
          <Sparkles size={14} />
          {t('home:scene.selectedSystem')}
        </span>
        <strong>{activeSystem?.name ?? t('home:scene.freeNavigation')}</strong>
        <p className={styles.hudDescription}>
          {focusedSystemId
            ? systemDescriptions[focusedSystemId]
            : t('home:scene.freeNavigationDesc')}
        </p>
      </div>
    </section>
  )
}

export { HomePlanetHero }
