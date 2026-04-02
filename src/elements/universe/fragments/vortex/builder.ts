import type { VortexConfig, VortexPalette, VortexShaders } from './types'

const DEFAULT_PALETTE: VortexPalette = {
  particleColorPool: [],
}

const DEFAULTS: VortexConfig = {
  denseAtCore: true,
  coneBaseRadius: 12,
  particleCount: 5050,
  armCount: 5,
  baseSize: 450,
  opacity: 0.82,
  palette: DEFAULT_PALETTE,
  isLight: false,
  shaders: { vertex: '', fragment: '' },
  ifanimate: true,
  animateOffset: 1.2,
}

export class VortexBuilder {
  private config: VortexConfig

  constructor() {
    this.config = { ...DEFAULTS }
  }

  denseAtCore(value: boolean) {
    this.config.denseAtCore = value
    return this
  }

  coneBaseRadius(value: number) {
    this.config.coneBaseRadius = value
    return this
  }

  particleCount(value: number) {
    this.config.particleCount = value
    return this
  }

  armCount(value: number) {
    this.config.armCount = value
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

  palette(value: VortexPalette) {
    this.config.palette = value
    return this
  }

  isLight(value: boolean) {
    this.config.isLight = value
    return this
  }

  shaders(value: VortexShaders) {
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

  done(): VortexConfig {
    return { ...this.config }
  }
}
