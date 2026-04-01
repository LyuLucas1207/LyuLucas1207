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
    const radius = progress * progress * 148 + progress * 18 + randomBetween(-2.8, 2.8)
    const angle = progress * 11.4 + (Math.PI * 2 * arm) / armCount + randomBetween(-0.1, 0.1)
    const color = asThreeColor(pickColor(colors.all))
    const stride = index * 3

    positions[stride] = Math.cos(angle) * radius
    positions[stride + 1] = Math.sin(progress * 9.5 + arm) * 2.4 + randomBetween(-1.6, 1.6)
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
  const count = isLight ? 260 : 220
  const positions = new Float32Array(count * 3)
  const tint = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const depths = new Float32Array(count)
  const baseAngle = (Math.PI * 2 * pathIndex) / 5
  const streamPool = [...colors.hover, ...colors.light, ...colors.primary]

  for (let index = 0; index < count; index += 1) {
    const progress = index / (count - 1)
    const radius = 336 - progress * 288 + randomBetween(-2.8, 2.8)
    const angle = baseAngle + progress * 3.8 + Math.sin(progress * 6.4 + pathIndex) * 0.14
    const color = asThreeColor(pickColor(streamPool))
    const stride = index * 3

    positions[stride] = Math.cos(angle) * radius
    positions[stride + 1] = Math.sin(progress * 7.4 + pathIndex) * 2.8 + (0.5 - progress) * 4.8
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
