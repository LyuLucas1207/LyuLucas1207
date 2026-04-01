import type { I18nStruct, I18nText } from './info'

export type ProjectCategory = 'Platform' | 'Product' | 'Experience'

export type ProjectApiItem = {
  id: string
  slug: string
  title: I18nText
  category: ProjectCategory
  group: 'featured' | 'systems' | 'experimental'
  featured: boolean
  year: string
  summary: I18nText
  impact: I18nText
  role: I18nText
  stack: string[]
  accent: 'rose' | 'cosmic' | 'amber' | 'forest'
  repositoryUrl: string
  liveUrl?: string
  challenge: I18nText
  outcome: I18nText
  details: I18nStruct<string[]>
}

export type ProjectItem = {
  id: string
  slug: string
  title: string
  category: ProjectCategory
  group: 'featured' | 'systems' | 'experimental'
  featured: boolean
  year: string
  summary: string
  impact: string
  role: string
  stack: string[]
  accent: 'rose' | 'cosmic' | 'amber' | 'forest'
  repositoryUrl: string
  liveUrl?: string
  challenge: string
  outcome: string
  details: string[]
}
