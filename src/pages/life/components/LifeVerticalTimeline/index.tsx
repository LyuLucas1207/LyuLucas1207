import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from 'nfx-ui/components'

import { Reveal } from '@/animations'
import { routerEventEmitter } from '@/events/router'
import { useLifeTimelineQuery } from '@/hooks'
import styles from './styles.module.css'

function LifeVerticalTimeline() {
  const { t } = useTranslation(['components', 'LifePage'])
  const { data: entries = [] } = useLifeTimelineQuery()

  return (
    <div className={styles.track} aria-label={t('LifePage:timeline.aria')}>
      <div className={styles.rail} aria-hidden />
      <div className={styles.nodes}>
        {entries.map((entry, index) => {
          const isLeft = entry.side === 'left'
          const card = (
            <article
              className={`${styles.card} ${styles[`kind_${entry.kind}`] ?? ''}`}
              data-life-timeline-card
            >
              <p className={styles.period}>{entry.period}</p>
              <h3 className={styles.title}>{entry.title}</h3>
              <p className={styles.body}>{entry.body}</p>
              {entry.projectSlug ? (
                <Button
                  variant="ghost"
                  className={styles.projectLink}
                  rightIcon={<ArrowUpRight size={14} />}
                  onClick={() =>
                    routerEventEmitter.navigate({ to: `/projects/${entry.projectSlug}` })
                  }
                >
                  {t('LifePage:timeline.openProject')}
                </Button>
              ) : null}
            </article>
          )

          return (
            <Reveal key={entry.id} delay={index * 0.04}>
              <div className={styles.row}>
                <div className={styles.cell} data-side="left">
                  {isLeft ? card : <div className={styles.spacer} />}
                </div>
                <div className={styles.axis}>
                  <span className={styles.dot} />
                </div>
                <div className={styles.cell} data-side="right">
                  {!isLeft ? card : <div className={styles.spacer} />}
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

export { LifeVerticalTimeline }
