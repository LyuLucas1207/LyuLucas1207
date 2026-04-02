import { ThemeSwitcher } from 'nfx-ui/components'
import { BaseEnum, ThemeEnum, useTheme } from 'nfx-ui/themes'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.css'

const featuredThemes = [
  { label: 'Wine', value: ThemeEnum.WINE },
  { label: 'Cosmic', value: ThemeEnum.COSMIC },
  { label: 'Corporate', value: ThemeEnum.CORPORATE },
] as const

function ThemeRail() {
  const { themeName, setTheme, baseName, setBase } = useTheme()
  const { t } = useTranslation('components')

  return (
    <aside className={styles.panel}>
      <p className={styles.label}>{t('labels.themeSystem')}</p>
      <ThemeSwitcher
        status="default"
        getThemeDisplayName={(value: string) =>
          featuredThemes.find((theme) => theme.value === value)?.label ?? value
        }
      />
      <div className={styles.quickRow}>
        {featuredThemes.map((theme) => (
          <button
            key={theme.value}
            type="button"
            className={`${styles.quickButton} ${
              themeName === theme.value ? styles.active : ''
            }`}
            onClick={() => setTheme(theme.value)}
          >
            {theme.label}
          </button>
        ))}
      </div>
      <div className={styles.baseRow}>
        <span>{t('labels.base')}:</span>
        <button
          type="button"
          className={`${styles.baseButton} ${
            baseName === BaseEnum.WINDOWS ? styles.active : ''
          }`}
          onClick={() => setBase(BaseEnum.WINDOWS)}
        >
          Windows
        </button>
        <button
          type="button"
          className={`${styles.baseButton} ${
            baseName === BaseEnum.DEFAULT ? styles.active : ''
          }`}
          onClick={() => setBase(BaseEnum.DEFAULT)}
        >
          Default
        </button>
      </div>
    </aside>
  )
}

export { ThemeRail }
