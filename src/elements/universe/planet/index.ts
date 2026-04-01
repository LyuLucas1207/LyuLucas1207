import * as THREE from 'three'

import type { PlanetConfig } from './types'

export type { PlanetConfig, PlanetSurfaceConfig } from './types'
export { PlanetBuilder } from './builder'

export type PlanetRuntime = {
  orbitCarrier: THREE.Group
  body: THREE.Object3D
  mesh: THREE.Mesh
  speed: number
  baseScale: number
}

export class Planet {
  readonly body: THREE.Group
  readonly mesh: THREE.Mesh

  constructor(config: PlanetConfig) {
    this.body = new THREE.Group()

    const color = new THREE.Color(config.color)

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(config.planetRadius, config.segments, config.segments),
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: config.palette.isLight ? config.surface.emissive.light : config.surface.emissive.dark,
        roughness: config.surface.roughness,
        metalness: config.surface.metalness,
      }),
    )

    this.body.add(this.mesh)
  }
}
