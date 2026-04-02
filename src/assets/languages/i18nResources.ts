import { createI18nResources, getDefaultNfxBundles } from 'nfx-ui/languages'

import commonEn from './en/common.json'
import contactEn from './en/contact.json'
import highlightsEn from './en/highlights.json'
import homeEn from './en/home.json'
import introEn from './en/intro.json'
import lifeEn from './en/life.json'
import projectsEn from './en/projects.json'
import commonFr from './fr/common.json'
import contactFr from './fr/contact.json'
import highlightsFr from './fr/highlights.json'
import homeFr from './fr/home.json'
import introFr from './fr/intro.json'
import lifeFr from './fr/life.json'
import projectsFr from './fr/projects.json'
import commonZh from './zh/common.json'
import contactZh from './zh/contact.json'
import highlightsZh from './zh/highlights.json'
import homeZh from './zh/home.json'
import introZh from './zh/intro.json'
import lifeZh from './zh/life.json'
import projectsZh from './zh/projects.json'

const APP_NAME_SPACES_MAP = {
  common: 'common',
  home: 'home',
  intro: 'intro',
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
    intro: introEn,
    projects: projectsEn,
    life: lifeEn,
    highlights: highlightsEn,
    contact: contactEn,
  },
  zh: {
    common: commonZh,
    home: homeZh,
    intro: introZh,
    projects: projectsZh,
    life: lifeZh,
    highlights: highlightsZh,
    contact: contactZh,
  },
  fr: {
    common: commonFr,
    home: homeFr,
    intro: introFr,
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
