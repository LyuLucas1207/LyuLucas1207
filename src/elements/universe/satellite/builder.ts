import type { ThemeValue } from '../types'
import type { SatelliteConfig } from './types'

const DEFAULTS: SatelliteConfig = {
  radius: 0.18,
  segments: 12,
  orbitRadius: 1.8,
  speed: 0.02,
  color: '#aaaaaa',
  emissive: { light: 0.4, dark: 0.8 },
  isLight: false,
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

  color(value: string) {
    this.config.color = value
    return this
  }

  emissive(value: ThemeValue) {
    this.config.emissive = value
    return this
  }

  isLight(value: boolean) {
    this.config.isLight = value
    return this
  }

  done(): SatelliteConfig {
    return { ...this.config }
  }
}
