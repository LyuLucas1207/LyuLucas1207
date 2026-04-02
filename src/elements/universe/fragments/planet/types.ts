import type { ValueByTheme } from '../types'

export interface PlanetPalette {
  /** 行星表面候选色池 — 未指定 accent 时随机选取 */
  surfaceColorPool: string[]
}

export interface PlanetSurfaceConfig {
  roughness: number
  metalness: number
  emissive: ValueByTheme
}

export interface PlanetConfig {
  planetRadius: number
  segments: number
  palette: PlanetPalette
  isLight: boolean
  surface: PlanetSurfaceConfig
}
