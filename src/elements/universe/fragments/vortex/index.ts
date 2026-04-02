import * as THREE from 'three'

import { pickColor, randomBetween } from 'nfx-ui/utils'
import { buildStarMaterial } from '../../utils/material'
import type { VortexConfig } from './types'

export type { VortexConfig, VortexPalette, VortexShaders } from './types'
export { VortexBuilder } from './builder'

export class Vortex {
  readonly points: THREE.Points
  readonly material: THREE.ShaderMaterial
  private baseY: Float32Array | null = null
  private phases: Float32Array | null = null
  private animated: boolean
  private offset: number

  constructor(config: VortexConfig) {
    const count = config.particleCount
    const geometry = this.buildGeometry(count, config)

    this.material = buildStarMaterial(
      config.baseSize,
      config.opacity,
      config.isLight,
      config.shaders.vertex,
      config.shaders.fragment,
    )
    this.points = new THREE.Points(geometry, this.material)
    this.animated = config.ifanimate
    this.offset = config.animateOffset

    if (this.animated) {
      const pos = geometry.getAttribute('position') as THREE.BufferAttribute
      this.baseY = new Float32Array(count)
      this.phases = new Float32Array(count)
      for (let i = 0; i < count; i++) {
        this.baseY[i] = pos.getY(i)
        this.phases[i] = randomBetween(0, Math.PI * 2)
      }
    }
  }

  update(elapsed: number) {
    if (!this.animated || !this.baseY || !this.phases) return

    const pos = this.points.geometry.getAttribute('position') as THREE.BufferAttribute
    for (let i = 0; i < this.baseY.length; i++) {
      pos.setY(i, this.baseY[i] + Math.sin(elapsed * 0.6 + this.phases[i]) * this.offset)
    }
    pos.needsUpdate = true
  }

  private buildGeometry(count: number, config: VortexConfig) {
    const positions = new Float32Array(count * 3)
    const tint = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)
    const depths = new Float32Array(count)

    for (let index = 0; index < count; index++) {
      const progress = index / count
      const arm = index % config.armCount
      const radius = progress * progress * 148 + progress * 18 + randomBetween(-2.8, 2.8)
      const angle = progress * 11.4 + (Math.PI * 2 * arm) / config.armCount + randomBetween(-0.1, 0.1)
      const color = new THREE.Color(pickColor(config.palette.particleColorPool))
      const stride = index * 3

      positions[stride] = Math.cos(angle) * radius
      positions[stride + 1] = Math.sin(progress * 9.5 + arm) * 2.4 + randomBetween(-1.6, 1.6)
      positions[stride + 2] = Math.sin(angle) * radius

      tint[stride] = color.r
      tint[stride + 1] = color.g
      tint[stride + 2] = color.b
      sizes[index] = randomBetween(config.isLight ? 2.2 : 1.1, config.isLight ? 6.2 : 3.4)
      phases[index] = randomBetween(0.5, 2.2)
      depths[index] = randomBetween(0.9, 1.3)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(tint, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    geometry.setAttribute('aDepth', new THREE.BufferAttribute(depths, 1))
    return geometry
  }
}
