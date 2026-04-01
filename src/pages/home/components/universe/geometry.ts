import * as THREE from 'three'

import { asThreeColor, pickColor, randomBetween } from './color'
import type { StreamGeometryOptions, VortexGeometryOptions } from './types'

function applyGeometryAttributes(
  positions: Float32Array,
  colors: Float32Array,
  sizes: Float32Array,
  phases: Float32Array,
  depths: Float32Array,
) {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute('aDepth', new THREE.BufferAttribute(depths, 1))
  return geometry
}

export function buildVortexGeometry({ count, colors, isLight }: VortexGeometryOptions) {
  const positions = new Float32Array(count * 3)
  const tint = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const depths = new Float32Array(count)
  const armCount = 5

  for (let index = 0; index < count; index += 1) {
    const progress = index / count
    const arm = index % armCount
    const radius = progress * progress * 112 + randomBetween(-2.2, 2.2)
    const angle = progress * 16 + (Math.PI * 2 * arm) / armCount + randomBetween(-0.12, 0.12)
    const color = asThreeColor(pickColor(colors.all))
    const stride = index * 3

    positions[stride] = Math.cos(angle) * radius
    positions[stride + 1] = Math.sin(progress * 14 + arm) * 2.2 + randomBetween(-1.8, 1.8)
    positions[stride + 2] = Math.sin(angle) * radius

    tint[stride] = color.r
    tint[stride + 1] = color.g
    tint[stride + 2] = color.b
    sizes[index] = randomBetween(isLight ? 2.2 : 1.1, isLight ? 6.2 : 3.4)
    phases[index] = randomBetween(0.5, 2.2)
    depths[index] = randomBetween(0.9, 1.3)
  }

  return applyGeometryAttributes(positions, tint, sizes, phases, depths)
}

export function buildStreamGeometry({ pathIndex, colors, isLight }: StreamGeometryOptions) {
  const count = isLight ? 170 : 140
  const positions = new Float32Array(count * 3)
  const tint = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const depths = new Float32Array(count)
  const baseAngle = (Math.PI * 2 * pathIndex) / 5
  const streamPool = [...colors.hover, ...colors.light, ...colors.primary]

  for (let index = 0; index < count; index += 1) {
    const progress = index / (count - 1)
    const radius = 260 - progress * 228 + randomBetween(-2.4, 2.4)
    const angle = baseAngle + progress * 5.6 + Math.sin(progress * 8 + pathIndex) * 0.18
    const color = asThreeColor(pickColor(streamPool))
    const stride = index * 3

    positions[stride] = Math.cos(angle) * radius
    positions[stride + 1] = Math.sin(progress * 10 + pathIndex) * 2.8 + (0.5 - progress) * 4
    positions[stride + 2] = Math.sin(angle) * radius

    tint[stride] = color.r
    tint[stride + 1] = color.g
    tint[stride + 2] = color.b
    sizes[index] = randomBetween(isLight ? 2.4 : 1.1, isLight ? 5.8 : 3.1) * (1.1 - progress * 0.45)
    phases[index] = randomBetween(0.6, 2.4)
    depths[index] = randomBetween(0.92, 1.24)
  }

  return applyGeometryAttributes(positions, tint, sizes, phases, depths)
}
