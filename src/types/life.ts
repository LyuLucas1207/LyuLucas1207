import type { I18nStruct, I18nText } from './info'

export type LifeRecordApiItem = {
  id: string
  title: I18nText
  type: 'note' | 'moment' | 'ritual' | 'snapshot'
  date: string
  place: I18nText
  mood: I18nText
  excerpt: I18nText
  body: I18nText
  tags: I18nStruct<string[]>
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

export type LifeTimelineKind = 'education' | 'project' | 'event' | 'milestone'

export type LifeTimelineApiItem = {
  id: string
  sortDate: string
  side: 'left' | 'right'
  kind: LifeTimelineKind
  title: I18nText
  period: I18nText
  body: I18nText
  projectSlug?: string
}

export type LifeTimelineItem = {
  id: string
  sortDate: string
  side: 'left' | 'right'
  kind: LifeTimelineKind
  title: string
  period: string
  body: string
  projectSlug?: string
}
