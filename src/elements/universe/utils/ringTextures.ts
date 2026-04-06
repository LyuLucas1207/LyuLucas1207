import * as THREE from 'three'

import type { Ring } from '../fragments/ring'
import type { RingAlbedoMaps } from '../fragments/ring/types'
import { RING_TEXTURE_BASE_URLS } from './universeAssets'

/** 平面 UV 落在 [0,1]² 内，与 `remapRingGeometryPlanarSheetUVs` 一致 */
function configureRingAlbedoTexture(t: THREE.Texture) {
  t.wrapS = THREE.ClampToEdgeWrapping
  t.wrapT = THREE.ClampToEdgeWrapping
  t.repeat.set(1, 1)
  t.offset.set(0, 0)
  t.colorSpace = THREE.SRGBColorSpace
}

function configureRingDataTexture(t: THREE.Texture) {
  t.wrapS = THREE.ClampToEdgeWrapping
  t.wrapT = THREE.ClampToEdgeWrapping
  t.repeat.set(1, 1)
  t.offset.set(0, 0)
  t.colorSpace = THREE.NoColorSpace
}

/** `texture.jpg` / `.png` / `.r.jpg`，与 albedo 同一套 UV */
export async function loadRingAlbedoMaps(baseUrl: string): Promise<RingAlbedoMaps> {
  const loader = new THREE.TextureLoader()
  const [map, bumpAlpha, roughnessMap] = await Promise.all([
    loader.loadAsync(`${baseUrl}/texture.jpg`),
    loader.loadAsync(`${baseUrl}/texture.png`),
    loader.loadAsync(`${baseUrl}/texture.r.jpg`),
  ])
  configureRingAlbedoTexture(map)
  configureRingDataTexture(bumpAlpha)
  configureRingDataTexture(roughnessMap)
  return {
    map,
    bumpMap: bumpAlpha,
    alphaMap: bumpAlpha,
    roughnessMap,
  }
}

export async function attachRandomRingTextures(ring: Ring) {
  const list = RING_TEXTURE_BASE_URLS
  if (list.length === 0) return
  const n = ring.bandCount
  if (n < 1) return
  try {
    const loads = Array.from({ length: n }, () => {
      const base = list[Math.floor(Math.random() * list.length)]!
      return loadRingAlbedoMaps(base)
    })
    const mapsList = await Promise.all(loads)
    ring.applyAlbedoMapsPerBand(mapsList)
  } catch (err) {
    console.warn('[universe] ring textures failed', err)
  }
}
