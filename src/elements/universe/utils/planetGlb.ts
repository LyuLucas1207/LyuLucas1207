import type { PlanetRuntime } from '../fragments/planet'

import { loadGltfRoot, scaleAndCenterModelToRadius } from './loadGltf'
import { PLANET_GLB_URLS } from './universeAssets'

export async function attachRandomPlanetGlb(planet: PlanetRuntime) {
  const url = PLANET_GLB_URLS[Math.floor(Math.random() * PLANET_GLB_URLS.length)]!
  const raw = planet.mesh.userData.planetRadius
  const targetR = typeof raw === 'number' && Number.isFinite(raw) ? raw : 1
  try {
    const template = await loadGltfRoot(url)
    const root = template.clone(true)
    scaleAndCenterModelToRadius(root, targetR)
    planet.planet.attachGlbRoot(root)
  } catch (err) {
    console.warn('[universe] planet GLB failed', url, err)
  }
}
