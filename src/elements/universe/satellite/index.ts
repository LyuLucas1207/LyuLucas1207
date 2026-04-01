import * as THREE from 'three'

import type { SatelliteConfig } from './types'

export type { SatelliteConfig } from './types'
export { SatelliteBuilder } from './builder'

export class Satellite {
  readonly group: THREE.Group
  private carrier: THREE.Group
  private speed: number

  constructor(config: SatelliteConfig) {
    this.group = new THREE.Group()
    this.speed = config.speed
    this.carrier = new THREE.Group()

    const color = new THREE.Color(config.color)
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(config.radius, config.segments, config.segments),
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: config.isLight ? config.emissive.light : config.emissive.dark,
        roughness: 0.5,
        metalness: 0.1,
      }),
    )
    mesh.position.set(config.orbitRadius, 0, 0)

    this.carrier.add(mesh)
    this.group.add(this.carrier)
  }

  update() {
    this.carrier.rotation.y += this.speed
  }
}
