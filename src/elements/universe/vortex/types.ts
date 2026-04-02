import type { ThemeValue, UniverseColorPool } from '../types'

export type VortexShaders = {
  vertex: string
  fragment: string
}

export type VortexConfig = {
  particleCount: ThemeValue
  armCount: number
  baseSize: number
  opacity: ThemeValue
  colors: UniverseColorPool
  isLight: boolean
  shaders: VortexShaders
  ifanimate: boolean
  animateOffset: number
}
