import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from 'lucide-react'
import { Dropdown, SearchInput } from 'nfx-ui/components'

import { Reveal } from '@/animations'
import { PageIntro } from '@/components'
import { projectGroups } from '@/constants/siteContent'
import { ProjectCard } from '@/elements/portfolio/components/ProjectCard'
import { SectionDivider } from '@/components'
import { useScrollAtmosphere } from '@/elements/world/hooks/useScrollAtmosphere'
import { useProjectsQuery } from '@/hooks'
import styles from './styles.module.css'

function ProjectsPage() {
  const { t } = useTranslation(['components', 'ProjectsPage'])
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('all')
  const { data: projects = [] } = useProjectsQuery()
  const gridRef = useRef<HTMLElement | null>(null)

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesGroup = group === 'all' || project.group === group
      const haystack =
        `${project.title} ${project.summary} ${project.role} ${project.stack.join(' ')}`.toLowerCase()
      const matchesQuery = haystack.includes(query.toLowerCase())

      return matchesGroup && matchesQuery
    })
  }, [group, projects, query])

  const dropdownOptions = projectGroups.map((value) => ({
    value,
    label: value === 'all' ? t('filters.allProjects') : t(`filters.${value}`),
  }))

  const featured = projects.find((p) => p.featured)
  const indexMap = useMemo(() => {
    const map = new Map<string, number>()
    projects.forEach((p, i) => map.set(p.slug, i + 1))
    return map
  }, [projects])

  useScrollAtmosphere(gridRef, { selector: '[data-project-card]' })

  return (
    <div className={styles.page}>
      <Reveal>
        <PageIntro
          eyebrow={t('ProjectsPage:intro.eyebrow')}
          title={t('ProjectsPage:intro.title')}
          description={t('ProjectsPage:intro.description')}
        />
      </Reveal>

      <Reveal delay={0.05}>
        <p className={styles.resumeNote}>{t('ProjectsPage:copy.resumeOrder')}</p>
      </Reveal>

      {featured ? (
        <Reveal delay={0.08}>
          <section className={styles.featuredBand} aria-labelledby="featured-heading">
            <div className={styles.featuredInner}>
              <div className={styles.featuredCopy}>
                <p className={styles.kicker}>{t('ProjectsPage:copy.featuredKicker')}</p>
                <h2 id="featured-heading">{featured.title}</h2>
                <p className={styles.featuredSummary}>{featured.summary}</p>
                <div className={styles.featuredLinks}>
                  <a
                    className={styles.repoLink}
                    href={featured.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={15} aria-hidden />
                    {t('ProjectsPage:copy.repository')}
                  </a>
                  {featured.liveUrl ? (
                    <a className={styles.repoLink} href={featured.liveUrl} target="_blank" rel="noreferrer">
                      <ExternalLink size={15} aria-hidden />
                      {t('ProjectsPage:copy.relatedLink')}
                    </a>
                  ) : null}
                </div>
              </div>
              <aside className={styles.featuredAside}>
                <span className={styles.monoIndex}>01</span>
                <dl className={styles.metaList}>
                  <div>
                    <dt>{t('labels.role')}</dt>
                    <dd>{featured.role}</dd>
                  </div>
                  <div>
                    <dt>{t('labels.impact')}</dt>
                    <dd>{featured.impact}</dd>
                  </div>
                  <div>
                    <dt>{t(`projectCategories.${featured.category}`)}</dt>
                    <dd>{featured.year}</dd>
                  </div>
                </dl>
              </aside>
            </div>
          </section>
        </Reveal>
      ) : null}

      <SectionDivider />

      <Reveal delay={0.1}>
        <section className={styles.filters} aria-label={t('ProjectsPage:copy.filtersAria')}>
          <div className={styles.searchWrap}>
            <SearchInput
              placeholder={t('ProjectsPage:copy.searchPlaceholder')}
              value={query}
              onChange={setQuery}
            />
          </div>
          <div className={styles.dropdownWrap}>
            <Dropdown options={dropdownOptions} value={group} onChange={setGroup} />
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.12}>
        <p className={styles.resultCount} role="status">
          {t('ProjectsPage:copy.showing', { count: filteredProjects.length, total: projects.length })}
        </p>
      </Reveal>

      <Reveal delay={0.14}>
        <section ref={gridRef} className={styles.grid}>
          {filteredProjects.map((project) => {
            const n = indexMap.get(project.slug)

            return (
              <div key={project.slug} className={styles.cardSlot} data-project-card>
                {n != null ? (
                  <span className={styles.orderBadge} aria-hidden>
                    {String(n).padStart(2, '0')}
                  </span>
                ) : null}
                <ProjectCard project={project} />
              </div>
            )
          })}
        </section>
      </Reveal>

      {filteredProjects.length === 0 ? (
        <p className={styles.empty}>{t('empty.projects')}</p>
      ) : null}
    </div>
  )
}

export { ProjectsPage }
