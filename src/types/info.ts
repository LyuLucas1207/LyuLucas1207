import { LanguageEnum } from 'nfx-ui/languages'
import { safeStringable } from 'nfx-ui/utils'
import type { Maybe, Nilable } from 'nfx-ui/types'

export interface I18nStruct<T> {
  zh: T
  en: Maybe<T>
  fr: Maybe<T>
}

export type I18nText = I18nStruct<string>

const FALLBACK_ORDER: LanguageEnum[] = [LanguageEnum.ZH, LanguageEnum.EN, LanguageEnum.FR]

export function getI18nText(
  text: Nilable<I18nText>,
  locale: Maybe<LanguageEnum>,
): string {
  if (text == null || text === undefined) return ''
  const key = (locale && (locale in text) ? locale : null) ?? FALLBACK_ORDER.find((k) => text[k])
  return key ? safeStringable(text[key as keyof I18nStruct<string>]) : ''
}

export function getI18nList(
  list: Nilable<I18nStruct<string[]>>,
  locale: Maybe<LanguageEnum>,
): string[] {
  if (list == null || list === undefined) return []
  const key = (locale && (locale in list) ? locale : null) ?? FALLBACK_ORDER.find((k) => list[k])
  return key ? (list[key as keyof I18nStruct<string[]>]) ?? [] : []
}
