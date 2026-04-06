import * as THREE from 'three'

import { UNIVERSE_BACKGROUND_Y_RADIANS_PER_SEC } from '../constants'
import { UNIVERSE_BACKGROUND_URLS } from '../utils/universeAssets'

/** 随机选一张等距全景 JPG，赋给 `scene.background`（equirectangular → cubemap 缓存） */
export function attachRandomUniverseTexture(scene: THREE.Scene) {
  const list = UNIVERSE_BACKGROUND_URLS
  if (list.length === 0) return
  const url = list[Math.floor(Math.random() * list.length)]!
  const prev = scene.background
  if (prev instanceof THREE.Texture) prev.dispose()

  new THREE.TextureLoader().load(
    url,
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.mapping = THREE.EquirectangularReflectionMapping
      scene.backgroundRotation.set(0, 0, 0)
      scene.background = tex
    },
    undefined,
    () => console.warn('[universe] texture load failed', url),
  )
}

/**
 * 每帧：绕 **Y 轴** 转 `Scene.background` 对应的全景（`scene.backgroundRotation.y`）。
 * 等距图会先烘成 cubemap，不能靠改 `texture.offset` 转动。
 */
export function spinUniverseTexture(scene: THREE.Scene, deltaSeconds: number, enabled: boolean) {
  if (!enabled || deltaSeconds <= 0) return
  if (!(scene.background instanceof THREE.Texture)) return
  scene.backgroundRotation.y += deltaSeconds * UNIVERSE_BACKGROUND_Y_RADIANS_PER_SEC
}

export function disposeUniverseTexture(scene: THREE.Scene) {
  const bg = scene.background
  if (bg instanceof THREE.Texture) bg.dispose()
  scene.background = null
  scene.backgroundRotation.set(0, 0, 0)
}
