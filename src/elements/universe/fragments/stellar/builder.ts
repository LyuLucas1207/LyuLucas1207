import { deepClone } from '@/utils'
import type {
  StellarConfig,
  StellarCoreHoverConfig,
  StellarFocusCameraConfig,
  StellarHaloConfig,
  StellarLightConfig,
  StellarPalette,
  StellarShellConfig,
  StellarShellShaders,
  StellarSurfaceConfig,
} from './types'
import type { Nilable } from 'nfx-ui/types'
import type { GlowOnOff } from '../types'

const DEFAULT_PALETTE: StellarPalette = {
  coreColor: '#000000',
  shellColor: '#000000',
  shellFallbackColor: '#000000',
  haloColor: '#000000',
  keyLightColor: '#000000',
  rimLightColor: '#000000',
}

/** 与历史 `UNIVERSE_SYSTEM_FOCUS` / `UNIVERSE_MOTION` 对齐的默认跟焦参数（仅 builder 持有，fragment 只读 config） */
const DEFAULT_STELLAR_FOCUS_CAMERA: StellarFocusCameraConfig = {
  fov: 68,
  near: 0.1,
  far: 2800,
  heightOffset: 36,
  distanceZFactor: 2.80,
  positionLerp: 0.08,
  yawLerp: 0.08,
  pitchLerp: 0.08,
  maxPitch: 1.45,
  orbitPitchLimit: 0.95,
}

const DEFAULT_STELLAR_CORE_HOVER: StellarCoreHoverConfig = {
  systemName: '',
  label: '',
  baseScale: 1,
  hovered: false,
}

const CORE_STAR_DEFAULTS: StellarConfig = {
  radius: 8,
  segments: 48,
  coreSpinSpeed: 0.14,
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
  coreHover: DEFAULT_STELLAR_CORE_HOVER,
  focusCamera: DEFAULT_STELLAR_FOCUS_CAMERA,
}

const SYSTEM_STAR_DEFAULTS: StellarConfig = {
  radius: 3.2,
  segments: 32,
  coreSpinSpeed: 0.52,
  emissive: { off: 3.6, on: 5.2 },
  palette: DEFAULT_PALETTE,
  isLight: false,
  surface: { roughness: 0.2, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.14 },
  shell: undefined,
  keyLight: { intensity: { off: 22, on: 32 }, distance: 72, position: [4, 4, 5] },
  halo: undefined,
  rimLight: undefined,
  shellShaders: undefined,
  coreHover: DEFAULT_STELLAR_CORE_HOVER,
  focusCamera: DEFAULT_STELLAR_FOCUS_CAMERA,
}

export class StellarBuilder {
  private config: StellarConfig

  constructor() {
    this.config = deepClone(SYSTEM_STAR_DEFAULTS)
  }

  coreStar() {
    this.config = deepClone(CORE_STAR_DEFAULTS)
    return this
  }

  systemStar() {
    this.config = deepClone(SYSTEM_STAR_DEFAULTS)
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

  coreSpinSpeed(value: number) {
    this.config.coreSpinSpeed = value
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

  shell(value: Nilable<StellarShellConfig>) {
    this.config.shell = value
    return this
  }

  halo(value: Nilable<StellarHaloConfig>) {
    this.config.halo = value
    return this
  }

  keyLight(value: StellarLightConfig) {
    this.config.keyLight = value
    return this
  }

  rimLight(value: Nilable<StellarLightConfig>) {
    this.config.rimLight = value
    return this
  }

  shellShaders(value: Nilable<StellarShellShaders>) {
    this.config.shellShaders = value
    return this
  }

  coreHover(value: Nilable<StellarCoreHoverConfig>) {
    this.config.coreHover = value
    return this
  }

  focusCamera(value: StellarFocusCameraConfig) {
    this.config.focusCamera = value
    return this
  }

  noHalo() {
    this.config.halo = undefined
    return this
  }

  noShell() {
    this.config.shell = undefined
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
    return deepClone(this.config)
  }
}
