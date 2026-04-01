import { Sparkles } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { getLanguageDisplayName, getThemeDisplayName, LanguageEnum } from 'nfx-ui/languages'
import { ThemeEnum, useTheme } from 'nfx-ui/themes'

import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { routeMoods } from '../../../constants/siteContent'
import { useLocale } from '../../../hooks/useLocale'
import { useWorldTransition } from '../../../hooks/useWorldTransition'
import { i18n } from '../../../assets/languages'
import { ROUTES } from '../../../navigations/routes'
import { createUniverseScene } from './universe/scene'
import { readUniversePalette } from './universe/theme'
import type { StarSystemConfig, UniversePalette } from './universe/types'
import styles from './HomePlanetHero.module.css'

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
  const { t } = useTranslation(['common'])
  const locale = useLocale()
  const { themeName, setTheme } = useTheme()
  const { playWorldTransition } = useWorldTransition()
  const prefersReducedMotion = useReducedMotion()
  const sceneHostRef = useRef<HTMLDivElement | null>(null)
  const sceneControllerRef = useRef<ReturnType<typeof createUniverseScene> | null>(null)
  const [sessionSeed] = useState(() => Math.random())
  const [dragging, setDragging] = useState(false)
  const [palette, setPalette] = useState<UniversePalette>(() => readUniversePalette())
  const [focusedSystemId, setFocusedSystemId] = useState<string | undefined>(undefined)

  const copy = useMemo(() => {
    if (locale === LanguageEnum.ZH) {
      return {
        themeSystem: '\u4e3b\u9898\u661f\u7cfb',
        languageSystem: '\u8bed\u8a00\u661f\u7cfb',
        pageSystem: '\u9875\u9762\u661f\u7cfb',
        selectedSystem: '\u5f53\u524d\u7cfb\u7edf',
        freeNavigation: '\u81ea\u7531\u9068\u6e38',
        planetUnit: '\u9897\u661f\u7403',
        manualFlight: '\u624b\u52a8\u822a\u884c',
        orbitReady: '\u8f68\u9053\u5f85\u547d',
        reflySystem: '\u91cd\u65b0\u52a0\u8f7d World',
        reflyIdle: '\u91cd\u65b0\u521d\u59cb\u5316\u5f53\u524d\u5b87\u5b99',
      }
    }

    if (locale === LanguageEnum.FR) {
      return {
        themeSystem: 'Systeme de themes',
        languageSystem: 'Systeme de langue',
        pageSystem: 'Systeme de pages',
        selectedSystem: 'Systeme actuel',
        freeNavigation: 'Navigation libre',
        planetUnit: 'planetes',
        manualFlight: 'Vol manuel',
        orbitReady: 'Orbites pretes',
        reflySystem: 'Recharger World',
        reflyIdle: 'Reinitialiser cet univers',
      }
    }

    return {
      themeSystem: 'Theme System',
      languageSystem: 'Language System',
      pageSystem: 'Page System',
      selectedSystem: 'Current System',
      freeNavigation: 'Free Navigation',
      planetUnit: 'planets',
      manualFlight: 'Manual Flight',
      orbitReady: 'Orbit Ready',
      reflySystem: 'Reload World',
      reflyIdle: 'Reload this world view',
    }
  }, [locale])

  const languagePlanets = useMemo(
    () => [
      {
        id: `lang-${LanguageEnum.ZH}`,
        value: LanguageEnum.ZH,
        label: getLanguageDisplayName(LanguageEnum.ZH),
        orbitRadius: 11,
        planetRadius: 1.5,
        orbitSpeed: 0.0085,
      },
      {
        id: `lang-${LanguageEnum.EN}`,
        value: LanguageEnum.EN,
        label: getLanguageDisplayName(LanguageEnum.EN),
        orbitRadius: 18,
        planetRadius: 1.5,
        orbitSpeed: 0.0055,
      },
      {
        id: `lang-${LanguageEnum.FR}`,
        value: LanguageEnum.FR,
        label: getLanguageDisplayName(LanguageEnum.FR),
        orbitRadius: 25,
        planetRadius: 1.45,
        orbitSpeed: 0.0044,
      },
    ],
    [],
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
        name: copy.themeSystem,
        summary: copy.planetUnit,
        planets: themePlanets,
      },
      {
        id: 'language-system',
        name: copy.languageSystem,
        summary: copy.planetUnit,
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
              action: () => void i18n.changeLanguage(planet.value),
            }),
        })),
      },
      {
        id: 'page-system',
        name: copy.pageSystem,
        summary: copy.planetUnit,
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
    [copy, languagePlanets, navigate, playWorldTransition, t, themePlanets],
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
    const frameId = window.requestAnimationFrame(() => {
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

      <aside className={styles.systemSidebar} aria-label="System navigation">
        {systems.map((system) => (
          <button
            key={system.id}
            type="button"
            className={`${styles.systemSidebarButton} ${
              focusedSystemId === system.id ? styles.systemSidebarButtonActive : ''
            }`}
            onClick={() => setFocusedSystemId(system.id)}
          >
            <strong>{system.name}</strong>
            <span>
              {system.planets.length} {system.summary}
            </span>
          </button>
        ))}
      </aside>

      <div className={styles.actionDock}>
        <button
          type="button"
          className={styles.actionButton}
          onClick={handleReloadWorld}
          title={copy.reflyIdle}
        >
          <span className={styles.actionButtonLabel}>{copy.reflySystem}</span>
          <strong>World</strong>
        </button>
      </div>

      <div className={styles.hud}>
        <span className={styles.hudLabel}>
          <Sparkles size={14} />
          {copy.selectedSystem}
        </span>
        <strong>{activeSystem?.name ?? copy.freeNavigation}</strong>
        <span className={styles.hudMeta}>{dragging ? copy.manualFlight : copy.orbitReady}</span>
      </div>
    </section>
  )
}

export { HomePlanetHero }
