import { ChevronDown, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ThemeEnum, useTheme } from 'nfx-ui/themes'

import { useWorldTransition } from '@/hooks/useWorldTransition'
import type { WorldMood } from '@/types/site'
import styles from './styles.module.css'

type WorldToneMenuProps = {
  mood: WorldMood
}

const toneOptions = [
  { value: ThemeEnum.CORPORATE, key: 'corporate' },
  { value: ThemeEnum.FOREST, key: 'forest' },
  { value: ThemeEnum.WINE, key: 'wine' },
  { value: ThemeEnum.COSMIC, key: 'cosmic' },
  { value: ThemeEnum.WHEAT, key: 'wheat' },
] as const

function WorldToneMenu({ mood }: WorldToneMenuProps) {
  const { t } = useTranslation('common')
  const { themeName, setTheme } = useTheme()
  const { playWorldTransition } = useWorldTransition()
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

  const activeTone = useMemo(
    () => toneOptions.find((item) => item.value === themeName) ?? toneOptions[2],
    [themeName],
  )

  return (
    <div ref={ref} className={styles.menu}>
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.open : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className={styles.triggerMeta}>
          <span className={styles.eyebrow}>{t('labels.worldTone')}</span>
          <strong>{t(`worldTones.${activeTone.key}.title`)}</strong>
        </span>
        <span className={styles.triggerIcon}>
          <Sparkles size={14} />
          <ChevronDown size={14} />
        </span>
      </button>

      {open ? (
        <div className={styles.dropdown} role="menu">
          {toneOptions.map((tone) => {
            const active = tone.value === themeName

            return (
              <button
                key={tone.value}
                type="button"
                className={`${styles.option} ${active ? styles.active : ''}`}
                onClick={() => {
                  setOpen(false)

                  if (active) {
                    playWorldTransition({
                      mood,
                      title: t('actions.reenterWorld'),
                      subtitle: t(`worldTones.${tone.key}.description`),
                    })
                    return
                  }

                  playWorldTransition({
                    mood,
                    title: t(`worldTones.${tone.key}.title`),
                    subtitle: t(`worldTones.${tone.key}.description`),
                    action: () => setTheme(tone.value),
                  })
                }}
                role="menuitem"
              >
                <span className={styles.optionTitle}>
                  {t(`worldTones.${tone.key}.title`)}
                </span>
                <span className={styles.optionDescription}>
                  {t(`worldTones.${tone.key}.description`)}
                </span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export { WorldToneMenu }
