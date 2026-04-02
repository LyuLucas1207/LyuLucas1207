export interface StreamPalette {
  /** 星流粒子候选色池 — 随机选取为每个粒子上色 */
  particleColorPool: string[]
}

export interface StreamShaders {
  vertex: string
  fragment: string
}

export interface StreamConfig {
  streamCount: number
  baseSize: number
  opacity: number
  palette: StreamPalette
  isLight: boolean
  shaders: StreamShaders
  ifanimate: boolean
  animateOffset: number
}
