import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useLocale } from '../../../hooks/useLocale'
import { LanguageHalo } from './LanguageHalo'
import styles from './LanguageSwitcher.module.css'

const languages = ['zh', 'en'] as const

function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common')
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)

    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  return (
    <div ref={ref} className={styles.switcher}>
      <div className={styles.halo}>
        <LanguageHalo />
      </div>
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.open : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className={styles.meta}>
          <span className={styles.label}>{t('language.switcherLabel')}</span>
          <strong>{t(`language.${locale}`)}</strong>
        </span>
        <ChevronDown size={16} className={styles.chevron} />
      </button>
      {open ? (
        <div className={styles.menu} role="menu">
          {languages.map((language) => (
            <button
              key={language}
              type="button"
              className={`${styles.option} ${locale === language ? styles.active : ''}`}
              onClick={() => {
                void i18n.changeLanguage(language)
                setOpen(false)
              }}
              role="menuitem"
            >
              <span>{t(`language.${language}`)}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export { LanguageSwitcher }
