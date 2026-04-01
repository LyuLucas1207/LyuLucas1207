import type { ThemeValue, UniversePalette } from '../types'
import type { Nilable } from 'nfx-ui/types'


export type StellarLightConfig = {
  intensity: ThemeValue
  distance: number
  position: [number, number, number]
}

export type StellarSurfaceConfig = {
  roughness: number
  metalness: number
  clearcoat: number
  clearcoatRoughness: number
}

export type StellarShellConfig = {
  radius: number
  opacity: ThemeValue
  ifanimate: boolean
}

export type StellarHaloConfig = {
  radius: number
  opacity: ThemeValue
  ifanimate: boolean
}
export type StellarShellShaders = {
  vertex: string
  fragment: string
}
export type StellarConfig = {
  radius: number
  segments: number
  emissive: ThemeValue
  palette: UniversePalette
  surface: StellarSurfaceConfig
  shell: StellarShellConfig
  keyLight: StellarLightConfig
  halo: Nilable<StellarHaloConfig>
  rimLight: Nilable<StellarLightConfig>
  shellShaders: Nilable<StellarShellShaders>
}


