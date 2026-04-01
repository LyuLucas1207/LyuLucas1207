import type { ThemeValue, UniversePalette } from '../types'

export type PlanetSurfaceConfig = {
  roughness: number
  metalness: number
  emissive: ThemeValue
}

export type PlanetConfig = {
  planetRadius: number
  segments: number
  color: string
  palette: UniversePalette
  surface: PlanetSurfaceConfig
}
