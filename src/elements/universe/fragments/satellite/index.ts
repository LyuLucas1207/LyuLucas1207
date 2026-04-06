import * as THREE from 'three'

import type { Nullable } from 'nfx-ui/types'

import type { SatelliteConfig } from './types'

export type { SatelliteConfig, SatellitePalette, SatelliteSurfaceConfig } from './types'
export { SatelliteBuilder } from './builder'

export class Satellite {
  readonly group: THREE.Group
  /** 球体半径（与贴图缩放一致） */
  readonly targetRadius: number

  private carrier: THREE.Group
  private orbitPivot: THREE.Group
  private visualSlot: THREE.Group
  private speed: number
  private visualMesh: Nullable<THREE.Mesh> = null
  private readonly pointLight: THREE.PointLight
  /** 与配置 `emissive` 一致，贴图加载后驱动 `emissiveIntensity` */
  private readonly glowStrength: number

  constructor(config: SatelliteConfig) {
    this.group = new THREE.Group()
    this.speed = config.speed
    this.carrier = new THREE.Group()
    this.targetRadius = config.radius

    this.orbitPivot = new THREE.Group()
    this.orbitPivot.position.set(config.orbitRadius, 0, 0)
    this.visualSlot = new THREE.Group()

    const fill = config.isLight ? config.emissive.on : config.emissive.off
    this.glowStrength = fill

    this.visualMesh = new THREE.Mesh(
      new THREE.SphereGeometry(config.radius, config.segments, config.segments),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: THREE.MathUtils.clamp(fill * 0.42, 0.48, 1.75),
        roughness: config.surface.roughness,
        metalness: 0,
      }),
    )

    this.pointLight = new THREE.PointLight(
      0xffffff,
      Math.min(2.4, fill * (config.isLight ? 1.0 : 0.72)),
      Math.max(18, config.orbitRadius * 4.5),
      2,
    )

    this.visualSlot.add(this.visualMesh, this.pointLight)
    this.orbitPivot.add(this.visualSlot)
    this.carrier.add(this.orbitPivot)
    this.group.add(this.carrier)
  }

  /**
   * 漫反射 `map` + 同步 `emissiveMap`：自发光带贴图细节，不像纯色 emissive 糊成一块。
   * 无金属 / 无 envMap。共享纹理勿 dispose。
   */
  applySurfaceMap(map: THREE.Texture) {
    if (!this.visualMesh) return

    const mat = this.visualMesh.material as THREE.MeshStandardMaterial
    mat.map = map
    mat.emissiveMap = map
    mat.color.set(0xffffff)
    mat.emissive.set(0xffffff)
    mat.emissiveIntensity = THREE.MathUtils.clamp(this.glowStrength * 0.48, 0.52, 2.0)
    mat.metalness = 0
    mat.envMap = null
    map.needsUpdate = true
    mat.needsUpdate = true
  }

  update() {
    this.carrier.rotation.y += this.speed
  }
}
