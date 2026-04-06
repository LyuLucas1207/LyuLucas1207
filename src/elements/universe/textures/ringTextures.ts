import * as THREE from 'three'

import type { Ring } from '../fragments/ring'
import { RING_RADIAL_STRIP_URLS } from '../utils/universeAssets'

/** 径向用 Clamp、周向 Repeat（与 UV 里 v 已乘 circumRepeat 配合） */
export function configureRadialStripTexture(t: THREE.Texture) {
  t.wrapS = THREE.ClampToEdgeWrapping
  t.wrapT = THREE.RepeatWrapping
  t.repeat.set(1, 1)
  t.offset.set(0, 0)
  t.colorSpace = THREE.SRGBColorSpace
  t.premultiplyAlpha = false
}

export async function loadRingRadialStripTexture(url: string): Promise<THREE.Texture> {
  const map = await new THREE.TextureLoader().loadAsync(url)
  configureRadialStripTexture(map)
  return map
}

export async function attachRandomRingStripTexture(ring: Ring) {
  const list = RING_RADIAL_STRIP_URLS
  if (list.length === 0) return
  const url = list[Math.floor(Math.random() * list.length)]!
  try {
    const map = await loadRingRadialStripTexture(url)
    ring.applyRadialStripMap(map)
  } catch (err) {
    console.warn('[universe] ring radial strip failed', url, err)
  }
}
