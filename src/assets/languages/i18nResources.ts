/**
 * Same layout as Pqttec-Admin: JSON under `en|zh|fr/`, one file per page (PascalCase)
 * or shared `components.json`; this file is the only registry (imports + RESOURCES + NAME_SPACES_MAP).
 */
import { createI18nResources, getDefaultNfxBundles } from 'nfx-ui/languages'

import en_components from './en/components.json'
import en_ContactPage from './en/ContactPage.json'
import en_HighlightsPage from './en/HighlightsPage.json'
import en_IntroPage from './en/IntroPage.json'
import en_LifePage from './en/LifePage.json'
import en_ProjectsPage from './en/ProjectsPage.json'
import en_WorldPage from './en/WorldPage.json'

import fr_components from './fr/components.json'
import fr_ContactPage from './fr/ContactPage.json'
import fr_HighlightsPage from './fr/HighlightsPage.json'
import fr_IntroPage from './fr/IntroPage.json'
import fr_LifePage from './fr/LifePage.json'
import fr_ProjectsPage from './fr/ProjectsPage.json'
import fr_WorldPage from './fr/WorldPage.json'

import zh_components from './zh/components.json'
import zh_ContactPage from './zh/ContactPage.json'
import zh_HighlightsPage from './zh/HighlightsPage.json'
import zh_IntroPage from './zh/IntroPage.json'
import zh_LifePage from './zh/LifePage.json'
import zh_ProjectsPage from './zh/ProjectsPage.json'
import zh_WorldPage from './zh/WorldPage.json'

const APP_NAME_SPACES_MAP = {
  components: 'components',
  WorldPage: 'WorldPage',
  IntroPage: 'IntroPage',
  ProjectsPage: 'ProjectsPage',
  LifePage: 'LifePage',
  HighlightsPage: 'HighlightsPage',
  ContactPage: 'ContactPage',
} as const

const defaultNfxBundles = getDefaultNfxBundles()

const appResources = {
  en: {
    components: en_components,
    WorldPage: en_WorldPage,
    IntroPage: en_IntroPage,
    ProjectsPage: en_ProjectsPage,
    LifePage: en_LifePage,
    HighlightsPage: en_HighlightsPage,
    ContactPage: en_ContactPage,
  },
  zh: {
    components: zh_components,
    WorldPage: zh_WorldPage,
    IntroPage: zh_IntroPage,
    ProjectsPage: zh_ProjectsPage,
    LifePage: zh_LifePage,
    HighlightsPage: zh_HighlightsPage,
    ContactPage: zh_ContactPage,
  },
  fr: {
    components: fr_components,
    WorldPage: fr_WorldPage,
    IntroPage: fr_IntroPage,
    ProjectsPage: fr_ProjectsPage,
    LifePage: fr_LifePage,
    HighlightsPage: fr_HighlightsPage,
    ContactPage: fr_ContactPage,
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
