import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { changeLanguage, LanguageEnum } from 'nfx-ui/languages'

import { LanguageHalo } from '../LanguageHalo'
import styles from './styles.module.css'

const languages: LanguageEnum[] = [LanguageEnum.ZH, LanguageEnum.EN, LanguageEnum.FR]

function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common')
  const currentLang = i18n.language as LanguageEnum
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
          <strong>{t(`language.${currentLang}`)}</strong>
        </span>
        <ChevronDown size={16} className={styles.chevron} />
      </button>
      {open ? (
        <div className={styles.menu} role="menu">
          {languages.map((language) => (
            <button
              key={language}
              type="button"
              className={`${styles.option} ${currentLang === language ? styles.active : ''}`}
              onClick={() => {
                changeLanguage(language)
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
