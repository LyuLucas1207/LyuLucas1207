import * as THREE from 'three'

import { asThreeColor } from '../color'
import type { StarSystemConfig, UniversePalette } from '../types'

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

  constructor(
    config: StarSystemConfig['planets'][number],
    color: string,
    palette: UniversePalette,
    variance: number,
  ) {
    this.body = new THREE.Group()

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(config.planetRadius * (0.88 + variance * 0.34), 24, 24),
      new THREE.MeshStandardMaterial({
        color: asThreeColor(color),
        emissive: asThreeColor(color),
        emissiveIntensity: palette.isLight ? 0.6 : 1.2,
        roughness: 0.34,
        metalness: 0.12,
      }),
    )

    this.body.add(this.mesh)

    if (variance > 0.52) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(
          config.planetRadius * (1.65 + variance * 0.5),
          config.planetRadius * 0.16,
          12,
          72,
        ),
        new THREE.MeshBasicMaterial({
          color: asThreeColor(color),
          transparent: true,
          opacity: palette.isLight ? 0.28 : 0.42,
          depthWrite: false,
        }),
      )
      ring.rotation.x = Math.PI / 2 + (variance - 0.5) * 0.9
      ring.rotation.z = (variance - 0.5) * 0.7
      this.body.add(ring)
    }
  }

  static createOrbitRing(radius: number, color: string) {
    return new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.04, 10, 120),
      new THREE.MeshBasicMaterial({
        color: asThreeColor(color),
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    )
  }
}