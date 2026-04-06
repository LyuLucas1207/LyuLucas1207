import type { Nilable } from 'nfx-ui/types'

import { deepClone } from '@/utils'
import type {
  PlanetConfig,
  PlanetFocusCameraConfig,
  PlanetPalette,
  PlanetPickConfig,
  PlanetSurfaceConfig,
} from './types'

const DEFAULT_PALETTE: PlanetPalette = {
  surfaceColorPool: ['#ffffff'],
}

const DEFAULT_PLANET_FOCUS_CAMERA: PlanetFocusCameraConfig = {
  fov: 68,
  near: 0.1,
  far: 2800,
  heightOffset: 26,
  radiusToCameraFactor: 3.45,
  positionLerp: 0.08,
  yawLerp: 0.08,
  pitchLerp: 0.08,
  maxPitch: 1.45,
  orbitPitchLimit: 0.95,
}

const DEFAULT_SURFACE: PlanetSurfaceConfig = {
  roughness: 0.34,
  metalness: 0.12,
  emissive: { off: 0.6, on: 1.2 },
}

const DEFAULTS: PlanetConfig = {
  planetRadius: 1,
  segments: 24,
  spinSpeed: 0.32,
  palette: DEFAULT_PALETTE,
  isLight: false,
  surface: DEFAULT_SURFACE, 
  pick: undefined,
  focusCamera: DEFAULT_PLANET_FOCUS_CAMERA,
}

export class PlanetBuilder {
  private config: PlanetConfig

  constructor() {
    this.config = deepClone(DEFAULTS)
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

  pick(value: Nilable<PlanetPickConfig>) {
    this.config.pick = value
    return this
  }

  focusCamera(value: PlanetFocusCameraConfig) {
    this.config.focusCamera = value
    return this
  }

  defaultSurface() {
    this.config.surface = DEFAULTS.surface
    return this
  }

  done(): PlanetConfig {
    return deepClone(this.config)
  }
}
