import type { Nullable } from 'nfx-ui/types'

const UNIVERSE_SHADERS = {
  starfield: {
    vertex: '/shaders/starfield.vert.glsl',
    fragment: '/shaders/starfield.frag.glsl',
  },
  coreShell: {
    vertex: '/shaders/coreShell.vert.glsl',
    fragment: '/shaders/coreShell.frag.glsl',
  },
}

export type UniverseShaders = {
  starfieldVertex: string
  starfieldFragment: string
  coreShellVertex: string
  coreShellFragment: string
}

let cached: Nullable<UniverseShaders> = null

async function fetchGlsl(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load shader: ${url}`)
  return res.text()
}

export async function loadUniverseShaders(): Promise<UniverseShaders> {
  if (cached) return cached

  const [starfieldVertex, starfieldFragment, coreShellVertex, coreShellFragment] =
    await Promise.all([
      fetchGlsl(UNIVERSE_SHADERS.starfield.vertex), 
      fetchGlsl(UNIVERSE_SHADERS.starfield.fragment),
      fetchGlsl(UNIVERSE_SHADERS.coreShell.vertex),
      fetchGlsl(UNIVERSE_SHADERS.coreShell.fragment),
    ])

  cached = { starfieldVertex, starfieldFragment, coreShellVertex, coreShellFragment }
  return cached
}
