import { loadGltfRoot, loadGltfSceneAndClips } from './loadGltf'
import { loadUniverseShaders } from './shaders'
import { STARSHIP_GLB_URLS } from '../textures/starshipGlb'
import {
  PLANET_GLB_URLS,
  RING_RADIAL_STRIP_URLS,
  SATELLITES_TEXTURE_URLS,
  STELLAR_GLB_URLS,
  UNIVERSE_BACKGROUND_URLS,
} from '../textures/universeAssets'

/**
 * 在 World 入场全屏过渡期间调用：预热与首页宇宙相关的异步资源（与 scene / attachRandom 使用同一加载器缓存）。
 * 单项失败不拖垮整批（只打日志）。
 */
export async function prefetchWorldEntryAssets(): Promise<void> {
  const warm = (label: string, p: Promise<unknown>) =>
    p.catch((err) => {
      console.warn('[universe] prefetch failed:', label, err)
    })

  const imageUrls = [...UNIVERSE_BACKGROUND_URLS, ...SATELLITES_TEXTURE_URLS, ...RING_RADIAL_STRIP_URLS]

  await Promise.all([
    warm('shaders', loadUniverseShaders()),
    ...STARSHIP_GLB_URLS.map((u, i) => warm(`starship[${i}]`, loadGltfSceneAndClips(u))),
    ...STELLAR_GLB_URLS.map((u, i) => warm(`stellar[${i}]`, loadGltfRoot(u))),
    ...PLANET_GLB_URLS.map((u, i) => warm(`planet[${i}]`, loadGltfRoot(u))),
    ...imageUrls.map((u, i) =>
      warm(
        `image[${i}]`,
        fetch(u, { credentials: 'same-origin' }).then(() => undefined),
      ),
    ),
  ])
}
