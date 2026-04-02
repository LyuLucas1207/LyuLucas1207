import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { socialLinks, worldPillars } from '@/constants/siteContent'
import { SectionDivider } from '@/components'
import styles from './styles.module.css'

function Footer() {
  const { t } = useTranslation(['shell', 'world'])

  return (
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
                  <strong>{t(`world:pillars.${pillar.id}.title`)}</strong>
                  <span>{t(`world:pillars.${pillar.id}.description`)}</span>
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
  )
}

export { Footer }
