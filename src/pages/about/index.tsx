import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Reveal } from '@/components/motion'
import { PageIntro } from '@/components/pageIntro'
import { EditorialText } from '@/components/editorialText'
import { TimelineBlock } from '@/elements/portfolio/components/TimelineBlock'
import { EditorialRails } from '@/elements/world/components/EditorialRails'
import { SectionDivider } from '@/elements/world/components/SectionDivider'
import { TimelinePath } from '@/elements/world/components/TimelinePath'
import { useScrollAtmosphere } from '@/elements/world/hooks/useScrollAtmosphere'
import { useLocale } from '@/hooks/useLocale'
import { useProfileQuery, useTimelineQuery } from '@/hooks/useWorldQueries'
import styles from './styles.module.css'

function AboutPage() {
  const { t } = useTranslation(['common', 'about'])
  const locale = useLocale()
  const { data: profile } = useProfileQuery()
  const { data: timeline = [] } = useTimelineQuery()
  const gridRef = useRef<HTMLElement | null>(null)

  useScrollAtmosphere(gridRef, { selector: '[data-about-panel]', mood: 'editorial' })

  return (
    <div className={styles.page}>
      <Reveal>
        <PageIntro
          eyebrow={t('about:intro.eyebrow')}
          title={t('about:intro.titleTemplate', { name: profile?.name ?? 'Lyu Lucas' })}
          description={t('about:intro.description')}
        />
      </Reveal>

      <Reveal delay={0.06}>
        <section className={styles.editorialPanel} data-page-chunk>
          <div className={styles.railWrap}>
            <EditorialRails />
          </div>
          <EditorialText
            text={profile?.aboutPrelude ?? ''}
            className={styles.editorial}
            font={
              locale === 'zh' ? '600 30px "Noto Serif SC"' : '600 34px "Cormorant Garamond"'
            }
            lineHeight={locale === 'zh' ? 50 : 44}
          />
        </section>
      </Reveal>

      <div data-page-chunk>
        <SectionDivider />
      </div>

      <section ref={gridRef} className={styles.grid} data-page-chunk>
        <Reveal delay={0.1}>
          <article className={styles.panel} data-about-panel>
            <p className={styles.kicker}>{t('labels.approach')}</p>
            <h2>{t('about:copy.panelTitle')}</h2>
            {profile?.aboutBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        </Reveal>

        <Reveal delay={0.14}>
          <article className={styles.panel} data-about-panel>
            <p className={styles.kicker}>{t('labels.focusAreas')}</p>
            <div className={styles.pillars}>
              {profile?.focusAreas.map((item) => (
                <span key={item} className={styles.pillar}>
                  {item}
                </span>
              ))}
            </div>
            <div className={styles.worldviewList}>
              {profile?.worldview.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </article>
        </Reveal>
      </section>

      <Reveal delay={0.18}>
        <section className={styles.timelineSection} data-page-chunk>
          <p className={styles.kicker}>{t('labels.experienceArc')}</p>
          <TimelinePath />
          <TimelineBlock items={timeline} />
        </section>
      </Reveal>
    </div>
  )
}

export { AboutPage }
