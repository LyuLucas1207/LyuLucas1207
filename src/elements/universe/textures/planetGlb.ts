import type { PlanetRuntime } from '../fragments/planet'

import { safeNum, safeOr } from 'nfx-ui/utils'
import { loadGltfRoot, scaleAndCenterModelToRadius } from '../utils/loadGltf'
import { PLANET_GLB_URLS } from '../utils/universeAssets'

export async function attachRandomPlanetGlb(planet: PlanetRuntime) {
  const url = PLANET_GLB_URLS[Math.floor(Math.random() * PLANET_GLB_URLS.length)]!
  const raw = planet.mesh.userData.planetRadius
  const targetR = safeOr(safeNum(typeof raw === 'number' ? raw : undefined), 1)
  try {
    const template = await loadGltfRoot(url)
    const root = template.clone(true)
    scaleAndCenterModelToRadius(root, targetR)
    planet.planet.attachGlbRoot(root)
  } catch (err) {
    console.warn('[universe] planet GLB failed', url, err)
  }
}
