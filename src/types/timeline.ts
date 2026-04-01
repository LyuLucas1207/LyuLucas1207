import type { I18nStruct, I18nText } from './info'

export type TimelineApiItem = {
  id: string
  period: I18nText
  title: I18nText
  company: I18nText
  summary: I18nText
  achievements: I18nStruct<string[]>
}

export type TimelineItem = {
  id: string
  period: string
  title: string
  company: string
  summary: string
  achievements: string[]
}
