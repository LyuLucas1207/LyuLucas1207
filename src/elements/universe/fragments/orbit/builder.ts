import type { OrbitConfig, OrbitPalette } from './types'

const DEFAULT_PALETTE: OrbitPalette = {
  colorPool: ['#ffffff'],
}

const DEFAULTS: OrbitConfig = {
  radius: 1,
  palette: DEFAULT_PALETTE,
  isLight: true,
}

export class OrbitBuilder {
  private config: OrbitConfig

  constructor() {
    this.config = { ...DEFAULTS }
  }

  radius(value: number) {
    this.config.radius = value
    return this
  }

  palette(value: OrbitPalette) {
    this.config.palette = value
    return this
  }

  isLight(value: boolean) {
    this.config.isLight = value
    return this
  }

  done(): OrbitConfig {
    return { ...this.config }
  }
}
