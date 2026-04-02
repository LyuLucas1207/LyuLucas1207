import { ThemeEnum, type ColorVariables } from 'nfx-ui/themes'

import type { UniversePalette } from './types'

import deepVoid from './themes/deepVoid'
import dreamBloom from './themes/dreamBloom'
import frostRift from './themes/frostRift'
import neonAbyss from './themes/neonAbyss'
import solarEmpire from './themes/solarEmpire'


export function buildUniversePalette(themeEnum: ThemeEnum, _vars: ColorVariables): UniversePalette {
  // Deterministic mapping (no random).

  switch (themeEnum) {
    case ThemeEnum.DEFAULT:
      return neonAbyss
    case ThemeEnum.LIGHT:
      return dreamBloom
    case ThemeEnum.CORPORATE:
      return frostRift
    case ThemeEnum.FOREST:
      return neonAbyss
    case ThemeEnum.WHEAT:
      return solarEmpire
    case ThemeEnum.DARK:
      return deepVoid
    case ThemeEnum.COSMIC:
      return dreamBloom
    case ThemeEnum.COFFEE:
      return frostRift
    case ThemeEnum.WINE:
      return neonAbyss
    default:
      return deepVoid
  }
}
