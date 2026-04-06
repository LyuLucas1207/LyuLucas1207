import type { PlanetConfig, PlanetPalette, PlanetSurfaceConfig } from './types'

const DEFAULT_PALETTE: PlanetPalette = {
  surfaceColorPool: ['#ffffff'],
}

const DEFAULTS: PlanetConfig = {
  planetRadius: 1,
  segments: 24,
  spinSpeed: 0.32,
  palette: DEFAULT_PALETTE,
  isLight: false,
  surface: { roughness: 0.34, metalness: 0.12, emissive: { off: 0.6, on: 1.2 } },
}

export class PlanetBuilder {
  private config: PlanetConfig

  constructor() {
    this.config = { ...DEFAULTS }
  }

  planetRadius(value: number) {
    this.config.planetRadius = value
    return this
  }

  segments(value: number) {
    this.config.segments = value
    return this
  }

  spinSpeed(value: number) {
    this.config.spinSpeed = value
    return this
  }

  palette(value: PlanetPalette) {
    this.config.palette = value
    return this
  }

  isLight(value: boolean) {
    this.config.isLight = value
    return this
  }

  surface(value: PlanetSurfaceConfig) {
    this.config.surface = value
    return this
  }

  defaultSurface() {
    this.config.surface = DEFAULTS.surface
    return this
  }

  done(): PlanetConfig {
    return { ...this.config }
  }
}
