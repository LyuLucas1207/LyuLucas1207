import type { LanguageEnum } from 'nfx-ui/languages'

export const WORLD_PROFILE = (locale: LanguageEnum) => ['world', 'profile', locale] as const
export const WORLD_PROJECTS = (locale: LanguageEnum) => ['world', 'projects', locale] as const
export const WORLD_HIGHLIGHTS = (locale: LanguageEnum) => ['world', 'highlights', locale] as const
export const WORLD_TIMELINE = (locale: LanguageEnum) => ['world', 'timeline', locale] as const
export const WORLD_LIFE_RECORDS = (locale: LanguageEnum) => ['world', 'life-records', locale] as const
export const WORLD_LIFE_TIMELINE = (locale: LanguageEnum) => ['world', 'life-timeline', locale] as const
