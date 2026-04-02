import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'

import { useProfileQuery } from '@/hooks'

import { IntroTypewriter } from './components/IntroTypewriter'

import styles from './styles.module.css'

function IntroPage() {
  const { t } = useTranslation(['intro'])
  const { data: profile } = useProfileQuery()

  const narrative = useMemo(() => {
    const prelude = profile?.introPrelude?.trim() ?? ''
    const extra = (profile?.introBody ?? []).map((p) => p.trim()).filter(Boolean)
    return [prelude, ...extra].filter(Boolean).join('\n\n')
  }, [profile])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{t('intro:hero.eyebrow')}</p>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {t('intro:hero.titleTemplate', { name: profile?.name ?? 'Lucas' })}
        </motion.h1>
      </header>

      <div className={styles.split}>
        <section className={styles.narrative} aria-label={t('intro:hero.eyebrow')}>
          <IntroTypewriter text={narrative} />
        </section>

        <aside className={styles.side}>
          <motion.div
            className={styles.portrait}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          >
            <img
              src="/avatar.png"
              alt={t('intro:meta.avatarAlt')}
              className={styles.avatar}
              width={480}
              height={480}
              decoding="async"
            />
            <div className={styles.portraitFrame} aria-hidden />
          </motion.div>

          {profile?.hobbies?.length ? (
            <div className={styles.hobbyBlock}>
              <p className={styles.hobbyLabel}>{t('intro:side.hobbiesTitle')}</p>
              <ul className={styles.hobbyList}>
                {profile.hobbies.map((item) => (
                  <li key={item} className={styles.hobbyChip}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  )
}

export { IntroPage }
