import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { changeLanguage, LanguageEnum, useLanguageLabel, useThemeLabel } from 'nfx-ui/languages'
import { ThemeEnum, useTheme } from 'nfx-ui/themes'

import { useReducedMotion } from '@/hooks'
import { routerEventEmitter } from '@/events/router'
import { ROUTES } from '@/navigations/routes'
import { playWorldTransition } from '@/stores/transitionStore'
import { createUniverseScene } from '@/elements/universe/scene'
import type { HoverInfo } from '@/elements/universe/scene'
import type { Nilable } from 'nfx-ui/types'
import { loadUniverseShaders } from '@/elements/universe/utils/shaders'
import { buildUniversePalette } from '@/elements/universe/theme'
import type { StarSystemConfig } from '@/elements/universe/types'
import styles from './styles.module.css'
import { HomeSystemSidebar } from '../HomeSystemSidebar'
import { HomeActionDock } from '../HomeActionDock'
import { HomeHud } from '../HomeHud'
import { HomeHoverTooltip } from '../HomeHoverTooltip'

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
  const location = useLocation()
  const { t, i18n } = useTranslation(['common', 'home'])
  const { currentTheme, setTheme } = useTheme()
  const { getThemeDisplayName } = useThemeLabel()
  const { getLanguageDisplayName } = useLanguageLabel()
  const prefersReducedMotion = useReducedMotion()
  const sceneHostRef = useRef<HTMLDivElement | null>(null)
  const sceneControllerRef = useRef<ReturnType<typeof createUniverseScene> | null>(null)
  const [, setDragging] = useState(false)
  const palette = useMemo(
    () => buildUniversePalette(currentTheme.colors.name as ThemeEnum, currentTheme.colors.variables),
    [currentTheme],
  )
  const [focusedSystemId, setFocusedSystemId] = useState<string | undefined>(undefined)
  const [hoverInfo, setHoverInfo] = useState<Nilable<HoverInfo>>(null)
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
    [getLanguageDisplayName, i18n.language],
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
            type: 'theme',
            theme: option,
            title: getThemeDisplayName(option),
            subtitle: t('labels.worldShift'),
            action: () => setTheme(option),
          }),
      })),
    [setTheme, t, getThemeDisplayName],
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
              type: 'language',
              language: planet.value,
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
            id: 'page-intro',
            label: t('navigation.intro'),
            orbitRadius: 11,
            planetRadius: 1.35,
            orbitSpeed: 0.0085,
            onSelect: () =>
              playWorldTransition({
                type: 'page',
                page: ROUTES.INTRO,
                title: t('navigation.intro'),
                subtitle: t('labels.worldShift'),
                action: () => routerEventEmitter.navigateToIntro(),
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
                type: 'page',
                page: ROUTES.PROJECTS,
                title: t('navigation.projects'),
                subtitle: t('labels.worldShift'),
                action: () => routerEventEmitter.navigateToProjects(),
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
                type: 'page',
                page: ROUTES.LIFE,
                title: t('navigation.life'),
                subtitle: t('labels.worldShift'),
                action: () => routerEventEmitter.navigateToLife(),
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
                type: 'page',
                page: ROUTES.CONTACT,
                title: t('navigation.contact'),
                subtitle: t('labels.worldShift'),
                action: () => routerEventEmitter.navigateToContact(),
              }),
          },
        ],
      },
    ],
    [languagePlanets, t, themePlanets],
  )

  const activeSystem = systems.find((system) => system.id === focusedSystemId)
  const handleReloadWorld = () => {
    playWorldTransition({
      type: 'page',
      page: ROUTES.HOME,
      title: 'Lyu World',
      subtitle: t('brand.subtitle'),
      action: () => window.location.reload(),
    })
  }

  useEffect(() => {
    const host = sceneHostRef.current
    if (!host) return

    let cancelled = false

    loadUniverseShaders().then((shaders) => {
      if (cancelled) return

      const controller = createUniverseScene({
        host,
        palette,
        shaders,
        prefersReducedMotion,
        onDraggingChange: setDragging,
        systems,
        onFocusSystemChange: setFocusedSystemId,
        onHoverChange: setHoverInfo,
      })
      sceneControllerRef.current = controller
    })

    return () => {
      cancelled = true
      sceneControllerRef.current?.destroy()
      sceneControllerRef.current = null
    }
  }, [palette, prefersReducedMotion, systems, location.pathname])

  useEffect(() => {
    sceneControllerRef.current?.setFocusSystem(focusedSystemId)
  }, [focusedSystemId])

  return (
    <section className={styles.hero}>
      <div className={styles.sceneCanvas} ref={sceneHostRef} />
      <div className={styles.atmosphere} aria-hidden="true" />

      <HomeSystemSidebar
        systems={systems}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        focusedSystemId={focusedSystemId}
        setFocusedSystemId={setFocusedSystemId}
        activeSystemName={activeSystem?.name}
        selectGalaxyLabel={t('home:scene.selectGalaxy')}
      />

      <HomeActionDock
        onReload={handleReloadWorld}
        buttonTitle={t('home:scene.reflyIdle')}
        buttonLabel={t('home:scene.reflySystem')}
      />

      <HomeHud
        label={t('home:scene.selectedSystem')}
        title={activeSystem?.name ?? t('home:scene.freeNavigation')}
        description={focusedSystemId ? systemDescriptions[focusedSystemId] : t('home:scene.freeNavigationDesc')}
      />

      <HomeHoverTooltip hoverInfo={hoverInfo} />
    </section>
  )
}

export { HomePlanetHero }
