import type { GlowOnOff } from '../types'

export interface PlanetPalette {
  /** 行星表面候选色池 — 未指定 accent 时随机选取 */
  surfaceColorPool: string[]
}

export interface PlanetSurfaceConfig {
  roughness: number
  metalness: number
  emissive: GlowOnOff
}

export interface PlanetConfig {
  planetRadius: number
  segments: number
  /** 绕本地 Y 自转角速度，弧度/秒 */
  spinSpeed: number
  palette: PlanetPalette
  isLight: boolean
  surface: PlanetSurfaceConfig
}
