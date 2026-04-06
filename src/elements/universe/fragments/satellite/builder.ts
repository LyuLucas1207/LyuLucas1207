import type { GlowOnOff } from '../types'
import type { SatelliteConfig, SatellitePalette, SatelliteSurfaceConfig } from './types'

const DEFAULT_PALETTE: SatellitePalette = {
  surfaceColorPool: ['#aaaaaa'],
}

const DEFAULTS: SatelliteConfig = {
  radius: 0.18,
  segments: 12,
  orbitRadius: 1.8,
  speed: 0.02,
  palette: DEFAULT_PALETTE,
  /** 暗场景下可见度：`emissiveMap` 与表面贴图同步，此值调节自发光强弱（亦参与点光强度） */
  emissive: { off: 1.35, on: 2.35 },
  isLight: false,
  surface: { roughness: 0.34, metalness: 0 },
}

export class SatelliteBuilder {
  private config: SatelliteConfig

  constructor() {
    this.config = { ...DEFAULTS }
  }

  radius(value: number) {
    this.config.radius = value
    return this
  }

  segments(value: number) {
    this.config.segments = value
    return this
  }

  orbitRadius(value: number) {
    this.config.orbitRadius = value
    return this
  }

  speed(value: number) {
    this.config.speed = value
    return this
  }

  palette(value: SatellitePalette) {
    this.config.palette = value
    return this
  }

  emissive(value: GlowOnOff) {
    this.config.emissive = value
    return this
  }

  isLight(value: boolean) {
    this.config.isLight = value
    return this
  }

  surface(value: SatelliteSurfaceConfig) {
    this.config.surface = value
    return this
  }

  done(): SatelliteConfig {
    return { ...this.config }
  }
}
