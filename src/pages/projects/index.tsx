import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown, SearchInput } from 'nfx-ui/components'

import { Reveal } from '@/animations'
import { PageIntro } from '@/components/pageIntro'
import { projectGroups } from '@/constants/siteContent'
import { ProjectCard } from '@/elements/portfolio/components/ProjectCard'
import { SectionDivider } from '@/elements/world/components/SectionDivider'
import { SignalDiagram } from '@/elements/world/components/SignalDiagram'
import { useScrollAtmosphere } from '@/elements/world/hooks/useScrollAtmosphere'
import { useProjectsQuery } from '@/hooks/useWorldQueries'
import styles from './styles.module.css'

function ProjectsPage() {
  const { t } = useTranslation(['common', 'projects'])
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

  const featured = projects.filter((project) => project.featured).slice(0, 1)[0]

  useScrollAtmosphere(gridRef, { selector: '[data-project-card]', mood: 'systems' })

  return (
    <div className={styles.page}>
      <Reveal>
        <PageIntro
          eyebrow={t('projects:intro.eyebrow')}
          title={t('projects:intro.title')}
          description={t('projects:intro.description')}
        />
      </Reveal>

      {featured ? (
        <Reveal delay={0.06}>
          <section className={styles.featuredPanel} data-page-chunk>
            <p className={styles.kicker}>{t('labels.featuredArtifact')}</p>
            <div className={styles.featuredLayout}>
              <div>
                <h2>{featured.title}</h2>
                <p>{featured.summary}</p>
              </div>
              <div className={styles.featuredMeta}>
                <span>{t(`projectCategories.${featured.category}`)}</span>
                <strong>{featured.impact}</strong>
              </div>
            </div>
            <div className={styles.diagramWrap}>
              <SignalDiagram />
            </div>
          </section>
        </Reveal>
      ) : null}

      <div data-page-chunk>
        <SectionDivider />
      </div>

      <Reveal delay={0.1}>
        <section className={styles.filters} data-page-chunk>
          <div className={styles.searchWrap}>
            <SearchInput
              placeholder={t('projects:copy.searchPlaceholder')}
              value={query}
              onChange={setQuery}
            />
          </div>
          <div className={styles.dropdownWrap}>
            <Dropdown options={dropdownOptions} value={group} onChange={setGroup} />
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.14}>
        <section ref={gridRef} className={styles.grid} data-page-chunk>
          {filteredProjects.map((project) => (
            <div key={project.slug} data-project-card>
              <ProjectCard project={project} />
            </div>
          ))}
        </section>
      </Reveal>
    </div>
  )
}

export { ProjectsPage }
