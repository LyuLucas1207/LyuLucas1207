import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { LANGUAGE_VALUES, LanguageEnum } from 'nfx-ui/languages'

import { NAME_SPACES, RESOURCES } from './i18nResources'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: RESOURCES,
    lng: LanguageEnum.ZH,
    fallbackLng: LanguageEnum.ZH,
    supportedLngs: LANGUAGE_VALUES,
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    defaultNS: 'common',
    ns: NAME_SPACES,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
})

document.documentElement.lang = i18n.resolvedLanguage ?? LanguageEnum.ZH

export { i18n }
