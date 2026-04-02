export interface StreamPalette {
  /** 星流粒子候选色池 — 随机选取为每个粒子上色 */
  particleColorPool: string[]
}

export interface StreamShaders {
  vertex: string
  fragment: string
}

export interface StreamConfig {
  /** 每条星流路径上的粒子数；未设置时按 isLight 使用 260 / 220（与原先写死逻辑一致） */
  particleCount: number
  streamCount: number
  baseSize: number
  opacity: number
  palette: StreamPalette
  isLight: boolean
  shaders: StreamShaders
  ifanimate: boolean
  animateOffset: number
}
