import * as THREE from 'three'

import { Satellite } from '../fragments/satellite'
import { SATELLITES_TEXTURE_URLS } from '../utils/universeAssets'

const textureByUrl = new Map<string, Promise<THREE.Texture>>()

function shuffleInPlace<T>(xs: T[]): void {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[xs[i], xs[j]] = [xs[j]!, xs[i]!]
  }
}

/** 为同一行星上的多颗卫星尽量分配不同贴图 URL（池不够大时在洗牌批次中复用） */
export function pickDistinctSatelliteTextureUrls(count: number): string[] {
  const pool = [...SATELLITES_TEXTURE_URLS]
  if (!pool.length || count <= 0) return []
  shuffleInPlace(pool)
  if (count <= pool.length) {
    return pool.slice(0, count)
  }
  const out: string[] = []
  let need = count
  while (need > 0) {
    shuffleInPlace(pool)
    const take = Math.min(pool.length, need)
    out.push(...pool.slice(0, take))
    need -= take
  }
  return out
}

function loadSharedSatelliteTexture(url: string): Promise<THREE.Texture> {
  let p = textureByUrl.get(url)
  if (!p) {
    p = new THREE.TextureLoader().loadAsync(url).then((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
      tex.repeat.set(1, 1)
      tex.offset.set(0, 0)
      tex.generateMipmaps = true
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
      return tex
    })
    textureByUrl.set(url, p)
  }
  return p
}

/** 随机（或指定 URL）加载 **整张球面** 漫反射贴图，不是 texture atlas 图集 */
export async function attachSatelliteSurfaceTexture(satellite: Satellite, textureUrl?: string) {
  const urls = SATELLITES_TEXTURE_URLS
  if (!urls.length) return

  const url =
    textureUrl && urls.includes(textureUrl)
      ? textureUrl
      : urls[Math.floor(Math.random() * urls.length)]!
  try {
    const map = await loadSharedSatelliteTexture(url)
    satellite.applySurfaceMap(map)
  } catch (err) {
    console.warn('[universe] satellite texture failed', url, err)
  }
}
