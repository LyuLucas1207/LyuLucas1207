export interface VortexPalette {
  /** 旋涡粒子候选色池 — 随机选取为每个粒子上色 */
  particleColorPool: string[]
}

export interface VortexShaders {
  vertex: string
  fragment: string
}

export interface VortexConfig {
  denseAtCore: boolean
  coneBaseRadius: number
  particleCount: number
  armCount: number
  baseSize: number
  opacity: number
  palette: VortexPalette
  isLight: boolean
  shaders: VortexShaders
  ifanimate: boolean
  animateOffset: number
}
