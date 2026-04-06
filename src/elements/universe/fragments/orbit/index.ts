import * as THREE from 'three'

import { pickColor } from 'nfx-ui/utils'
import { Fragment } from '../../libs/fragment'
import type { OrbitConfig } from './types'

export type { OrbitConfig, OrbitPalette } from './types'
export { OrbitBuilder } from './builder'

export class Orbit extends Fragment {
  readonly mesh: THREE.Mesh

  get root() {
    return this.mesh
  }

  constructor(config: OrbitConfig) {
    super()
    this.mesh = new THREE.Mesh(
      new THREE.TorusGeometry(config.radius, 0.04, 10, 120),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(pickColor(config.palette.colorPool)),
        transparent: true,
        // `isLight` means glowOn; raise opacity when glow is on.
        opacity: config.isLight ? 0.35 : 0.18,
        depthWrite: false,
      }),
    )
  }
}
