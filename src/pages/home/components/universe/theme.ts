import { buildColorPool, luminance, toRgba } from './color'
import type { UniversePalette } from './types'

function readThemeVar(name: string, fallback: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}

export function readUniversePalette(): UniversePalette {
  const bg = readThemeVar('--color-bg', '#ffffff')
  const bg2 = readThemeVar('--color-bg-2', '#f8fafc')
  const bg3 = readThemeVar('--color-bg-3', '#eef2f7')
  const primary = readThemeVar('--color-primary', '#dc2626')
  const primaryHover = readThemeVar('--color-primary-hover', primary)
  const primaryLight = readThemeVar('--color-primary-light', primary)
  const primaryTransparent = readThemeVar('--color-primary-transparent', toRgba(primary, 0.2, primary))
  const fgHighlight = readThemeVar('--color-fg-highlight', primaryLight)
  const fgHeading = readThemeVar('--color-fg-heading', '#0f172a')
  const border2 = readThemeVar('--color-border-2', bg2)
  const overlay = readThemeVar('--color-overlay', toRgba(bg, 0.68, bg))

  return {
    bg,
    bg2,
    bg3,
    primary,
    primaryHover,
    primaryLight,
    primaryTransparent,
    fgHighlight,
    fgHeading,
    border2,
    overlay,
    isLight: luminance(bg) > 0.42,
  }
}

export function createUniverseColors(palette: UniversePalette) {
  return buildColorPool(palette.primary, palette.primaryHover, palette.primaryLight)
}
