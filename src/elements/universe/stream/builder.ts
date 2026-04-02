import type { ThemeValue, UniverseColorPool } from '../types'
import type { StreamConfig, StreamShaders } from './types'

const DEFAULT_COLORS: UniverseColorPool = {
  primary: [],
  hover: [],
  light: [],
  all: [],
}

const DEFAULTS: StreamConfig = {
  streamCount: 5,
  baseSize: 205,
  opacity: { light: 0.88, dark: 0.6 },
  colors: DEFAULT_COLORS,
  isLight: false,
  shaders: { vertex: '', fragment: '' },
  ifanimate: true,
  animateOffset: 1.6,
}

export class StreamBuilder {
  private config: StreamConfig

  constructor() {
    this.config = { ...DEFAULTS }
  }

  streamCount(value: number) {
    this.config.streamCount = value
    return this
  }

  baseSize(value: number) {
    this.config.baseSize = value
    return this
  }

  opacity(value: ThemeValue) {
    this.config.opacity = value
    return this
  }

  colors(value: UniverseColorPool) {
    this.config.colors = value
    return this
  }

  isLight(value: boolean) {
    this.config.isLight = value
    return this
  }

  shaders(value: StreamShaders) {
    this.config.shaders = value
    return this
  }

  ifanimate(value: boolean) {
    this.config.ifanimate = value
    return this
  }

  animateOffset(value: number) {
    this.config.animateOffset = value
    return this
  }

  done(): StreamConfig {
    return { ...this.config }
  }
}
