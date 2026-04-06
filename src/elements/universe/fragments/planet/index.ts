import * as THREE from 'three'

import { pickColor } from 'nfx-ui/utils'

import  type { Nullable } from 'nfx-ui/types'
import type { Ring } from '../ring'
import type { PlanetConfig } from './types'

export type { PlanetConfig, PlanetPalette, PlanetSurfaceConfig } from './types'
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

export class Planet {
  readonly body: THREE.Group
  /** 球体 / GLB 挂在下述节点上自转；碰撞体与星环/卫星仍在 `body` */
  readonly coreSlot: THREE.Group
  readonly mesh: THREE.Mesh
  private visual: Nullable<THREE.Mesh> = null
  private glbRoot: Nullable<THREE.Object3D> = null
  private readonly spinSpeed: number
  private readonly spinPhase: number

  constructor(config: PlanetConfig) {
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
      Planet.disposeObject3DResources(this.glbRoot)
      this.glbRoot = null
    }
    if (this.visual) {
      this.coreSlot.remove(this.visual)
      this.visual.geometry.dispose();
      const material = this.visual.material as THREE.Material
      if (material) material.dispose()
      this.visual = null
    }
    this.body.remove(this.mesh)
    this.glbRoot = root
    this.coreSlot.add(root)
    this.body.add(this.mesh)
  }

  private static disposeObject3DResources(obj: THREE.Object3D) {
    obj.traverse((child) => {
      const node = child as THREE.Mesh
      node.geometry?.dispose()
      const mats = node.material
      if (!mats) return
      const list = Array.isArray(mats) ? mats : [mats]
      list.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial & { map?: THREE.Texture | null }
        mat.map?.dispose()
        m.dispose()
      })
    })
  }
}
