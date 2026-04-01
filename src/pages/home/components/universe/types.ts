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
