import * as THREE from 'three'

import { pickColor } from 'nfx-ui/utils'

import type { Nullable } from 'nfx-ui/types'
import type { Ring } from '../ring'
import { Fragment } from '../../libs/fragment'
import { disposeMaterials, disposeObject3DSubtree } from '../../utils/disposeThreeResources'
import type { PlanetConfig } from './types'

export type { PlanetConfig, PlanetPalette, PlanetPickConfig, PlanetSurfaceConfig } from './types'
export { PlanetBuilder } from './builder'

export type PlanetRuntime = {
  planet: Planet
  orbitCarrier: THREE.Group
  body: THREE.Object3D
  /** 透明碰撞球 — 供 `SceneInput` 射线检测；GLB 只负责外观。 */
  mesh: THREE.Mesh
  speed: number
  baseScale: number
  ring?: Ring
}

export class Planet extends Fragment {
  readonly body: THREE.Group
  /** 球体 / GLB 挂在下述节点上自转；碰撞体与星环/卫星仍在 `body` */
  readonly coreSlot: THREE.Group
  readonly mesh: THREE.Mesh
  private visual: Nullable<THREE.Mesh> = null
  private glbRoot: Nullable<THREE.Object3D> = null
  private readonly spinSpeed: number
  private readonly spinPhase: number

  get root() {
    return this.body
  }

  /** 射线命中透明碰撞球，与 `mergeUserData` 写入目标一致 */
  get userData() {
    return this.mesh.userData
  }

  mergeUserData(patch: Record<string, unknown>) {
    Object.assign(this.mesh.userData, patch)
  }

  setUserData(data: Record<string, unknown>) {
    const ud = this.mesh.userData
    for (const k of Object.keys({ ...ud })) {
      delete ud[k]
    }
    Object.assign(ud, data)
  }

  constructor(config: PlanetConfig) {
    super()
    this.body = new THREE.Group()
    this.coreSlot = new THREE.Group()
    this.spinSpeed = config.spinSpeed * (0.28 + Math.random() * 0.18)
    this.spinPhase = Math.random() * Math.PI * 2

    const color = new THREE.Color(pickColor(config.palette.surfaceColorPool))
    const sphere = new THREE.SphereGeometry(config.planetRadius, config.segments, config.segments)
    this.visual = new THREE.Mesh(
      sphere,
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        // `isLight` means `glowOn`. Use the stronger emissive value when glow is on.
        emissiveIntensity: config.isLight ? config.surface.emissive.on : config.surface.emissive.off,
        roughness: config.surface.roughness,
        metalness: config.surface.metalness,
      }),
    )

    const pickSegments = Math.max(12, Math.min(config.segments, 28))
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(config.planetRadius, pickSegments, pickSegments),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    )

    this.coreSlot.add(this.visual)
    this.body.add(this.coreSlot, this.mesh)

    const pick = config.pick
    this.mergeUserData({
      planetRadius: config.planetRadius,
      planetBody: this.body,
      ...(pick
        ? {
            planetId: pick.planetId,
            action: pick.action,
            baseScale: pick.baseScale ?? 1,
            hovered: pick.hovered ?? false,
            systemName: pick.systemName,
            label: pick.label,
          }
        : {}),
    })
  }

  update(elapsed: number) {
    this.coreSlot.rotation.y = elapsed * this.spinSpeed + this.spinPhase
  }

  /**
   * 用已缩放到行星半径的 GLB 根节点替换程序化球体；重复调用会先释放上一颗 GLB。
   */
  attachGlbRoot(root: THREE.Object3D) {
    if (this.glbRoot) {
      this.coreSlot.remove(this.glbRoot)
      disposeObject3DSubtree(this.glbRoot)
      this.glbRoot = null
    }
    if (this.visual) {
      this.coreSlot.remove(this.visual)
      this.visual.geometry.dispose()
      disposeMaterials(this.visual.material)
      this.visual = null
    }
    this.body.remove(this.mesh)
    this.glbRoot = root
    this.coreSlot.add(root)
    this.body.add(this.mesh)
  }

}
