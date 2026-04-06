import { ThemeEnum } from 'nfx-ui/themes'

import type { UniversePalette } from './types'

import crimsonDominion from './themes/crimsonDominion'
import deepVoid from './themes/deepVoid'
import dreamBloom from './themes/dreamBloom'
import emeraldExpanse from './themes/emeraldExpanse'
import frostRift from './themes/frostRift'
import mahogany from './themes/mahogany'
import neonAbyss from './themes/neonAbyss'
import rubyNebula from './themes/rubyNebula'
import solarEmpire from './themes/solarEmpire'


export function buildUniversePalette(themeEnum: ThemeEnum): UniversePalette {
  switch (themeEnum) {
    case ThemeEnum.DEFAULT:
      return crimsonDominion
    case ThemeEnum.LIGHT:
      return deepVoid
    case ThemeEnum.CORPORATE:
      return frostRift
    case ThemeEnum.FOREST:
      return emeraldExpanse
    case ThemeEnum.WHEAT:
      return solarEmpire
    case ThemeEnum.DARK:
      return neonAbyss
    case ThemeEnum.COSMIC:
      return dreamBloom
    case ThemeEnum.COFFEE:
      return mahogany
    case ThemeEnum.WINE:
      return rubyNebula
    default:
      return deepVoid
  }
}
