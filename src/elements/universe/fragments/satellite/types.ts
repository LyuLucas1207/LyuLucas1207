import type { GlowOnOff } from '../types'

export interface SatellitePalette {
  /** 卫星表面候选色池 — 随机选取 */
  surfaceColorPool: string[]
}

/** 与 `PlanetSurfaceConfig` 的 PBR 参数一致，便于与行星程序化表面观感对齐 */
export interface SatelliteSurfaceConfig {
  roughness: number
  metalness: number
}

export interface SatelliteConfig {
  radius: number
  segments: number
  orbitRadius: number
  speed: number
  palette: SatellitePalette
  emissive: GlowOnOff
  isLight: boolean
  surface: SatelliteSurfaceConfig
}
