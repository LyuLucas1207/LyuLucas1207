import { ThemeEnum, type ColorVariables } from 'nfx-ui/themes'

import type { UniversePalette } from './types'

import crimsonDominion from './themes/crimsonDominion'
import deepVoid from './themes/deepVoid'
import dreamBloom from './themes/dreamBloom'
import frostRift from './themes/frostRift'
import neonAbyss from './themes/neonAbyss'
import solarEmpire from './themes/solarEmpire'


export function buildUniversePalette(themeEnum: ThemeEnum, _vars: ColorVariables): UniversePalette {
  // Deterministic mapping (no random).

  switch (themeEnum) {
    case ThemeEnum.DEFAULT:
      return crimsonDominion
    case ThemeEnum.LIGHT:
      return deepVoid
    case ThemeEnum.CORPORATE:
      return neonAbyss
    case ThemeEnum.FOREST:
      return frostRift
    case ThemeEnum.WHEAT:
      return solarEmpire
    case ThemeEnum.DARK:
      return solarEmpire
    case ThemeEnum.COSMIC:
      return dreamBloom
    case ThemeEnum.COFFEE:
      return solarEmpire
    case ThemeEnum.WINE:
      return crimsonDominion
    default:
      return deepVoid
  }
}
