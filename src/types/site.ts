export type NavigationItem = {
  labelKey: string
  path: string
}

export type Locale = 'zh' | 'en'

export type WorldMood =
  | 'entry'
  | 'editorial'
  | 'systems'
  | 'fragments'
  | 'trajectory'
  | 'beacon'

export type LocalizedText = Record<Locale, string>

export type LocalizedList = Record<Locale, string[]>

export type ContactMethod = {
  label: LocalizedText
  value: LocalizedText
  href: string
}

export type MetricApiItem = {
  value: string
  label: LocalizedText
  detail: LocalizedText
}

export type MetricItem = {
  value: string
  label: string
  detail: string
}

export type ProfileApi = {
  id: string
  name: LocalizedText
  worldName: LocalizedText
  headline: LocalizedText
  status: LocalizedText
  location: LocalizedText
  intro: LocalizedText
  heroStatement: LocalizedText
  focusAreas: LocalizedList
  metrics: MetricApiItem[]
  worldview: LocalizedList
  aboutPrelude: LocalizedText
  aboutBody: LocalizedList
  contactMethods: ContactMethod[]
}

export type Profile = {
  id: string
  name: string
  worldName: string
  headline: string
  status: string
  location: string
  intro: string
  heroStatement: string
  focusAreas: string[]
  metrics: MetricItem[]
  worldview: string[]
  aboutPrelude: string
  aboutBody: string[]
  contactMethods: Array<{
    label: string
    value: string
    href: string
  }>
}

export type ProjectCategory = 'Platform' | 'Product' | 'Experience'

export type ProjectApiItem = {
  id: string
  slug: string
  title: LocalizedText
  category: ProjectCategory
  group: 'featured' | 'systems' | 'experimental'
  featured: boolean
  year: string
  summary: LocalizedText
  impact: LocalizedText
  role: LocalizedText
  stack: string[]
  accent: 'rose' | 'cosmic' | 'amber' | 'forest'
  repositoryUrl: string
  liveUrl?: string
  challenge: LocalizedText
  outcome: LocalizedText
  details: LocalizedList
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

export type TimelineApiItem = {
  id: string
  period: LocalizedText
  title: LocalizedText
  company: LocalizedText
  summary: LocalizedText
  achievements: LocalizedList
}

export type TimelineItem = {
  id: string
  period: string
  title: string
  company: string
  summary: string
  achievements: string[]
}

export type HighlightApiItem = {
  id: string
  title: LocalizedText
  subtitle: LocalizedText
  description: LocalizedText
  stat: LocalizedText
  icon: string
}

export type HighlightItem = {
  id: string
  title: string
  subtitle: string
  description: string
  stat: string
  icon: string
}

export type LifeRecordApiItem = {
  id: string
  title: LocalizedText
  type: 'note' | 'moment' | 'ritual' | 'snapshot'
  date: string
  place: LocalizedText
  mood: LocalizedText
  excerpt: LocalizedText
  body: LocalizedText
  tags: LocalizedList
}

export type LifeRecord = {
  id: string
  title: string
  type: 'note' | 'moment' | 'ritual' | 'snapshot'
  date: string
  place: string
  mood: string
  excerpt: string
  body: string
  tags: string[]
}
