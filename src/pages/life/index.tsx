import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown } from 'nfx-ui/components'

import { Reveal } from '@/animations'
import { PageIntro } from '@/components/pageIntro'
import { lifeTypes } from '@/constants/siteContent'
import { FragmentField } from '@/elements/world/components/FragmentField'
import { SectionDivider } from '@/elements/world/components/SectionDivider'
import { TimelinePath } from '@/elements/world/components/TimelinePath'
import { useScrollAtmosphere } from '@/elements/world/hooks/useScrollAtmosphere'
import { useLocale } from '@/hooks/useLocale'
import { useLifeRecordsQuery } from '@/hooks/useWorldQueries'
import { formatLongDate } from '@/utils/formatters'
import styles from './styles.module.css'

function LifePage() {
  const { t } = useTranslation(['common', 'life'])
  const locale = useLocale()
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

  useScrollAtmosphere(gridRef, { selector: '[data-life-card]', mood: 'fragments' })

  return (
    <div className={styles.page}>
      <Reveal>
        <PageIntro
          eyebrow={t('life:intro.eyebrow')}
          title={t('life:intro.title')}
          description={t('life:intro.description')}
        />
      </Reveal>

      <Reveal delay={0.06}>
        <section className={styles.controls} data-page-chunk>
          <Dropdown options={dropdownOptions} value={type} onChange={setType} />
        </section>
      </Reveal>

      <div data-page-chunk>
        <SectionDivider />
      </div>

      <div className={styles.pathWrap} data-page-chunk>
        <FragmentField />
        <TimelinePath />
      </div>

      <section ref={gridRef} className={styles.grid} data-page-chunk>
        {filteredRecords.map((record, index) => (
          <Reveal key={record.id} delay={index * 0.04}>
            <article className={styles.card} data-life-card>
              <div className={styles.meta}>
                <span>
                  {t(`lifeTypes.${record.type}`)} / {record.mood}
                </span>
                <strong>{formatLongDate(record.date, locale)}</strong>
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
