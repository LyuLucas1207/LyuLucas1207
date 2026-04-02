import type { I18nStruct, I18nText } from './info'

export type ContactMethod = {
  label: I18nText
  value: I18nText
  href: string
}

export type MetricApiItem = {
  value: string
  label: I18nText
  detail: I18nText
}

export type MetricItem = {
  value: string
  label: string
  detail: string
}

export type ProfileApi = {
  id: string
  name: I18nText
  worldName: I18nText
  headline: I18nText
  status: I18nText
  location: I18nText
  intro: I18nText
  heroStatement: I18nText
  focusAreas: I18nStruct<string[]>
  metrics: MetricApiItem[]
  worldview: I18nStruct<string[]>
  introPrelude: I18nText
  introBody: I18nStruct<string[]>
  hobbies?: I18nStruct<string[]>
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
  introPrelude: string
  introBody: string[]
  hobbies: string[]
  contactMethods: Array<{
    label: string
    value: string
    href: string
  }>
}
