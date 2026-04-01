import { Menu } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from 'nfx-ui/themes'

import {
  navigationItems,
  routeMoods,
  socialLinks,
  worldPillars,
} from '@/constants/siteContent'
import { SectionDivider } from '@/elements/world/components/SectionDivider'
import { WorldAtmosphere } from '@/elements/world/components/WorldAtmosphere'
import { WorldMark } from '@/elements/world/components/WorldMark'
import { usePageTransition } from '@/elements/world/hooks/usePageTransition'
import { useWorldTransition } from '@/providers/WorldTransitionProvider'
import { ROUTES } from '@/navigations/routes'
import styles from './styles.module.css'

function SiteLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation(['common', 'home'])
  const [menuOpen, setMenuOpen] = useState(false)
  const mainRef = useRef<HTMLElement | null>(null)
  const { playWorldTransition } = useWorldTransition()
  const { themeName } = useTheme()
  const mood = routeMoods[location.pathname] ?? routeMoods['/'] ?? 'entry'
  const isDarkTheme = ['dark', 'cosmic', 'wine', 'coffee'].includes(themeName)

  usePageTransition(mainRef, location.pathname, mood)

  const handleNavigate = (path: string, labelKey: string) => {
    if (path === location.pathname) {
      setMenuOpen(false)
      return
    }

    const targetMood = routeMoods[path] ?? mood

    playWorldTransition({
      mood: targetMood,
      title: t(labelKey),
      subtitle: t('labels.worldShift'),
      action: () => {
        navigate(path)
        setMenuOpen(false)
      },
    })
  }

  return (
    <div
      className={styles.shell}
      data-world-mood={mood}
      data-theme-name={themeName}
      data-theme-scheme={isDarkTheme ? 'dark' : 'light'}
    >
        <div className={styles.atmosphereLayer}>
          <WorldAtmosphere mood={mood} pageKey={location.pathname} />
        </div>
        <div className={styles.frame} />

        <header className={styles.header}>
          <NavLink to={ROUTES.HOME} className={styles.brand}>
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
    </div>
  )
}

export { SiteLayout }
