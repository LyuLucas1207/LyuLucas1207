import type { ColorVariables } from 'nfx-ui/themes'

import { buildColorPool, luminance, toRgba } from './color'
import type { UniversePalette } from './types'

export function buildUniversePalette(vars: ColorVariables): UniversePalette {
  return {
    bg: vars.bg,
    bg2: vars.bg2,
    bg3: vars.bg3,
    primary: vars.primary,
    primaryHover: vars.primaryHover,
    primaryLight: vars.primaryLight,
    primaryTransparent: vars.primaryTransparent,
    fgHighlight: vars.fgHighlight,
    fgHeading: vars.fgHeading,
    border2: vars.border2,
    overlay: vars.overlay || toRgba(vars.bg, 0.68, vars.bg),
    isLight: luminance(vars.bg) > 0.42,
  }
}

export function createUniverseColors(palette: UniversePalette) {
  return buildColorPool(palette.primary, palette.primaryHover, palette.primaryLight)
}
