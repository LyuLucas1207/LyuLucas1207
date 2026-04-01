import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Reveal } from '../../components/motion/Reveal'
import { PageIntro } from '../../components/pageIntro/PageIntro'
import { highlightIconMap } from '../../constants/siteContent'
import { TimelineBlock } from '../../elements/portfolio/components/TimelineBlock'
import { SignalDiagram } from '../../elements/world/components/SignalDiagram'
import { TimelinePath } from '../../elements/world/components/TimelinePath'
import { useScrollAtmosphere } from '../../elements/world/hooks/useScrollAtmosphere'
import { useHighlightsQuery, useTimelineQuery } from '../../hooks/useWorldQueries'
import styles from './HighlightsPage.module.css'

function HighlightsPage() {
  const { t } = useTranslation(['common', 'highlights'])
  const { data: highlights = [] } = useHighlightsQuery()
  const { data: timeline = [] } = useTimelineQuery()
  const gridRef = useRef<HTMLDivElement | null>(null)

  useScrollAtmosphere(gridRef, { selector: '[data-highlight-card]', mood: 'trajectory' })

  return (
    <div className={styles.page}>
      <Reveal>
        <PageIntro
          eyebrow={t('highlights:intro.eyebrow')}
          title={t('highlights:intro.title')}
          description={t('highlights:intro.description')}
        />
      </Reveal>

      <section className={styles.band} data-page-chunk>
        <Reveal delay={0.06}>
          <article className={styles.leadPanel}>
            <h2>{t('highlights:copy.leadTitle')}</h2>
            <p>{t('highlights:copy.leadBody')}</p>
            <div className={styles.signalWrap}>
              <SignalDiagram />
            </div>
          </article>
        </Reveal>
        <div ref={gridRef} className={styles.pillarGrid}>
          {highlights.map((item, index) => {
            const Icon = highlightIconMap[item.icon]

            return (
              <Reveal key={item.id} delay={0.1 + index * 0.04}>
                <div className={styles.pillar} data-highlight-card>
                  {Icon ? <Icon size={18} /> : null}
                  <span>{item.stat}</span>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      <Reveal delay={0.2}>
        <section className={styles.timelineSection} data-page-chunk>
          <TimelinePath />
          <TimelineBlock items={timeline} />
        </section>
      </Reveal>
    </div>
  )
}

export { HighlightsPage }
