import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button } from 'nfx-ui/components'

import { Reveal } from '@/components/motion'
import { accentClassMap } from '@/constants/siteContent'
import { useProjectsQuery } from '@/hooks/useWorldQueries'
import styles from './styles.module.css'

function ProjectDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const { data: projects = [] } = useProjectsQuery()
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  return (
    <article className={styles.page}>
      <Reveal>
        <Button variant="ghost" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/projects')}>
          {t('actions.backToProjects')}
        </Button>
      </Reveal>

      <Reveal delay={0.05}>
        <header className={styles.hero}>
          <p className={styles.meta}>
            {t(`projectCategories.${project.category}`)} / {project.year}
          </p>
          <h1>{project.title}</h1>
          <p className={styles.summary}>{project.summary}</p>
        </header>
      </Reveal>

      <Reveal delay={0.1}>
        <section className={styles.topGrid}>
          <div className={`${styles.caseStudy} ${styles[accentClassMap[project.accent]]}`}>
            <div className={styles.caseCaption}>
              <span>{t('labels.caseStudyPreview')}</span>
              <strong>{project.title}</strong>
            </div>
          </div>
          <div className={styles.detailsPanel}>
            <div>
              <span className={styles.label}>{t('labels.role')}</span>
              <p>{project.role}</p>
            </div>
            <div>
              <span className={styles.label}>{t('labels.impact')}</span>
              <p>{project.impact}</p>
            </div>
            <div>
              <span className={styles.label}>{t('labels.stack')}</span>
              <ul className={styles.stack}>
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.14}>
        <section className={styles.contentGrid}>
          <article className={styles.panel}>
            <span className={styles.label}>{t('labels.challenge')}</span>
            <p>{project.challenge}</p>
          </article>
          <article className={styles.panel}>
            <span className={styles.label}>{t('labels.outcome')}</span>
            <p>{project.outcome}</p>
          </article>
        </section>
      </Reveal>

      <Reveal delay={0.18}>
        <section className={styles.deepDive}>
          <span className={styles.label}>{t('labels.implementationDetails')}</span>
          <ul>
            {project.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </section>
      </Reveal>
    </article>
  )
}

export { ProjectDetailPage }
