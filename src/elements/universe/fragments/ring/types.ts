import type { Texture } from 'three'

export interface RingPalette {
  /** 环带候选色池 — 随机选取环的基础色 */
  bandColorPool: string[]
}

/** jpg albedo + png（bump/alpha）+ r.jpg roughness；UV 由几何侧平面映射决定 */
export interface RingAlbedoMaps {
  map: Texture
  bumpMap: Texture
  alphaMap: Texture
  roughnessMap: Texture
}

export interface RingConfig {
  innerRadius: number
  outerRadius: number
  thickness: number
  ringNumber: number
  gap: number
  gapJitter: number
  randomGap: boolean
  segments: number
  palette: RingPalette
  isLight: boolean
  rotation: [number, number, number]
}
