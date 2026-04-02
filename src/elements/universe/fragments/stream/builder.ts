import type { StreamConfig, StreamPalette, StreamShaders } from './types'

const DEFAULT_PALETTE: StreamPalette = {
  particleColorPool: [],
}

const DEFAULTS: StreamConfig = {
  particleCount: 1360,
  streamCount: 5,
  baseSize: 180,
  opacity: 0.62,
  palette: DEFAULT_PALETTE,
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

  particleCount(value: number) {
    this.config.particleCount = value
    return this
  }

  streamCount(value: number) {
    this.config.streamCount = value
    return this
  }

  baseSize(value: number) {
    this.config.baseSize = value
    return this
  }

  opacity(value: number) {
    this.config.opacity = value
    return this
  }

  palette(value: StreamPalette) {
    this.config.palette = value
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
