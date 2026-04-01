import type { ProjectItem } from '../types/site'

export function getProjectBySlug(projects: ProjectItem[], slug: string) {
  return projects.find((project) => project.slug === slug)
}
