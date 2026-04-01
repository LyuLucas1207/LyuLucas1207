export type UniversePalette = {
  bg: string
  bg2: string
  bg3: string
  primary: string
  primaryHover: string
  primaryLight: string
  primaryTransparent: string
  fgHighlight: string
  fgHeading: string
  border2: string
  overlay: string
  isLight: boolean
}

export type UniverseColorPool = {
  primary: string[]
  hover: string[]
  light: string[]
  all: string[]
}

export type StarSystemPlanetOption = {
  id: string
  label: string
  accent?: string
  orbitRadius: number
  planetRadius: number
  orbitSpeed: number
  onSelect: () => void
}

export type StarSystemConfig = {
  id: string
  name: string
  summary: string
  planets: StarSystemPlanetOption[]
}

export type VortexGeometryOptions = {
  count: number
  colors: UniverseColorPool
  isLight: boolean
}

export type StreamGeometryOptions = {
  pathIndex: number
  colors: UniverseColorPool
  isLight: boolean
}

export type ThemeValue = { light: number; dark: number }