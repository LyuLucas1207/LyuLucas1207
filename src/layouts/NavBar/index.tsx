import { Menu } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { navigationItems } from '@/constants/siteContent'
import { WorldMark } from '@/elements/world/components/WorldMark'
import { routerEventEmitter } from '@/events/router'
import { ROUTES } from '@/navigations/routes'
import { playWorldTransition } from '@/stores/transitionStore'
import styles from './styles.module.css'

function NavBar() {
  const location = useLocation()
  const { t } = useTranslation(['components', 'WorldPage'])
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavigate = (path: string, labelKey: string) => {
    if (path === location.pathname) {
      setMenuOpen(false)
      return
    }

    playWorldTransition({
      type: 'page',
      page: path,
      title: t(labelKey),
      subtitle: t('labels.worldShift'),
      action: () => {
        routerEventEmitter.navigate({ to: path })
        setMenuOpen(false)
      },
    })
  }

  const handleBrandWorld = () => {
    if (location.pathname === ROUTES.WORLD) return
    playWorldTransition({
      type: 'page',
      page: ROUTES.WORLD,
      title: t('navigation.world'),
      subtitle: t('labels.worldShift'),
      action: () => routerEventEmitter.navigate({ to: ROUTES.WORLD }),
    })
  }

  return (
    <>
      <header className={styles.header}>
        <button type="button" className={styles.brand} onClick={handleBrandWorld}>
          <span className={styles.brandMark}>
            <WorldMark />
          </span>
          <span className={styles.brandCopy}>
            <strong>{t('brand.title')}</strong>
          </span>
        </button>

        <nav className={styles.nav} aria-label="Primary">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              type="button"
              className={`${styles.navLink} ${location.pathname === item.path ? styles.activeLink : ''}`}
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
              className={`${styles.mobileLink} ${location.pathname === item.path ? styles.mobileActive : ''}`}
              type="button"
              onClick={() => handleNavigate(item.path, item.labelKey)}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </div>
      ) : null}
    </>
  )
}

export { NavBar }
