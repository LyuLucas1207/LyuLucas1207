import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown } from 'nfx-ui/components'

import { Reveal } from '@/animations'
import { PageIntro } from '@/components'
import { lifeTypes } from '@/constants/siteContent'
import { FragmentField } from './components/FragmentField'
import { LifeVerticalTimeline } from './components/LifeVerticalTimeline'
import { SectionDivider } from '@/components'
import { TimelinePath } from '@/elements/world/components/TimelinePath'
import { useScrollAtmosphere } from '@/elements/world/hooks/useScrollAtmosphere'
import { useLifeRecordsQuery } from '@/hooks'
import { formatDate } from 'nfx-ui/utils'
import styles from './styles.module.css'

function LifePage() {
  const { t } = useTranslation(['components', 'LifePage'])
  const [type, setType] = useState('all')
  const { data: records = [] } = useLifeRecordsQuery()
  const gridRef = useRef<HTMLElement | null>(null)

  const filteredRecords = useMemo(() => {
    return records.filter((record) => type === 'all' || record.type === type)
  }, [records, type])

  const dropdownOptions = lifeTypes.map((value) => ({
    value,
    label:
      value === 'all'
        ? t('filters.allRecords')
        : t(
            value === 'moment'
              ? 'filters.moments'
              : value === 'snapshot'
                ? 'filters.snapshots'
                : value === 'ritual'
                  ? 'filters.rituals'
                  : 'filters.notes',
          ),
  }))

  useScrollAtmosphere(gridRef, { selector: '[data-life-card]' })

  return (
    <div className={styles.page}>
      <Reveal>
        <PageIntro
          eyebrow={t('LifePage:intro.eyebrow')}
          title={t('LifePage:intro.title')}
          description={t('LifePage:intro.description')}
        />
      </Reveal>

      <Reveal delay={0.06}>
        <section className={styles.controls}>
          <Dropdown options={dropdownOptions} value={type} onChange={setType} />
        </section>
      </Reveal>

      <div>
        <SectionDivider />
      </div>

      <Reveal delay={0.08}>
        <section className={styles.timelineSection}>
          <LifeVerticalTimeline />
        </section>
      </Reveal>

      <div className={styles.pathWrap}>
        <FragmentField />
        <TimelinePath />
      </div>

      <section ref={gridRef} className={styles.grid}>
        {filteredRecords.map((record, index) => (
          <Reveal key={record.id} delay={index * 0.04}>
            <article className={styles.card} data-life-card>
              <div className={styles.meta}>
                <span>
                  {t(`lifeTypes.${record.type}`)} / {record.mood}
                </span>
                <strong>{formatDate(record.date)}</strong>
              </div>
              <h2>{record.title}</h2>
              <p className={styles.excerpt}>{record.excerpt}</p>
              <p className={styles.body}>{record.body}</p>
              <div className={styles.footer}>
                <em>{record.place}</em>
                <div className={styles.tags}>
                  {record.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </div>
  )
}

export { LifePage }
