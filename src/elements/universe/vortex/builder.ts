import type { UniverseColorPool } from '../types'
import type { ThemeValue } from '../types'
import type { VortexConfig, VortexShaders } from './types'

const DEFAULT_COLORS: UniverseColorPool = {
  primary: [],
  hover: [],
  light: [],
  all: [],
}

const DEFAULTS: VortexConfig = {
  particleCount: { light: 2200, dark: 1900 },
  armCount: 5,
  baseSize: 900,
  opacity: { light: 0.96, dark: 0.82 },
  colors: DEFAULT_COLORS,
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

  particleCount(value: ThemeValue) {
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
