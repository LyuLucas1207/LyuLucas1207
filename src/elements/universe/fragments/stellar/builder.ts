import type {
  StellarConfig,
  StellarHaloConfig,
  StellarLightConfig,
  StellarPalette,
  StellarShellConfig,
  StellarShellShaders,
  StellarSurfaceConfig,
} from './types'
import type { GlowOnOff } from '../types'

const DEFAULT_PALETTE: StellarPalette = {
  coreColor: '#000000',
  shellColor: '#000000',
  shellFallbackColor: '#000000',
  haloColor: '#000000',
  keyLightColor: '#000000',
  rimLightColor: '#000000',
}

const CORE_STAR_DEFAULTS: StellarConfig = {
  radius: 8,
  segments: 48,
  emissive: { off: 2.8, on: 4.2 },
  palette: DEFAULT_PALETTE,
  isLight: false,
  surface: { roughness: 0.18, metalness: 0.02, clearcoat: 0.72, clearcoatRoughness: 0.16 },
  // Shell/halo opacity no longer changes with `isLight` (glow is handled by additive blending + intensity).
  shell: { radius: 9.8, opacity: { off: 0.34, on: 0.46 }, ifanimate: true },
  halo: { radius: 15.5, opacity: { off: 0.18, on: 0.24 }, ifanimate: true },
  keyLight: { intensity: { off: 26, on: 36 }, distance: 96, position: [10, 7, 14] },
  rimLight: { intensity: { off: 8, on: 14 }, distance: 120, position: [-16, -10, -18] },
  shellShaders: undefined,
}

const SYSTEM_STAR_DEFAULTS: StellarConfig = {
  radius: 3.2,
  segments: 32,
  emissive: { off: 2.4, on: 3.4 },
  palette: DEFAULT_PALETTE,
  isLight: false,
  surface: { roughness: 0.2, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.14 },
  shell: { radius: 5.2, opacity: { off: 0.16, on: 0.22 }, ifanimate: true },
  keyLight: { intensity: { off: 10, on: 14 }, distance: 54, position: [4, 4, 5] },
  halo: undefined,
  rimLight: undefined,
  shellShaders: undefined,
}

export class StellarBuilder {
  private config: StellarConfig

  constructor() {
    this.config = { ...SYSTEM_STAR_DEFAULTS }
  }

  coreStar() {
    this.config = { ...CORE_STAR_DEFAULTS }
    return this
  }

  systemStar() {
    this.config = { ...SYSTEM_STAR_DEFAULTS }
    return this
  }

  palette(value: StellarPalette) {
    this.config.palette = value
    return this
  }

  isLight(value: boolean) {
    this.config.isLight = value
    return this
  }

  radius(value: number) {
    this.config.radius = value
    return this
  }

  segments(value: number) {
    this.config.segments = value
    return this
  }

  emissive(value: GlowOnOff) {
    this.config.emissive = value
    return this
  }

  surface(value: StellarSurfaceConfig) {
    this.config.surface = value
    return this
  }

  shell(value: StellarShellConfig) {
    this.config.shell = value
    return this
  }

  halo(value: StellarHaloConfig) {
    this.config.halo = value
    return this
  }

  keyLight(value: StellarLightConfig) {
    this.config.keyLight = value
    return this
  }

  rimLight(value: StellarLightConfig) {
    this.config.rimLight = value
    return this
  }

  shellShaders(value: StellarShellShaders) {
    this.config.shellShaders = value
    return this
  }

  noHalo() {
    this.config.halo = undefined
    return this
  }

  noRimLight() {
    this.config.rimLight = undefined
    return this
  }

  defaultEmissive() {
    this.config.emissive = CORE_STAR_DEFAULTS.emissive
    return this
  }

  defaultSurface() {
    this.config.surface = CORE_STAR_DEFAULTS.surface
    return this
  }

  defaultShell() {
    this.config.shell = CORE_STAR_DEFAULTS.shell
    return this
  }

  defaultHalo() {
    this.config.halo = CORE_STAR_DEFAULTS.halo
    return this
  }

  defaultKeyLight() {
    this.config.keyLight = CORE_STAR_DEFAULTS.keyLight
    return this
  }

  defaultRimLight() {
    this.config.rimLight = CORE_STAR_DEFAULTS.rimLight!
    return this
  }

  done(): StellarConfig {
    return { ...this.config }
  }
}
