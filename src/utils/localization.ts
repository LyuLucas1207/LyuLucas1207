import type {
  HighlightApiItem,
  HighlightItem,
  LifeRecord,
  LifeRecordApiItem,
  Locale,
  LocalizedList,
  LocalizedText,
  MetricApiItem,
  MetricItem,
  Profile,
  ProfileApi,
  ProjectApiItem,
  ProjectItem,
  TimelineApiItem,
  TimelineItem,
} from '../types/site'

export function resolveLocalizedText(value: LocalizedText, locale: Locale) {
  return value[locale] ?? value.en ?? value.zh
}

export function resolveLocalizedList(value: LocalizedList, locale: Locale) {
  return value[locale] ?? value.en ?? value.zh
}

function localizeMetric(metric: MetricApiItem, locale: Locale): MetricItem {
  return {
    value: metric.value,
    label: resolveLocalizedText(metric.label, locale),
    detail: resolveLocalizedText(metric.detail, locale),
  }
}

export function localizeProfile(profile: ProfileApi, locale: Locale): Profile {
  return {
    id: profile.id,
    name: resolveLocalizedText(profile.name, locale),
    worldName: resolveLocalizedText(profile.worldName, locale),
    headline: resolveLocalizedText(profile.headline, locale),
    status: resolveLocalizedText(profile.status, locale),
    location: resolveLocalizedText(profile.location, locale),
    intro: resolveLocalizedText(profile.intro, locale),
    heroStatement: resolveLocalizedText(profile.heroStatement, locale),
    focusAreas: resolveLocalizedList(profile.focusAreas, locale),
    metrics: profile.metrics.map((metric) => localizeMetric(metric, locale)),
    worldview: resolveLocalizedList(profile.worldview, locale),
    aboutPrelude: resolveLocalizedText(profile.aboutPrelude, locale),
    aboutBody: resolveLocalizedList(profile.aboutBody, locale),
    contactMethods: profile.contactMethods.map((method) => ({
      label: resolveLocalizedText(method.label, locale),
      value: resolveLocalizedText(method.value, locale),
      href: method.href,
    })),
  }
}

export function localizeProject(project: ProjectApiItem, locale: Locale): ProjectItem {
  return {
    id: project.id,
    slug: project.slug,
    title: resolveLocalizedText(project.title, locale),
    category: project.category,
    group: project.group,
    featured: project.featured,
    year: project.year,
    summary: resolveLocalizedText(project.summary, locale),
    impact: resolveLocalizedText(project.impact, locale),
    role: resolveLocalizedText(project.role, locale),
    stack: project.stack,
    accent: project.accent,
    repositoryUrl: project.repositoryUrl,
    liveUrl: project.liveUrl,
    challenge: resolveLocalizedText(project.challenge, locale),
    outcome: resolveLocalizedText(project.outcome, locale),
    details: resolveLocalizedList(project.details, locale),
  }
}

export function localizeHighlight(item: HighlightApiItem, locale: Locale): HighlightItem {
  return {
    id: item.id,
    title: resolveLocalizedText(item.title, locale),
    subtitle: resolveLocalizedText(item.subtitle, locale),
    description: resolveLocalizedText(item.description, locale),
    stat: resolveLocalizedText(item.stat, locale),
    icon: item.icon,
  }
}

export function localizeTimelineItem(item: TimelineApiItem, locale: Locale): TimelineItem {
  return {
    id: item.id,
    period: resolveLocalizedText(item.period, locale),
    title: resolveLocalizedText(item.title, locale),
    company: resolveLocalizedText(item.company, locale),
    summary: resolveLocalizedText(item.summary, locale),
    achievements: resolveLocalizedList(item.achievements, locale),
  }
}

export function localizeLifeRecord(item: LifeRecordApiItem, locale: Locale): LifeRecord {
  return {
    id: item.id,
    title: resolveLocalizedText(item.title, locale),
    type: item.type,
    date: item.date,
    place: resolveLocalizedText(item.place, locale),
    mood: resolveLocalizedText(item.mood, locale),
    excerpt: resolveLocalizedText(item.excerpt, locale),
    body: resolveLocalizedText(item.body, locale),
    tags: resolveLocalizedList(item.tags, locale),
  }
}
