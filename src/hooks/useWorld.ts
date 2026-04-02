import type {
  HighlightApiItem,
  HighlightItem,
  LifeRecord,
  LifeRecordApiItem,
  MetricApiItem,
  MetricItem,
  Profile,
  ProfileApi,
  ProjectApiItem,
  ProjectItem,
  TimelineApiItem,
  TimelineItem,
} from '@/types'
import { getI18nList, getI18nText } from '@/types'
import type { LanguageEnum } from 'nfx-ui/languages'
import { makeUnifiedQuery } from 'nfx-ui/hooks'

import { GetHighlights, GetLifeRecords, GetProfile, GetProjects, GetTimeline } from '@/apis'
import {
  WORLD_HIGHLIGHTS,
  WORLD_LIFE_RECORDS,
  WORLD_PROFILE,
  WORLD_PROJECTS,
  WORLD_TIMELINE,
} from '@/constants'
import { useLocale } from './useLocale'

// ========== Localized helpers ==========

function localizeMetric(item: MetricApiItem, locale: LanguageEnum): MetricItem {
  return { value: item.value, label: getI18nText(item.label, locale), detail: getI18nText(item.detail, locale) }
}

function localizeProfile(data: ProfileApi, locale: LanguageEnum): Profile {
  return {
    id: data.id,
    name: getI18nText(data.name, locale),
    worldName: getI18nText(data.worldName, locale),
    headline: getI18nText(data.headline, locale),
    status: getI18nText(data.status, locale),
    location: getI18nText(data.location, locale),
    intro: getI18nText(data.intro, locale),
    heroStatement: getI18nText(data.heroStatement, locale),
    focusAreas: getI18nList(data.focusAreas, locale),
    metrics: data.metrics.map((m) => localizeMetric(m, locale)),
    worldview: getI18nList(data.worldview, locale),
    introPrelude: getI18nText(data.introPrelude, locale),
    introBody: getI18nList(data.introBody, locale),
    hobbies: getI18nList(data.hobbies, locale),
    contactMethods: data.contactMethods.map((c) => ({
      label: getI18nText(c.label, locale),
      value: getI18nText(c.value, locale),
      href: c.href,
    })),
  }
}

function localizeProject(item: ProjectApiItem, locale: LanguageEnum): ProjectItem {
  return {
    id: item.id,
    slug: item.slug,
    title: getI18nText(item.title, locale),
    category: item.category,
    group: item.group,
    featured: item.featured,
    year: item.year,
    summary: getI18nText(item.summary, locale),
    impact: getI18nText(item.impact, locale),
    role: getI18nText(item.role, locale),
    stack: item.stack,
    accent: item.accent,
    repositoryUrl: item.repositoryUrl,
    liveUrl: item.liveUrl,
    challenge: getI18nText(item.challenge, locale),
    outcome: getI18nText(item.outcome, locale),
    details: getI18nList(item.details, locale),
  }
}

function localizeHighlight(item: HighlightApiItem, locale: LanguageEnum): HighlightItem {
  return {
    id: item.id,
    title: getI18nText(item.title, locale),
    subtitle: getI18nText(item.subtitle, locale),
    description: getI18nText(item.description, locale),
    stat: getI18nText(item.stat, locale),
    icon: item.icon,
  }
}

function localizeTimeline(item: TimelineApiItem, locale: LanguageEnum): TimelineItem {
  return {
    id: item.id,
    period: getI18nText(item.period, locale),
    title: getI18nText(item.title, locale),
    company: getI18nText(item.company, locale),
    summary: getI18nText(item.summary, locale),
    achievements: getI18nList(item.achievements, locale),
  }
}

function localizeLifeRecord(item: LifeRecordApiItem, locale: LanguageEnum): LifeRecord {
  return {
    id: item.id,
    title: getI18nText(item.title, locale),
    type: item.type,
    date: item.date,
    place: getI18nText(item.place, locale),
    mood: getI18nText(item.mood, locale),
    excerpt: getI18nText(item.excerpt, locale),
    body: getI18nText(item.body, locale),
    tags: getI18nList(item.tags, locale),
  }
}

// ========== Query hooks ==========

export const useProfileQuery = () => {
  const locale = useLocale()
  const makeQuery = makeUnifiedQuery<Profile>(
    async () => localizeProfile(await GetProfile(), locale),
  )
  return makeQuery(WORLD_PROFILE(locale))
}

export const useProjectsQuery = () => {
  const locale = useLocale()
  const makeQuery = makeUnifiedQuery<ProjectItem[]>(
    async () => (await GetProjects()).map((item) => localizeProject(item, locale)),
  )
  return makeQuery(WORLD_PROJECTS(locale))
}

export const useHighlightsQuery = () => {
  const locale = useLocale()
  const makeQuery = makeUnifiedQuery<HighlightItem[]>(
    async () => (await GetHighlights()).map((item) => localizeHighlight(item, locale)),
  )
  return makeQuery(WORLD_HIGHLIGHTS(locale))
}

export const useTimelineQuery = () => {
  const locale = useLocale()
  const makeQuery = makeUnifiedQuery<TimelineItem[]>(
    async () => (await GetTimeline()).map((item) => localizeTimeline(item, locale)),
  )
  return makeQuery(WORLD_TIMELINE(locale))
}

export const useLifeRecordsQuery = () => {
  const locale = useLocale()
  const makeQuery = makeUnifiedQuery<LifeRecord[]>(
    async () => (await GetLifeRecords()).map((item) => localizeLifeRecord(item, locale)),
  )
  return makeQuery(WORLD_LIFE_RECORDS(locale))
}
