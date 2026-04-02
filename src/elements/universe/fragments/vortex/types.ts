import type { ValueByTheme } from '../types'

export interface VortexPalette {
  /** 旋涡粒子候选色池 — 随机选取为每个粒子上色 */
  particleColorPool: string[]
}

export interface VortexShaders {
  vertex: string
  fragment: string
}

export interface VortexConfig {
  particleCount: ValueByTheme
  armCount: number
  baseSize: number
  opacity: ValueByTheme
  palette: VortexPalette
  isLight: boolean
  shaders: VortexShaders
  ifanimate: boolean
  animateOffset: number
}
