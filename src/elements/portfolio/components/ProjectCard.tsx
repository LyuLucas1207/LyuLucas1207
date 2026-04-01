import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from 'nfx-ui/components'

import { accentClassMap } from '../../../constants/siteContent'
import type { ProjectItem } from '../../../types/site'
import styles from './ProjectCard.module.css'

type ProjectCardProps = {
  project: ProjectItem
}

function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate()
  const { t } = useTranslation('common')

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
          onClick={() => navigate(`/projects/${project.slug}`)}
        >
          {t('actions.viewCaseStudy')}
        </Button>
      </div>
    </article>
  )
}

export { ProjectCard }
