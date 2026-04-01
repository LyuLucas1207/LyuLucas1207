import { useTranslation } from 'react-i18next'
import { LANGUAGE_VALUES, LanguageEnum } from 'nfx-ui/languages'

import type { Locale } from '../types/site'

function normalizeLanguage(language: string | undefined): Locale {
  const normalized = (language ?? '').split('-')[0] as LanguageEnum
  return (LANGUAGE_VALUES as string[]).includes(normalized) ? normalized : LanguageEnum.ZH
}

export function useLocale() {
  const { i18n } = useTranslation()

  return normalizeLanguage(i18n.resolvedLanguage ?? i18n.language)
}
