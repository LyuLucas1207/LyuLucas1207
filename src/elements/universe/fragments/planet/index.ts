import * as THREE from 'three'

import { pickColor } from 'nfx-ui/utils'
import type { PlanetConfig } from './types'

export type { PlanetConfig, PlanetPalette, PlanetSurfaceConfig } from './types'
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

    const color = new THREE.Color(pickColor(config.palette.surfaceColorPool))

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(config.planetRadius, config.segments, config.segments),
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        // `isLight` means `glowOn`. Use the stronger emissive value when glow is on.
        emissiveIntensity: config.isLight ? config.surface.emissive.on : config.surface.emissive.off,
        roughness: config.surface.roughness,
        metalness: config.surface.metalness,
      }),
    )

    this.body.add(this.mesh)
  }
}
