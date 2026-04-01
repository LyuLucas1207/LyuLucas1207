import { createI18nResources, getDefaultNfxBundles } from 'nfx-ui/languages'

import aboutEn from './en/about.json'
import commonEn from './en/common.json'
import contactEn from './en/contact.json'
import highlightsEn from './en/highlights.json'
import homeEn from './en/home.json'
import lifeEn from './en/life.json'
import projectsEn from './en/projects.json'
import aboutFr from './fr/about.json'
import commonFr from './fr/common.json'
import contactFr from './fr/contact.json'
import highlightsFr from './fr/highlights.json'
import homeFr from './fr/home.json'
import lifeFr from './fr/life.json'
import projectsFr from './fr/projects.json'
import aboutZh from './zh/about.json'
import commonZh from './zh/common.json'
import contactZh from './zh/contact.json'
import highlightsZh from './zh/highlights.json'
import homeZh from './zh/home.json'
import lifeZh from './zh/life.json'
import projectsZh from './zh/projects.json'

const APP_NAME_SPACES_MAP = {
  common: 'common',
  home: 'home',
  about: 'about',
  projects: 'projects',
  life: 'life',
  highlights: 'highlights',
  contact: 'contact',
} as const

const defaultNfxBundles = getDefaultNfxBundles()

const appResources = {
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
  fr: {
    common: commonFr,
    home: homeFr,
    about: aboutFr,
    projects: projectsFr,
    life: lifeFr,
    highlights: highlightsFr,
    contact: contactFr,
  },
} as const

const mergedResources = {
  en: {
    ...defaultNfxBundles.RESOURCES.en,
    ...appResources.en,
  },
  zh: {
    ...defaultNfxBundles.RESOURCES.zh,
    ...appResources.zh,
  },
  fr: {
    ...defaultNfxBundles.RESOURCES.fr,
    ...appResources.fr,
  },
}

const bundles = createI18nResources(mergedResources, {
  ...defaultNfxBundles.NAME_SPACES_MAP,
  ...APP_NAME_SPACES_MAP,
})

export const { RESOURCES, NAME_SPACES, NAME_SPACES_MAP } = bundles
