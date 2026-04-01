import { useGSAP } from '@gsap/react'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ThemeEnum, useTheme } from 'nfx-ui/themes'

import { routeMoods } from '../../../constants/siteContent'
import { useLocale } from '../../../hooks/useLocale'
import { useWorldTransition } from '../../../hooks/useWorldTransition'
import type { WorldMood } from '../../../types/site'
import { ensureGsap } from '../../../utils/motion/gsap'
import styles from './LyuWorldScene.module.css'

type ThemeNode = {
  id: string
  title: string
  description: string
  theme: ThemeEnum
  mood: WorldMood
  orbit: number
  angle: number
  size: number
}

type PageNode = {
  id: string
  title: string
  path: string
  mood: WorldMood
  orbit: number
  angle: number
  size: number
}

type SettingNode = {
  id: string
  title: string
  orbit: number
  angle: number
  size: number
  action: () => void
}

type LyuWorldSceneProps = {
  activePath: string
}

function LyuWorldScene({ activePath }: LyuWorldSceneProps) {
  const { t, i18n } = useTranslation(['common', 'home'])
  const navigate = useNavigate()
  const locale = useLocale()
  const { themeName, setTheme } = useTheme()
  const { playWorldTransition } = useWorldTransition()
  const sectionRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const rotationRef = useRef({ theme: -12, page: 28, settings: -34 })
  const animationRef = useRef<{
    kill: () => void
    pause: () => void
    play: () => void
  } | null>(null)
  const dragState = useRef({
    active: false,
    startX: 0,
    theme: -12,
    page: 28,
    settings: -34,
  })
  const [rotation, setRotation] = useState({ theme: -12, page: 28, settings: -34 })
  const [focusLabel, setFocusLabel] = useState<string>(t('home:scene.themeGalaxy'))

  const themeNodes = useMemo<ThemeNode[]>(
    () => [
      {
        id: 'corporate',
        title: t('common:worldTones.corporate.title'),
        description: t('common:worldTones.corporate.description'),
        theme: ThemeEnum.CORPORATE,
        mood: 'systems',
        orbit: 276,
        angle: -12,
        size: 118,
      },
      {
        id: 'forest',
        title: t('common:worldTones.forest.title'),
        description: t('common:worldTones.forest.description'),
        theme: ThemeEnum.FOREST,
        mood: 'fragments',
        orbit: 236,
        angle: 58,
        size: 100,
      },
      {
        id: 'wine',
        title: t('common:worldTones.wine.title'),
        description: t('common:worldTones.wine.description'),
        theme: ThemeEnum.WINE,
        mood: 'editorial',
        orbit: 286,
        angle: 128,
        size: 112,
      },
      {
        id: 'cosmic',
        title: t('common:worldTones.cosmic.title'),
        description: t('common:worldTones.cosmic.description'),
        theme: ThemeEnum.COSMIC,
        mood: 'trajectory',
        orbit: 246,
        angle: 214,
        size: 102,
      },
      {
        id: 'dark',
        title: t('home:scene.darkTone'),
        description: t('home:scene.darkToneDescription'),
        theme: ThemeEnum.DARK,
        mood: 'beacon',
        orbit: 304,
        angle: 288,
        size: 108,
      },
      {
        id: 'wheat',
        title: t('common:worldTones.wheat.title'),
        description: t('common:worldTones.wheat.description'),
        theme: ThemeEnum.WHEAT,
        mood: 'entry',
        orbit: 216,
        angle: 344,
        size: 92,
      },
    ],
    [t],
  )

  const pageNodes = useMemo<PageNode[]>(
    () => [
      { id: 'about', title: t('common:navigation.about'), path: '/about', mood: routeMoods['/about'], orbit: 166, angle: 26, size: 60 },
      { id: 'projects', title: t('common:navigation.projects'), path: '/projects', mood: routeMoods['/projects'], orbit: 182, angle: 102, size: 64 },
      { id: 'life', title: t('common:navigation.life'), path: '/life', mood: routeMoods['/life'], orbit: 154, angle: 190, size: 58 },
      { id: 'highlights', title: t('common:navigation.highlights'), path: '/highlights', mood: routeMoods['/highlights'], orbit: 188, angle: 268, size: 62 },
      { id: 'contact', title: t('common:navigation.contact'), path: '/contact', mood: routeMoods['/contact'], orbit: 174, angle: 332, size: 56 },
    ],
    [t],
  )

  const settingNodes = useMemo<SettingNode[]>(
    () => [
      {
        id: 'zh',
        title: t('common:language.zh'),
        orbit: 98,
        angle: 54,
        size: 42,
        action: () =>
          playWorldTransition({
            mood: 'beacon',
            title: t('common:language.zh'),
            subtitle: t('home:scene.settingsGalaxy'),
            action: () => void i18n.changeLanguage('zh'),
          }),
      },
      {
        id: 'en',
        title: t('common:language.en'),
        orbit: 104,
        angle: 196,
        size: 42,
        action: () =>
          playWorldTransition({
            mood: 'beacon',
            title: t('common:language.en'),
            subtitle: t('home:scene.settingsGalaxy'),
            action: () => void i18n.changeLanguage('en'),
          }),
      },
      {
        id: 'reenter',
        title: t('common:actions.reenterWorld'),
        orbit: 112,
        angle: 312,
        size: 48,
        action: () =>
          playWorldTransition({
            mood: 'entry',
            title: t('common:actions.reenterWorld'),
            subtitle: t('common:brand.subtitle'),
            action: () => window.scrollTo({ top: 0, behavior: 'auto' }),
          }),
      },
    ],
    [i18n, playWorldTransition, t],
  )

  useGSAP(
    () => {
      const { gsap } = ensureGsap()

      animationRef.current = gsap.to(rotationRef.current, {
        theme: '+=360',
        page: '-=360',
        settings: '+=360',
        duration: 72,
        repeat: -1,
        ease: 'none',
        onUpdate: () => {
          setRotation({
            theme: rotationRef.current.theme,
            page: rotationRef.current.page,
            settings: rotationRef.current.settings,
          })
        },
      })

      return () => {
        animationRef.current?.kill()
        animationRef.current = null
      }
    },
    { scope: stageRef },
  )

  const beginDrag = (clientX: number) => {
    dragState.current = {
      active: true,
      startX: clientX,
      theme: rotationRef.current.theme,
      page: rotationRef.current.page,
      settings: rotationRef.current.settings,
    }
    animationRef.current?.pause()
  }

  const updateDrag = (clientX: number) => {
    if (!dragState.current.active) {
      return
    }

    const delta = clientX - dragState.current.startX
    rotationRef.current.theme = dragState.current.theme + delta * 0.16
    rotationRef.current.page = dragState.current.page - delta * 0.12
    rotationRef.current.settings = dragState.current.settings + delta * 0.24
    setRotation({ ...rotationRef.current })
  }

  const endDrag = () => {
    if (!dragState.current.active) {
      return
    }

    dragState.current.active = false
    animationRef.current?.play()
  }

  useGSAP(
    () => {
      const node = stageRef.current
      if (!node) {
        return
      }

      const { gsap } = ensureGsap()
      const onPointerMove = (event: PointerEvent) => updateDrag(event.clientX)
      const onPointerUp = () => endDrag()

      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)

      const timeline = gsap.timeline()
      timeline
        .fromTo(
          node.querySelectorAll('[data-scene-line]'),
          { opacity: 0, strokeDashoffset: 280, strokeDasharray: 280 },
          { opacity: 1, strokeDashoffset: 0, duration: 1.2, stagger: 0.08, ease: 'power3.out' },
        )
        .fromTo(
          node.querySelectorAll('[data-world-node]'),
          { opacity: 0, scale: 0.72, transformOrigin: 'center center' },
          { opacity: 1, scale: 1, duration: 0.85, stagger: 0.05, ease: 'back.out(1.8)' },
          '-=0.65',
        )

      return () => {
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
      }
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
        scale: 0.78,
        y: -84,
        opacity: 0.46,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top+=40',
          end: 'bottom top+=220',
          scrub: true,
        },
      })

      gsap.to(section.querySelector('[data-scene-hud]'), {
        y: -34,
        opacity: 0.42,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top+=40',
          end: 'bottom top+=200',
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

  const handleThemeActivate = (node: ThemeNode) => {
    setFocusLabel(node.title)

    playWorldTransition({
      mood: node.mood,
      title: node.title,
      subtitle: node.description,
      action:
        themeName === node.theme
          ? () => window.scrollTo({ top: 0, behavior: 'auto' })
          : () => setTheme(node.theme),
    })
  }

  const handlePageActivate = (node: PageNode) => {
    setFocusLabel(node.title)
    playWorldTransition({
      mood: node.mood,
      title: node.title,
      subtitle: t('common:labels.worldShift'),
      action:
        activePath === node.path
          ? () => window.scrollTo({ top: 0, behavior: 'auto' })
          : () => navigate(node.path),
    })
  }

  return (
    <section ref={sectionRef} className={styles.sceneSection} data-page-chunk>
      <div className={styles.hud} data-scene-hud>
        <div className={styles.intro}>
          <span>{t('home:scene.eyebrow')}</span>
          <h2>{t('home:scene.title')}</h2>
          <p>{t('home:scene.description')}</p>
        </div>
        <div className={styles.legend}>
          <div>
            <strong>{t('home:scene.themeGalaxy')}</strong>
            <span>{t('home:scene.themeGalaxyDescription')}</span>
          </div>
          <div>
            <strong>{t('home:scene.pageGalaxy')}</strong>
            <span>{t('home:scene.pageGalaxyDescription')}</span>
          </div>
          <div>
            <strong>{t('home:scene.settingsGalaxy')}</strong>
            <span>{t('home:scene.settingsGalaxyDescription')}</span>
          </div>
        </div>
      </div>

      <div
        ref={stageRef}
        className={styles.stage}
        onPointerDown={(event) => beginDrag(event.clientX)}
        role="presentation"
      >
        <svg viewBox="0 0 1440 920" className={styles.backdrop} aria-hidden="true">
          <ellipse cx="720" cy="460" rx="392" ry="152" className={styles.themeOrbit} data-scene-line />
          <ellipse cx="720" cy="460" rx="272" ry="106" className={styles.pageOrbit} data-scene-line />
          <ellipse cx="720" cy="460" rx="156" ry="62" className={styles.settingsOrbit} data-scene-line />
          <path d="M72 186C286 96 470 72 654 106C846 140 1048 244 1342 346" className={styles.meshLine} data-scene-line />
          <path d="M126 722C318 640 490 614 660 632C850 652 1046 716 1292 822" className={styles.meshLine} data-scene-line />
        </svg>

        <div className={styles.center}>
          <div className={styles.centerHalo} />
          <div className={styles.centerCore} />
          <div className={styles.centerLabel}>
            <small>{t('common:navigation.world')}</small>
            <strong>Lyu World</strong>
            <span>{focusLabel}</span>
          </div>
        </div>

        {themeNodes.map((node) => (
          <ThemePlanet
            key={node.id}
            node={node}
            rotation={rotation.theme}
            active={themeName === node.theme}
            onEnter={() => setFocusLabel(node.title)}
            onActivate={() => handleThemeActivate(node)}
          />
        ))}

        {pageNodes.map((node) => (
          <PageMoon
            key={node.id}
            node={node}
            rotation={rotation.page}
            active={activePath === node.path}
            onEnter={() => setFocusLabel(node.title)}
            onActivate={() => handlePageActivate(node)}
          />
        ))}

        {settingNodes.map((node) => (
          <SettingSatellite
            key={node.id}
            node={node}
            rotation={rotation.settings}
            active={(node.id === locale && (node.id === 'zh' || node.id === 'en')) || node.id === 'reenter'}
            onEnter={() => setFocusLabel(node.title)}
            onActivate={node.action}
          />
        ))}
      </div>
    </section>
  )
}

function ThemePlanet({
  node,
  rotation,
  active,
  onEnter,
  onActivate,
}: {
  node: ThemeNode
  rotation: number
  active: boolean
  onEnter: () => void
  onActivate: () => void
}) {
  const angle = ((node.angle + rotation) * Math.PI) / 180
  const x = Math.cos(angle) * node.orbit
  const y = Math.sin(angle) * (node.orbit * 0.36)

  return (
    <button
      type="button"
      data-world-node
      className={`${styles.themePlanet} ${styles[node.mood]} ${active ? styles.activeTheme : ''}`}
      style={{
        width: `${node.size}px`,
        height: `${node.size}px`,
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onClick={onActivate}
    >
      <span className={styles.themePlanetCore} />
      <span className={styles.themePlanetRing} />
      <span className={styles.planetText}>{node.title}</span>
    </button>
  )
}

function PageMoon({
  node,
  rotation,
  active,
  onEnter,
  onActivate,
}: {
  node: PageNode
  rotation: number
  active: boolean
  onEnter: () => void
  onActivate: () => void
}) {
  const angle = ((node.angle + rotation) * Math.PI) / 180
  const x = Math.cos(angle) * node.orbit
  const y = Math.sin(angle) * (node.orbit * 0.34)

  return (
    <button
      type="button"
      data-world-node
      className={`${styles.pageMoon} ${styles[node.mood]} ${active ? styles.activePage : ''}`}
      style={{
        width: `${node.size}px`,
        height: `${node.size}px`,
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onClick={onActivate}
    >
      <span className={styles.pageMoonCore} />
      <span className={styles.pageMoonOutline} />
      <span className={styles.pageText}>{node.title}</span>
    </button>
  )
}

function SettingSatellite({
  node,
  rotation,
  active,
  onEnter,
  onActivate,
}: {
  node: SettingNode
  rotation: number
  active: boolean
  onEnter: () => void
  onActivate: () => void
}) {
  const angle = ((node.angle + rotation) * Math.PI) / 180
  const x = Math.cos(angle) * node.orbit
  const y = Math.sin(angle) * (node.orbit * 0.3)

  return (
    <button
      type="button"
      data-world-node
      className={`${styles.settingSatellite} ${active ? styles.activeSetting : ''}`}
      style={{
        width: `${node.size}px`,
        height: `${node.size}px`,
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onClick={onActivate}
    >
      <span className={styles.settingCore}>{node.title.slice(0, 2)}</span>
    </button>
  )
}

export { LyuWorldScene }
