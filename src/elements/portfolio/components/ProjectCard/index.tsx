import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from 'nfx-ui/components'

import { routerEventEmitter } from '@/events/router'
import { accentClassMap } from '@/constants/siteContent'
import type { ProjectItem } from '@/types'
import styles from './styles.module.css'

type ProjectCardProps = {
  project: ProjectItem
}

function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useTranslation('components')

  return (
    <article className={`${styles.card} ${styles[accentClassMap[project.accent]]}`}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.header}>
        <span className={styles.meta}>
          {t(`projectCategories.${project.category}`)} / {project.year}
        </span>
        <span className={styles.impact}>{project.impact}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.summary}>{project.summary}</p>
      </div>
      <ul className={styles.stack}>
        {project.stack.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className={styles.footer}>
        <p className={styles.role}>{project.role}</p>
        <Button
          variant="ghost"
          rightIcon={<ArrowRight size={16} />}
          className={styles.cta}
          onClick={() => routerEventEmitter.navigate({ to: `/projects/${project.slug}` })}
        >
          {t('actions.viewCaseStudy')}
        </Button>
      </div>
    </article>
  )
}

export { ProjectCard }
