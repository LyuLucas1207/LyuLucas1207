import { Menu } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Background } from 'nfx-ui/layouts'
import { useTheme } from 'nfx-ui/themes'

import {
  navigationItems,
  routeBackgrounds,
  routeMoods,
  socialLinks,
  worldPillars,
} from '../../constants/siteContent'
import { ReentryBeacon } from '../../elements/world/components/ReentryBeacon'
import { SectionDivider } from '../../elements/world/components/SectionDivider'
import { WorldAtmosphere } from '../../elements/world/components/WorldAtmosphere'
import { WorldMark } from '../../elements/world/components/WorldMark'
import { usePageTransition } from '../../elements/world/hooks/usePageTransition'
import { useWorldTransition } from '../../hooks/useWorldTransition'
import styles from './SiteLayout.module.css'
import { ROUTES } from '../../navigations/routes'

function SiteLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation(['common', 'home'])
  const [menuOpen, setMenuOpen] = useState(false)
  const mainRef = useRef<HTMLElement | null>(null)
  const { playWorldTransition } = useWorldTransition()
  const { themeName } = useTheme()
  const background = routeBackgrounds[location.pathname] ?? routeBackgrounds['/']
  const mood = routeMoods[location.pathname] ?? routeMoods['/'] ?? 'entry'
  const isDarkTheme = ['dark', 'cosmic', 'wine', 'coffee'].includes(themeName)
  const isHomePage = location.pathname === ROUTES.HOME

  usePageTransition(mainRef, location.pathname, mood)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (window.sessionStorage.getItem('lyu-world-opened')) {
      return
    }

    window.sessionStorage.setItem('lyu-world-opened', 'true')
    playWorldTransition({
      mood,
      title: 'Lyu World',
      subtitle: t('brand.subtitle'),
    })
  }, [mood, playWorldTransition, t])

  const handleNavigate = (path: string, labelKey: string) => {
    const targetMood = routeMoods[path] ?? mood

    playWorldTransition({
      mood: targetMood,
      title: path === location.pathname ? t('actions.reenterWorld') : t(labelKey),
      subtitle: path === location.pathname ? t('brand.subtitle') : t('labels.worldShift'),
      action:
        path === location.pathname
          ? () => window.scrollTo({ top: 0, behavior: 'auto' })
          : () => {
              navigate(path)
              setMenuOpen(false)
            },
    })
  }

  return (
    <Background background={background}>
      <div
        className={styles.shell}
        data-world-mood={mood}
        data-theme-name={themeName}
        data-theme-scheme={isDarkTheme ? 'dark' : 'light'}
        data-home-page={isHomePage ? 'true' : 'false'}
      >
        <div className={styles.atmosphereLayer}>
          <WorldAtmosphere mood={mood} pageKey={location.pathname} />
        </div>
        <div className={styles.frame} />

        {isHomePage ? null : (
          <div className={styles.floatingBeacon}>
            <ReentryBeacon
              onActivate={() =>
                playWorldTransition({
                  mood: 'entry',
                  title: t('actions.reenterWorld'),
                  subtitle: t('brand.subtitle'),
                  action: () => {
                    if (location.pathname !== '/') {
                      navigate('/')
                      return
                    }

                    window.scrollTo({ top: 0, behavior: 'auto' })
                  },
                })
              }
            />
          </div>
        )}

        <header className={styles.header}>
          <NavLink to="/" className={styles.brand}>
            <span className={styles.brandMark}>
              <WorldMark />
            </span>
            <span className={styles.brandCopy}>
              <strong>Lyu World</strong>
            </span>
          </NavLink>

          <nav className={styles.nav} aria-label="Primary">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                type="button"
                className={`${styles.navLink} ${
                  location.pathname === item.path ? styles.activeLink : ''
                }`}
                onClick={() => handleNavigate(item.path, item.labelKey)}
              >
                {t(item.labelKey)}
              </button>
            ))}
          </nav>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-label={t('accessibility.toggleNavigation')}
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        {menuOpen ? (
          <div className={styles.mobileMenu}>
            {navigationItems.map((item) => (
              <button
                key={item.path}
                className={`${styles.mobileLink} ${
                  location.pathname === item.path ? styles.mobileActive : ''
                }`}
                type="button"
                onClick={() => handleNavigate(item.path, item.labelKey)}
              >
                {t(item.labelKey)}
              </button>
            ))}
          </div>
        ) : null}

        <main ref={mainRef} className={styles.main}>
          <Outlet />
        </main>

        {isHomePage ? null : (
          <footer className={styles.footer}>
            <div className={styles.footerInner}>
              <SectionDivider />
              <div className={styles.footerTop}>
                <div>
                  <p className={styles.footerEyebrow}>{t('labels.worldMap')}</p>
                  <h2 className={styles.footerTitle}>{t('footer.title')}</h2>
                  <div className={styles.pillarGrid}>
                    {worldPillars.slice(0, 4).map((pillar) => (
                      <NavLink key={pillar.id} to={pillar.path} className={styles.pillarCard}>
                        <pillar.icon size={18} />
                        <strong>{t(`home:pillars.${pillar.id}.title`)}</strong>
                        <span>{t(`home:pillars.${pillar.id}.description`)}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
                <div className={styles.footerSignal}>
                  <p className={styles.footerEyebrow}>{t('labels.worldTone')}</p>
                  <h3 className={styles.footerSignalTitle}>{t('footer.signalTitle')}</h3>
                  <p className={styles.footerSignalText}>{t('footer.signalDescription')}</p>
                </div>
              </div>
              <div className={styles.footerBottom}>
                <p>{t('footer.description')}</p>
                <div className={styles.footerLinks}>
                  {socialLinks.map((link) => (
                    <a
                      key={link.labelKey}
                      href={link.href}
                      className={styles.footerLink}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                    >
                      {t(link.labelKey)}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </Background>
  )
}

export { SiteLayout }
