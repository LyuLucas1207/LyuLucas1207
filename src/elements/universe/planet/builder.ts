import type { PlanetConfig, PlanetSurfaceConfig } from './types'
import type { UniversePalette } from '../types'

const DEFAULT_PALETTE: UniversePalette = {
  bg: '#000000',
  bg2: '#000000',
  bg3: '#000000',
  primary: '#000000',
  primaryHover: '#000000',
  primaryLight: '#000000',
  primaryTransparent: '#000000',
  fgHighlight: '#000000',
  fgHeading: '#000000',
  border2: '#000000',
  overlay: '#000000',
  isLight: false,
}

const DEFAULTS: PlanetConfig = {
  planetRadius: 1,
  segments: 24,
  color: '#ffffff',
  palette: DEFAULT_PALETTE,
  surface: { roughness: 0.34, metalness: 0.12, emissive: { light: 0.6, dark: 1.2 } },
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

  color(value: string) {
    this.config.color = value
    return this
  }

  palette(value: UniversePalette) {
    this.config.palette = value
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
