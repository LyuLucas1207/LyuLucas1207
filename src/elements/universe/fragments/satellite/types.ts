import type { GlowOnOff } from '../types'

export interface SatellitePalette {
  /** 卫星表面候选色池 — 随机选取 */
  surfaceColorPool: string[]
}

export interface SatelliteConfig {
  radius: number
  segments: number
  orbitRadius: number
  speed: number
  palette: SatellitePalette
  emissive: GlowOnOff
  isLight: boolean
}
