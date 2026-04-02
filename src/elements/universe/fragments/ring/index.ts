import * as THREE from 'three'

import { pickColor } from 'nfx-ui/utils'
import type { RingConfig } from './types'

export type { RingConfig, RingPalette } from './types'
export { RingBuilder } from './builder'

function buildBandProfile(inner: number, outer: number, h: number, steps: number) {
  const r = Math.min(h, (outer - inner) * 0.5)
  const profile: THREE.Vector2[] = []

  for (let i = steps; i >= 0; i--) {
    const angle = (Math.PI / 2) * (i / steps)
    profile.push(new THREE.Vector2(inner + r - Math.cos(angle) * r, -Math.sin(angle) * r))
  }

  for (let i = 0; i <= steps; i++) {
    const angle = (Math.PI / 2) * (i / steps)
    profile.push(new THREE.Vector2(outer - r + Math.cos(angle) * r, -Math.sin(angle) * r))
  }

  for (let i = steps; i >= 0; i--) {
    const angle = (Math.PI / 2) * (i / steps)
    profile.push(new THREE.Vector2(outer - r + Math.cos(angle) * r, Math.sin(angle) * r))
  }

  for (let i = 0; i <= steps; i++) {
    const angle = (Math.PI / 2) * (i / steps)
    profile.push(new THREE.Vector2(inner + r - Math.cos(angle) * r, Math.sin(angle) * r))
  }

  return profile
}

export class Ring {
  readonly group: THREE.Group

  constructor(config: RingConfig) {
    this.group = new THREE.Group()

    const gaps: boolean[] = []
    for (let i = 0; i < config.ringNumber - 1; i++) {
      gaps.push(config.randomGap ? Math.random() > 0.5 : true)
    }

    const activeGapCount = gaps.filter(Boolean).length
    const totalSpan = config.outerRadius - config.innerRadius
    const totalGap = config.gap * activeGapCount
    const bandSpan = (totalSpan - totalGap) / config.ringNumber
    const baseColor = new THREE.Color(pickColor(config.palette.bandColorPool))
    const h = config.thickness / 2

    let cursor = config.innerRadius
    for (let i = 0; i < config.ringNumber; i++) {
      const inner = cursor
      const outer = inner + bandSpan
      const jitter = (Math.random() * 2 - 1) * config.gapJitter
      cursor = outer + (i < gaps.length && gaps[i] ? Math.max(0, config.gap + jitter) : 0)

      const profile = buildBandProfile(inner, outer, h, 6)
      const bandColor = baseColor.clone().offsetHSL(i * 0.06, 0, (i % 2 === 0 ? 0.04 : -0.04))

      const geometry = new THREE.LatheGeometry(profile, config.segments)
      geometry.computeVertexNormals()

      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color: bandColor,
          emissive: bandColor,
          emissiveIntensity: config.isLight ? 0.4 : 0.6,
          side: THREE.DoubleSide,
          roughness: 0.5,
          metalness: 0.1,
        }),
      )
      this.group.add(mesh)
    }

    this.group.rotation.set(...config.rotation)
  }
}
