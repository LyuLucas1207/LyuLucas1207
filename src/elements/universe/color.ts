import * as THREE from 'three'

import type { UniverseColorPool } from './types'

export function luminance(input: string) {
  const color = new THREE.Color(input)
  const linear = (value: number) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4

  return 0.2126 * linear(color.r) + 0.7152 * linear(color.g) + 0.0722 * linear(color.b)
}


function buildVariants(base: string) {
  const source = new THREE.Color(base)
  return [-0.12, -0.05, 0, 0.08, 0.16].map((lightness, index) => {
    const next = source.clone()
    next.offsetHSL(0, index < 2 ? 0.06 : 0.1, lightness)
    return `#${next.getHexString()}`
  })
}

export function buildColorPool(primary: string, primaryHover: string, primaryLight: string): UniverseColorPool {
  const primaryVariants = buildVariants(primary)
  const hoverVariants = buildVariants(primaryHover)
  const lightVariants = buildVariants(primaryLight)

  return {
    primary: primaryVariants,
    hover: hoverVariants,
    light: lightVariants,
    all: [...primaryVariants, ...hoverVariants, ...lightVariants],
  }
}

export function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

export function pickColor(pool: string[]) {
  return pool[Math.floor(Math.random() * pool.length)] || '#ffffff'
}
