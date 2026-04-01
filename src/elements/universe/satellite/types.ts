import type { ThemeValue } from '../types'

export type SatelliteConfig = {
  radius: number
  segments: number
  orbitRadius: number
  speed: number
  color: string
  emissive: ThemeValue
  isLight: boolean
}
