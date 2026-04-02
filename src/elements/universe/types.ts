import type {
  LabelPalette,
  NebulaPalette,
  OrbitPalette,
  PlanetPalette,
  RingPalette,
  SatellitePalette,
  StellarPalette,
  StreamPalette,
  VortexPalette,
} from './fragments'

export interface UniversePalette {
  label: LabelPalette
  isLabelLight: boolean
  nebula: NebulaPalette
  isNebulaLight: boolean
  orbit: OrbitPalette
  isOrbitLight: boolean
  planet: PlanetPalette
  isPlanetLight: boolean
  ring: RingPalette
  isRingLight: boolean
  satellite: SatellitePalette
  isSatelliteLight: boolean
  stellar: StellarPalette
  isStellarLight: boolean
  stream: StreamPalette
  isStreamLight: boolean
  vortex: VortexPalette
  isVortexLight: boolean

  /** 场景背景色 — WebGL 清屏色 */
  sceneBg: string
  /** 雾气色 — 远景淡出 */
  sceneFogColor: string
  /** 场景是否浅色主题 */
  sceneIsLight: boolean
  /** 场景主光源色 */
  sceneGlowPrimaryColor: string
  /** 场景辅光源色 */
  sceneGlowAccentColor: string
}
export interface StarSystemPlanetOption {
  id: string
  label: string
  accent?: string
  orbitRadius: number
  planetRadius: number
  orbitSpeed: number
  onSelect: () => void
}

export interface StarSystemConfig {
  id: string
  name: string
  summary: string
  planets: StarSystemPlanetOption[]
}
