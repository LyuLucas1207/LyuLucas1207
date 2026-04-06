import type { Starship } from '../fragments/starship'

import { loadGltfSceneAndClips } from '../utils/loadGltf'
import { STARSHIP_GLB_URLS } from './universeAssets'

export { STARSHIP_GLB_URLS } from './universeAssets'

/**
 * 与 `attachRandomPlanetGlb` / `attachRandomSystemStellarGlb` 同构：在此模块内从 `STARSHIP_GLB_URLS` 取 URL 并加载；
 * scene 只 `new Starship` + `void attachStarshipGlbRoot(ship, i)`，不传入 URL、不写进 config。
 */
export async function attachStarshipGlbRoot(ship: Starship, shipIndex: number): Promise<void> {
  const list = STARSHIP_GLB_URLS
  if (list.length === 0) return
  const url = list[shipIndex % list.length]!
  const { scene, clips } = await loadGltfSceneAndClips(url)
  ship.attachGlbRoot(scene.clone(true), clips)
}
