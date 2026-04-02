export interface RingPalette {
  /** 环带候选色池 — 随机选取环的基础色 */
  bandColorPool: string[]
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
