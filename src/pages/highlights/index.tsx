import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Reveal } from '@/animations'
import { PageIntro } from '@/components'
import { highlightIconMap } from '@/constants/siteContent'
import { TimelineBlock } from '@/elements/portfolio/components/TimelineBlock'
import { SignalDiagram } from '@/elements/world/components/SignalDiagram'
import { TimelinePath } from '@/elements/world/components/TimelinePath'
import { useScrollAtmosphere } from '@/elements/world/hooks/useScrollAtmosphere'
import { useHighlightsQuery, useTimelineQuery } from '@/hooks'
import styles from './styles.module.css'

function HighlightsPage() {
  const { t } = useTranslation(['components', 'HighlightsPage'])
  const { data: highlights = [] } = useHighlightsQuery()
  const { data: timeline = [] } = useTimelineQuery()
  const gridRef = useRef<HTMLDivElement | null>(null)

  useScrollAtmosphere(gridRef, { selector: '[data-highlight-card]' })

  return (
    <div className={styles.page}>
      <Reveal>
        <PageIntro
          eyebrow={t('HighlightsPage:intro.eyebrow')}
          title={t('HighlightsPage:intro.title')}
          description={t('HighlightsPage:intro.description')}
        />
      </Reveal>

      <section className={styles.band}>
        <Reveal delay={0.06}>
          <article className={styles.leadPanel}>
            <h2>{t('HighlightsPage:copy.leadTitle')}</h2>
            <p>{t('HighlightsPage:copy.leadBody')}</p>
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
        <section className={styles.timelineSection}>
          <TimelinePath />
          <TimelineBlock items={timeline} />
        </section>
      </Reveal>
    </div>
  )
}

export { HighlightsPage }
