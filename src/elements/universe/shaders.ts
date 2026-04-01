export type UniverseShaders = {
  starfieldVertex: string
  starfieldFragment: string
  coreShellVertex: string
  coreShellFragment: string
}

let cached: UniverseShaders | null = null

async function fetchGlsl(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load shader: ${url}`)
  return res.text()
}

export async function loadUniverseShaders(): Promise<UniverseShaders> {
  if (cached) return cached

  const [starfieldVertex, starfieldFragment, coreShellVertex, coreShellFragment] =
    await Promise.all([
      fetchGlsl('/shaders/starfield.vert.glsl'),
      fetchGlsl('/shaders/starfield.frag.glsl'),
      fetchGlsl('/shaders/coreShell.vert.glsl'),
      fetchGlsl('/shaders/coreShell.frag.glsl'),
    ])

  cached = { starfieldVertex, starfieldFragment, coreShellVertex, coreShellFragment }
  return cached
}
