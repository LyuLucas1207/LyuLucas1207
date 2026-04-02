import * as THREE from 'three'

import { pickColor } from 'nfx-ui/utils'
import type { OrbitConfig } from './types'

export type { OrbitConfig, OrbitPalette } from './types'
export { OrbitBuilder } from './builder'

export class Orbit {
  readonly mesh: THREE.Mesh

  constructor(config: OrbitConfig) {
    this.mesh = new THREE.Mesh(
      new THREE.TorusGeometry(config.radius, 0.04, 10, 120),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(pickColor(config.palette.colorPool)),
        transparent: true,
        opacity: config.isLight ? 0.28 : 0.22,
        depthWrite: false,
      }),
    )
  }
}
