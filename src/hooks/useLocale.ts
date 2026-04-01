import { useTranslation } from 'react-i18next'

import type { Locale } from '../types/site'

function normalizeLanguage(language: string | undefined): Locale {
  if (language?.toLowerCase().startsWith('en')) {
    return 'en'
  }

  return 'zh'
}

export function useLocale() {
  const { i18n } = useTranslation()

  return normalizeLanguage(i18n.resolvedLanguage ?? i18n.language)
}
