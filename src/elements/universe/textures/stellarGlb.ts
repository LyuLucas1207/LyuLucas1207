import type { Stellar } from '../fragments/stellar'

import { loadGltfRoot, scaleAndCenterModelToRadius } from '../utils/loadGltf'
import { STELLAR_GLB_URLS } from '../utils/universeAssets'

export async function attachRandomSystemStellarGlb(stellar: Stellar) {
  const list = STELLAR_GLB_URLS
  if (list.length === 0) return
  const url = list[Math.floor(Math.random() * list.length)]!
  try {
    const template = await loadGltfRoot(url)
    const root = template.clone(true)
    scaleAndCenterModelToRadius(root, stellar.coreTargetRadius)
    stellar.attachGlbCore(root)
  } catch (err) {
    console.warn('[universe] stellar GLB failed', url, err)
  }
}
