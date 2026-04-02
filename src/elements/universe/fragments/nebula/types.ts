export interface NebulaPalette {
  /** 星云候选色池 — 随机选取 */
  colorPool: string[]
}

export interface NebulaConfig {
  palette: NebulaPalette
  isLight: boolean
}
