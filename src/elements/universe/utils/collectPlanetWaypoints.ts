import * as THREE from 'three'

import type { StarSystemRuntime } from '../systems'

/** 所有可见行星的 `mesh`，作飞船跳跃的目标路点 */
export function collectPlanetWaypoints(runtimes: StarSystemRuntime[]): THREE.Object3D[] {
  const out: THREE.Object3D[] = []
  for (const rt of runtimes) {
    for (const p of rt.planets) {
      out.push(p.mesh)
    }
  }
  return out
}
