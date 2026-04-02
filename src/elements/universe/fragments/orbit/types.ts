export interface OrbitPalette {
  /** 轨道环候选色池 — 随机选取 */
  colorPool: string[]
}

export interface OrbitConfig {
  radius: number
  palette: OrbitPalette
  isLight: boolean
}
