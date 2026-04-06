import * as THREE from 'three'

import { pickColor, randomBetween } from 'nfx-ui/utils'
import { buildStarMaterial } from '../../utils/material'
import { Fragment } from '../../libs/fragment'
import { getBufferAttribute } from '../../utils/threeAttributes'
import type { StreamConfig } from './types'

export type { StreamConfig, StreamPalette, StreamShaders } from './types'
export { StreamBuilder } from './builder'

type StreamBand = {
  geometry: THREE.BufferGeometry
  baseY: Float32Array
  phases: Float32Array
}

export class Stream extends Fragment {
  readonly group: THREE.Group
  readonly materials: THREE.ShaderMaterial[] = []
  private bands: StreamBand[] = []
  private animated: boolean
  private offset: number

  get root() {
    return this.group
  }

  constructor(config: StreamConfig) {
    super()
    this.group = new THREE.Group()
    this.animated = config.ifanimate
    this.offset = config.animateOffset

    for (let pathIndex = 0; pathIndex < config.streamCount; pathIndex++) {
      const geometry = this.buildGeometry(pathIndex, config)
      const material = buildStarMaterial(
        config.baseSize,
        config.opacity,
        config.isLight,
        config.shaders.vertex,
        config.shaders.fragment,
      )
      const points = new THREE.Points(geometry, material)
      this.group.add(points)
      this.materials.push(material)

      if (this.animated) {
        const pos = getBufferAttribute(geometry, 'position')
        if (!pos) continue
        const count = pos.count
        const baseY = new Float32Array(count)
        const phases = new Float32Array(count)
        for (let i = 0; i < count; i++) {
          baseY[i] = pos.getY(i)
          phases[i] = randomBetween(0, Math.PI * 2)
        }
        this.bands.push({ geometry, baseY, phases })
      }
    }
  }

  update(elapsed: number) {
    if (!this.animated) return

    for (const band of this.bands) {
      const pos = getBufferAttribute(band.geometry, 'position')
      if (!pos) continue
      for (let i = 0; i < band.baseY.length; i++) {
        pos.setY(i, band.baseY[i] + Math.sin(elapsed * 0.4 + band.phases[i]) * this.offset)
      }
      pos.needsUpdate = true
    }
  }

  private buildGeometry(pathIndex: number, config: StreamConfig) {
    const count = config.particleCount
    const positions = new Float32Array(count * 3)
    const tint = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)
    const depths = new Float32Array(count)
    const baseAngle = (Math.PI * 2 * pathIndex) / config.streamCount

    const denom = Math.max(count - 1, 1)
    for (let index = 0; index < count; index++) {
      const progress = index / denom
      const radius = 336 - progress * 288 + randomBetween(-2.8, 2.8)
      const angle = baseAngle + progress * 3.8 + Math.sin(progress * 6.4 + pathIndex) * 0.14
      const color = new THREE.Color(pickColor(config.palette.particleColorPool))
      const stride = index * 3

      positions[stride] = Math.cos(angle) * radius
      positions[stride + 1] = Math.sin(progress * 7.4 + pathIndex) * 2.8 + (0.5 - progress) * 4.8
      positions[stride + 2] = Math.sin(angle) * radius

      tint[stride] = color.r
      tint[stride + 1] = color.g
      tint[stride + 2] = color.b
      sizes[index] = randomBetween(config.isLight ? 2.4 : 1.1, config.isLight ? 5.8 : 3.1) * (1.1 - progress * 0.45)
      phases[index] = randomBetween(0.6, 2.4)
      depths[index] = randomBetween(0.92, 1.24)
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
