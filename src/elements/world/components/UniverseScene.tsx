import { useGSAP } from '@gsap/react'
import type { ReactNode } from 'react'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ThemeEnum, useTheme } from 'nfx-ui/themes'

import { routeMoods } from '../../../constants/siteContent'
import { useLocale } from '../../../hooks/useLocale'
import { useWorldTransition } from '../../../hooks/useWorldTransition'
import type { WorldMood } from '../../../types/site'
import { ensureGsap } from '../../../utils/motion/gsap'
import styles from './UniverseScene.module.css'

type ThemePlanet = {
  id: string
  title: string
  description: string
  theme: ThemeEnum
  mood: WorldMood
  orbit: number
  angle: number
  size: number
  design: 'glider' | 'canopy' | 'liquid' | 'shard' | 'beacon' | 'archive'
}

type OrbitNode = {
  id: string
  title: string
  orbitX: number
  orbitY: number
  angle: number
  size: number
  design: string
}

type UniverseSceneProps = {
  activePath: string
}

function UniverseScene({ activePath }: UniverseSceneProps) {
  const { t, i18n } = useTranslation(['common', 'home'])
  const navigate = useNavigate()
  const locale = useLocale()
  const { themeName, setTheme } = useTheme()
  const { playWorldTransition } = useWorldTransition()
  const sectionRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const rotationRef = useRef({ universe: 0, theme: -10, page: 22, settings: -26, memory: 14 })
  const [rotation, setRotation] = useState({ universe: 0, theme: -10, page: 22, settings: -26, memory: 14 })
  const dragRef = useRef({ active: false, startX: 0, start: { universe: 0, theme: -10, page: 22, settings: -26, memory: 14 } })
  const [focusLabel, setFocusLabel] = useState<string>(t('home:scene.themeGalaxy'))

  const themePlanets = useMemo<ThemePlanet[]>(
    () => [
      { id: 'corporate', title: t('common:worldTones.corporate.title'), description: t('common:worldTones.corporate.description'), theme: ThemeEnum.CORPORATE, mood: 'systems', orbit: 250, angle: -10, size: 110, design: 'glider' },
      { id: 'forest', title: t('common:worldTones.forest.title'), description: t('common:worldTones.forest.description'), theme: ThemeEnum.FOREST, mood: 'fragments', orbit: 204, angle: 54, size: 104, design: 'canopy' },
      { id: 'wine', title: t('common:worldTones.wine.title'), description: t('common:worldTones.wine.description'), theme: ThemeEnum.WINE, mood: 'editorial', orbit: 272, angle: 126, size: 118, design: 'liquid' },
      { id: 'cosmic', title: t('common:worldTones.cosmic.title'), description: t('common:worldTones.cosmic.description'), theme: ThemeEnum.COSMIC, mood: 'trajectory', orbit: 226, angle: 212, size: 108, design: 'shard' },
      { id: 'dark', title: t('home:scene.darkTone'), description: t('home:scene.darkToneDescription'), theme: ThemeEnum.DARK, mood: 'beacon', orbit: 294, angle: 286, size: 102, design: 'beacon' },
      { id: 'wheat', title: t('common:worldTones.wheat.title'), description: t('common:worldTones.wheat.description'), theme: ThemeEnum.WHEAT, mood: 'entry', orbit: 174, angle: 344, size: 90, design: 'archive' },
    ],
    [t],
  )

  const pageNodes = useMemo<OrbitNode[]>(
    () => [
      { id: 'about', title: t('common:navigation.about'), orbitX: 126, orbitY: 74, angle: 24, size: 60, design: 'axis' },
      { id: 'projects', title: t('common:navigation.projects'), orbitX: 162, orbitY: 88, angle: 102, size: 64, design: 'schematic' },
      { id: 'life', title: t('common:navigation.life'), orbitX: 146, orbitY: 92, angle: 188, size: 58, design: 'fragment' },
      { id: 'highlights', title: t('common:navigation.highlights'), orbitX: 174, orbitY: 86, angle: 264, size: 62, design: 'signal' },
      { id: 'contact', title: t('common:navigation.contact'), orbitX: 132, orbitY: 76, angle: 334, size: 56, design: 'gateway' },
    ],
    [t],
  )

  const settingNodes = useMemo<OrbitNode[]>(
    () => [
      { id: 'zh', title: t('common:language.zh'), orbitX: 72, orbitY: 40, angle: 38, size: 42, design: 'language' },
      { id: 'en', title: t('common:language.en'), orbitX: 78, orbitY: 42, angle: 176, size: 42, design: 'language' },
      { id: 'fr', title: t('common:language.fr'), orbitX: 84, orbitY: 44, angle: 264, size: 42, design: 'language' },
      { id: 'reenter', title: t('common:actions.reenterWorld'), orbitX: 86, orbitY: 46, angle: 302, size: 48, design: 'return' },
    ],
    [t],
  )

  const memoryNodes = useMemo<OrbitNode[]>(
    () => [
      { id: 'echo', title: t('home:scene.memoryEcho'), orbitX: 118, orbitY: 62, angle: 34, size: 48, design: 'echo' },
      { id: 'archive', title: t('home:scene.memoryArchive'), orbitX: 142, orbitY: 82, angle: 156, size: 56, design: 'archiveMemory' },
      { id: 'ritual', title: t('home:scene.memoryRitual'), orbitX: 106, orbitY: 58, angle: 286, size: 44, design: 'ritual' },
    ],
    [t],
  )

  useGSAP(
    () => {
      const { gsap } = ensureGsap()
      const tween = gsap.to(rotationRef.current, {
        universe: '+=360',
        theme: '+=360',
        page: '-=360',
        settings: '+=360',
        memory: '-=360',
        duration: 88,
        repeat: -1,
        ease: 'none',
        onUpdate: () => setRotation({ ...rotationRef.current }),
      })
      return () => tween.kill()
    },
    { scope: stageRef },
  )

  useGSAP(
    () => {
      const section = sectionRef.current
      const stage = stageRef.current
      if (!section || !stage) {
        return
      }

      const { gsap, ScrollTrigger } = ensureGsap()
      gsap.to(stage, {
        scale: 0.74,
        y: -112,
        opacity: 0.34,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top+=40',
          end: 'bottom top+=260',
          scrub: true,
        },
      })

      gsap.to(section.querySelectorAll('[data-scene-copy]'), {
        y: -36,
        opacity: 0.32,
        stagger: 0.04,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top+=40',
          end: 'bottom top+=220',
          scrub: true,
        },
      })

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === section) {
            trigger.kill()
          }
        })
      }
    },
    { scope: sectionRef },
  )

  const beginDrag = (clientX: number) => {
    dragRef.current = {
      active: true,
      startX: clientX,
      start: { ...rotationRef.current },
    }
  }

  useGSAP(
    () => {
      const onMove = (event: PointerEvent) => {
        if (!dragRef.current.active) {
          return
        }
        const delta = event.clientX - dragRef.current.startX
        rotationRef.current.universe = dragRef.current.start.universe + delta * 0.03
        rotationRef.current.theme = dragRef.current.start.theme + delta * 0.16
        rotationRef.current.page = dragRef.current.start.page - delta * 0.1
        rotationRef.current.settings = dragRef.current.start.settings + delta * 0.2
        rotationRef.current.memory = dragRef.current.start.memory - delta * 0.06
        setRotation({ ...rotationRef.current })
      }

      const onUp = () => {
        dragRef.current.active = false
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      return () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }
    },
    { scope: stageRef },
  )

  const activateTheme = (planet: ThemePlanet) => {
    setFocusLabel(planet.title)
    playWorldTransition({
      mood: planet.mood,
      title: planet.title,
      subtitle: planet.description,
      action: themeName === planet.theme ? () => window.scrollTo({ top: 0, behavior: 'auto' }) : () => setTheme(planet.theme),
    })
  }

  const activatePage = (node: OrbitNode) => {
    const path = `/${node.id === 'about' ? 'about' : node.id === 'projects' ? 'projects' : node.id === 'life' ? 'life' : node.id === 'highlights' ? 'highlights' : 'contact'}`
    const mood = routeMoods[path]
    setFocusLabel(node.title)
    playWorldTransition({
      mood,
      title: node.title,
      subtitle: t('common:labels.worldShift'),
      action: activePath === path ? () => window.scrollTo({ top: 0, behavior: 'auto' }) : () => navigate(path),
    })
  }

  const activateSetting = (node: OrbitNode) => {
    setFocusLabel(node.title)
    if (node.id === 'zh' || node.id === 'en' || node.id === 'fr') {
      playWorldTransition({
        mood: 'beacon',
        title: node.title,
        subtitle: t('home:scene.settingsGalaxy'),
        action: () => void i18n.changeLanguage(node.id),
      })
      return
    }

    playWorldTransition({
      mood: 'entry',
      title: t('common:actions.reenterWorld'),
      subtitle: t('common:brand.subtitle'),
      action: () => window.scrollTo({ top: 0, behavior: 'auto' }),
    })
  }

  return (
    <section ref={sectionRef} className={styles.sceneSection} data-page-chunk>
      <div
        ref={stageRef}
        className={styles.universeDisc}
        style={{ transform: `rotate(${rotation.universe}deg)` }}
        onPointerDown={(event) => beginDrag(event.clientX)}
      >
        <svg viewBox="0 0 1600 1100" className={styles.universeBackdrop} aria-hidden="true">
          <ellipse cx="800" cy="550" rx="662" ry="444" className={styles.universeShell} data-scene-line />
          <ellipse cx="800" cy="550" rx="590" ry="394" className={styles.universeHalo} data-scene-line />
          <path d="M104 310C286 206 440 184 606 214C802 250 972 356 1268 528" className={styles.universeCurrent} data-scene-line />
          <path d="M178 862C368 744 548 704 704 720C918 742 1112 824 1432 972" className={styles.universeCurrent} data-scene-line />
        </svg>

        <div className={styles.worldCore}>
          <div className={styles.coreGlow} />
          <div className={styles.coreMass} />
          <div className={styles.coreCopy}>
            <small>{t('common:navigation.world')}</small>
            <strong>Lyu World</strong>
            <span>{focusLabel}</span>
          </div>
        </div>

        <div className={styles.sceneHud}>
          <div className={styles.sceneHint} data-scene-copy>
            <strong>{t('home:scene.dragHint')}</strong>
            <span>{t('home:scene.description')}</span>
          </div>
          <div className={styles.sceneLegend} data-scene-copy>
            <span>{t('home:scene.themeGalaxy')}</span>
            <span>{t('home:scene.pageGalaxy')}</span>
            <span>{t('home:scene.settingsGalaxy')}</span>
            <span>{t('home:scene.memoryGalaxy')}</span>
          </div>
        </div>

        <GalaxyShell name={t('home:scene.themeGalaxy')} tag={t('home:scene.themeGalaxyTag')} className={styles.themeGalaxy}>
          <svg viewBox="0 0 680 460" className={styles.galaxySvg} aria-hidden="true">
            <ellipse cx="340" cy="232" rx="246" ry="106" className={styles.themeRing} data-scene-line />
            <ellipse cx="340" cy="232" rx="176" ry="72" className={styles.themeRing} data-scene-line />
            <path d="M108 230C180 162 244 130 322 126C410 120 484 152 570 232" className={styles.themeTrace} data-scene-line />
          </svg>
          {themePlanets.map((planet) => (
            <ThemeWorldPlanet key={planet.id} planet={planet} rotation={rotation.theme} active={themeName === planet.theme} onEnter={() => setFocusLabel(planet.title)} onActivate={() => activateTheme(planet)} />
          ))}
        </GalaxyShell>

        <GalaxyShell name={t('home:scene.pageGalaxy')} tag={t('home:scene.pageGalaxyTag')} className={styles.pageGalaxy}>
          <svg viewBox="0 0 420 360" className={styles.galaxySvg} aria-hidden="true">
            <path d="M42 260C124 174 188 132 276 116C332 104 364 114 394 132" className={styles.pageArc} data-scene-line />
            <path d="M82 300C160 226 220 196 280 190C326 186 356 196 390 220" className={styles.pageArc} data-scene-line />
            <path d="M106 76L160 120L232 112L294 150L362 142" className={styles.pageGrid} data-scene-line />
          </svg>
          {pageNodes.map((node) => (
            <OrbitPlanet key={node.id} node={node} rotation={rotation.page} active={activePath.endsWith(node.id) || (node.id === 'contact' && activePath === '/contact')} className={styles.pagePlanet} labelClass={styles.pageLabel} onEnter={() => setFocusLabel(node.title)} onActivate={() => activatePage(node)} />
          ))}
        </GalaxyShell>

        <GalaxyShell name={t('home:scene.settingsGalaxy')} tag={t('home:scene.settingsGalaxyTag')} className={styles.settingsGalaxy}>
          <svg viewBox="0 0 320 260" className={styles.galaxySvg} aria-hidden="true">
            <ellipse cx="160" cy="132" rx="102" ry="42" className={styles.settingsRing} data-scene-line />
            <path d="M160 56V212M90 96L228 168M90 168L228 96" className={styles.settingsAxis} data-scene-line />
          </svg>
          {settingNodes.map((node) => (
            <OrbitPlanet key={node.id} node={node} rotation={rotation.settings} active={(node.id === locale && (node.id === 'zh' || node.id === 'en' || node.id === 'fr')) || node.id === 'reenter'} className={styles.settingPlanet} labelClass={styles.settingLabel} onEnter={() => setFocusLabel(node.title)} onActivate={() => activateSetting(node)} />
          ))}
        </GalaxyShell>

        <GalaxyShell name={t('home:scene.memoryGalaxy')} tag={t('home:scene.memoryGalaxyTag')} className={styles.memoryGalaxy}>
          <svg viewBox="0 0 360 300" className={styles.galaxySvg} aria-hidden="true">
            <path d="M48 212C92 118 168 90 236 126C286 152 304 198 322 236" className={styles.memoryCloud} data-scene-line />
            <path d="M74 246C126 186 184 172 234 186C272 198 300 226 316 252" className={styles.memoryCloud} data-scene-line />
          </svg>
          {memoryNodes.map((node) => (
            <OrbitPlanet key={node.id} node={node} rotation={rotation.memory} active={false} className={styles.memoryPlanet} labelClass={styles.memoryLabel} onEnter={() => setFocusLabel(node.title)} />
          ))}
        </GalaxyShell>
      </div>
    </section>
  )
}

