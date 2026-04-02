import type { UniverseColorPool } from '../types'

export type StreamShaders = {
  vertex: string
  fragment: string
}

export type StreamConfig = {
  streamCount: number
  baseSize: number
  opacity: { light: number; dark: number }
  colors: UniverseColorPool
  isLight: boolean
  shaders: StreamShaders
  ifanimate: boolean
  animateOffset: number
}
