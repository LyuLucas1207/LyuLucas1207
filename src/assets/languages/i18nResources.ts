import { createI18nResources, getDefaultNfxBundles } from 'nfx-ui/languages'

import contactEn from './en/contact.json'
import highlightsEn from './en/highlights.json'
import introEn from './en/intro.json'
import lifeEn from './en/life.json'
import projectsEn from './en/projects.json'
import shellEn from './en/shell.json'
import worldEn from './en/world.json'
import contactFr from './fr/contact.json'
import highlightsFr from './fr/highlights.json'
import introFr from './fr/intro.json'
import lifeFr from './fr/life.json'
import projectsFr from './fr/projects.json'
import shellFr from './fr/shell.json'
import worldFr from './fr/world.json'
import contactZh from './zh/contact.json'
import highlightsZh from './zh/highlights.json'
import introZh from './zh/intro.json'
import lifeZh from './zh/life.json'
import projectsZh from './zh/projects.json'
import shellZh from './zh/shell.json'
import worldZh from './zh/world.json'

const APP_NAME_SPACES_MAP = {
  shell: 'shell',
  world: 'world',
  intro: 'intro',
  projects: 'projects',
  life: 'life',
  highlights: 'highlights',
  contact: 'contact',
} as const

const defaultNfxBundles = getDefaultNfxBundles()

const appResources = {
  en: {
    shell: shellEn,
    world: worldEn,
    intro: introEn,
    projects: projectsEn,
    life: lifeEn,
    highlights: highlightsEn,
    contact: contactEn,
  },
  zh: {
    shell: shellZh,
    world: worldZh,
    intro: introZh,
    projects: projectsZh,
    life: lifeZh,
    highlights: highlightsZh,
    contact: contactZh,
  },
  fr: {
    shell: shellFr,
    world: worldFr,
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