function GalaxyShell({
  name,
  tag,
  className,
  children,
}: {
  name: string
  tag: string
  className: string
  children: ReactNode
}) {
  return (
    <div className={`${styles.galaxyShell} ${className}`} data-galaxy-group>
      <div className={styles.galaxyLabel}>
        <strong>{name}</strong>
        <span>{tag}</span>
      </div>
      {children}
    </div>
  )
}

function ThemeWorldPlanet({
  planet,
  rotation,
  active,
  onEnter,
  onActivate,
}: {
  planet: ThemePlanet
  rotation: number
  active: boolean
  onEnter: () => void
  onActivate: () => void
}) {
  const angle = ((planet.angle + rotation) * Math.PI) / 180
  const x = Math.cos(angle) * planet.orbit
  const y = Math.sin(angle) * (planet.orbit * 0.42)

  return (
    <button
      type="button"
      data-world-node
      className={`${styles.themeWorldPlanet} ${styles[planet.design]} ${active ? styles.activeTheme : ''}`}
      style={{ width: `${planet.size}px`, height: `${planet.size}px`, transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onClick={onActivate}
    >
      <span className={styles.themeMass} />
      <span className={styles.themeContour} />
      <span className={styles.themeAccent} />
      <span className={styles.themeRingA} />
      <span className={styles.themeRingB} />
      <span className={styles.planetLabel}>{planet.title}</span>
    </button>
  )
}

function OrbitPlanet({
  node,
  rotation,
  active,
  className,
  labelClass,
  onEnter,
  onActivate,
}: {
  node: OrbitNode
  rotation: number
  active: boolean
  className: string
  labelClass: string
  onEnter: () => void
  onActivate?: () => void
}) {
  const angle = ((node.angle + rotation) * Math.PI) / 180
  const x = Math.cos(angle) * node.orbitX
  const y = Math.sin(angle) * node.orbitY
  return (
    <button
      type="button"
      data-world-node
      className={`${className} ${styles[node.design]} ${active ? styles.activeNode : ''}`}
      style={{ width: `${node.size}px`, height: `${node.size}px`, transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onClick={onActivate}
    >
      <span className={styles.orbitMass} />
      <span className={styles.orbitFrame} />
      <span className={labelClass}>{node.title}</span>
    </button>
  )
}

export { UniverseScene }
