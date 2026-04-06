import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { STARSHIP_SCENE_I18N_KEYS } from '@/elements/universe/utils/universeAssets'
import styles from './styles.module.css'
import { HomePlanetsPanel } from '../HomePlanetsPanel'
import { HomeSystemSidebar } from '../HomeSystemSidebar'
import { HomeActionDock } from '../HomeActionDock'
import { HomeHud } from '../HomeHud'
import { HomeHoverTooltip } from '../HomeHoverTooltip'
import { HomeStarshipBar } from '../HomeStarshipBar'

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

type HomePlanetHeroProps = {
  /** 飞船数量，与舰队面板、场景 `createStarshipFleet` 一致 */
  starshipCount?: number
}

function HomePlanetHero({ starshipCount = 5 }: HomePlanetHeroProps) {
  const location = useLocation()
  const { t, i18n } = useTranslation(['components', 'WorldPage'])
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
  const [followStarship, setFollowStarship] = useState<number | null>(null)
  const [hoverInfo, setHoverInfo] = useState<Nilable<HoverInfo>>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const setGalaxyFocus = useCallback<Dispatch<SetStateAction<string | undefined>>>((id) => {
    setFollowStarship(null)
    setFocusedSystemId(id)
  }, [])

  const starshipShipLabels = useMemo(
    () =>
      Array.from({ length: starshipCount }, (_, i) => {
        const key = STARSHIP_SCENE_I18N_KEYS[i]
        return key ? t(`WorldPage:scene.${key}`) : `${t('WorldPage:scene.starshipBarTitle')} ${i + 1}`
      }),
    [starshipCount, t],
  )

  const handleStarshipClick = useCallback((shipIndex: number) => {
    setFocusedSystemId(undefined)
    setFollowStarship((prev) => (prev === shipIndex ? null : shipIndex))
  }, [])

  const handleFocusSystemChange = useCallback((systemId?: string) => {
    if (systemId !== undefined) {
      setFollowStarship(null)
    }
    setFocusedSystemId(systemId)
  }, [])

  const handleBreakCameraFollow = useCallback(() => {
    setFollowStarship(null)
  }, [])

  const systemDescriptions = useMemo<Record<string, string>>(
    () => ({
      'theme-system': t('WorldPage:scene.themeGalaxyDescription'),
      'language-system': t('WorldPage:scene.languageGalaxyDescription'),
      'page-system': t('WorldPage:scene.pageGalaxyDescription'),
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
        name: t('WorldPage:scene.themeGalaxy'),
        summary: t('WorldPage:scene.planetUnit'),
        planets: themePlanets,
      },
      {
        id: 'language-system',
        name: t('WorldPage:scene.languageGalaxy'),
        summary: t('WorldPage:scene.planetUnit'),
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
        name: t('WorldPage:scene.pageGalaxy'),
        summary: t('WorldPage:scene.planetUnit'),
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
      page: ROUTES.WORLD,
      title: t('brand.title'),
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
        starshipCount,
        onFocusSystemChange: handleFocusSystemChange,
        onBreakCameraFollow: handleBreakCameraFollow,
        onHoverChange: setHoverInfo,
      })
      sceneControllerRef.current = controller
    })

    return () => {
      cancelled = true
      sceneControllerRef.current?.destroy()
      sceneControllerRef.current = null
    }
  }, [
    palette,
    prefersReducedMotion,
    systems,
    starshipCount,
    location.pathname,
    handleFocusSystemChange,
    handleBreakCameraFollow,
  ])

  useEffect(() => {
    const ctrl = sceneControllerRef.current
    if (!ctrl) return
    if (followStarship != null) {
      ctrl.setFollowStarship(followStarship)
    } else {
      ctrl.setFocusSystem(focusedSystemId)
    }
  }, [focusedSystemId, followStarship])

  return (
    <section className={styles.hero}>
      <div className={styles.sceneCanvas} ref={sceneHostRef} />
      <div className={styles.atmosphere} aria-hidden="true" />

      <HomeSystemSidebar
        systems={systems}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        focusedSystemId={focusedSystemId}
        setFocusedSystemId={setGalaxyFocus}
        activeSystemName={activeSystem?.name}
        selectGalaxyLabel={t('WorldPage:scene.selectGalaxy')}
      />

      <HomeStarshipBar
        title={t('WorldPage:scene.starshipBarTitle')}
        shipLabels={starshipShipLabels}
        activeLaneIndex={followStarship}
        onSelectLane={handleStarshipClick}
      />

      <HomeActionDock
        onReload={handleReloadWorld}
        buttonTitle={t('WorldPage:scene.reflyIdle')}
        buttonLabel={t('WorldPage:scene.reflySystem')}
      />

      <HomePlanetsPanel
        system={activeSystem}
        panelTitle={t('WorldPage:scene.planetsPanelTitle')}
        followLabel={t('WorldPage:scene.followPlanet')}
        enterLabel={t('WorldPage:scene.enterPlanet')}
        onFollowPlanet={(planetId) => {
          setFollowStarship(null)
          if (!focusedSystemId) return
          sceneControllerRef.current?.setFocusPlanet(focusedSystemId, planetId)
        }}
        onEnterPlanet={(planet) => planet.onSelect()}
      />

      <HomeHud
        label={t('WorldPage:scene.selectedSystem')}
        title={activeSystem?.name ?? t('WorldPage:scene.freeNavigation')}
        description={focusedSystemId ? systemDescriptions[focusedSystemId] : t('WorldPage:scene.freeNavigationDesc')}
      />

      <HomeHoverTooltip hoverInfo={hoverInfo} />
    </section>
  )
}

export { HomePlanetHero }
