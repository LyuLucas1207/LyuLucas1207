import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import contactEn from '../locales/en/contact.json'
import commonEn from '../locales/en/common.json'
import highlightsEn from '../locales/en/highlights.json'
import homeEn from '../locales/en/home.json'
import lifeEn from '../locales/en/life.json'
import projectsEn from '../locales/en/projects.json'
import aboutEn from '../locales/en/about.json'
import contactZh from '../locales/zh/contact.json'
import commonZh from '../locales/zh/common.json'
import highlightsZh from '../locales/zh/highlights.json'
import homeZh from '../locales/zh/home.json'
import lifeZh from '../locales/zh/life.json'
import projectsZh from '../locales/zh/projects.json'
import aboutZh from '../locales/zh/about.json'

const resources = {
  en: {
    common: commonEn,
    home: homeEn,
    about: aboutEn,
    projects: projectsEn,
    life: lifeEn,
    highlights: highlightsEn,
    contact: contactEn,
  },
  zh: {
    common: commonZh,
    home: homeZh,
    about: aboutZh,
    projects: projectsZh,
    life: lifeZh,
    highlights: highlightsZh,
    contact: contactZh,
  },
} as const

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    supportedLngs: ['zh', 'en'],
    defaultNS: 'common',
    ns: ['common', 'home', 'about', 'projects', 'life', 'highlights', 'contact'],
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

document.documentElement.lang = i18n.resolvedLanguage ?? 'zh'

export { i18n }
