import * as THREE from 'three'

import type { UniverseColorPool } from './types'

function fallbackColor(input: string, fallback: string) {
  try {
    return new THREE.Color(input)
  } catch {
    return new THREE.Color(fallback)
  }
}

export function toRgba(input: string, alpha: number, fallback = '#ffffff') {
  const color = fallbackColor(input, fallback)
  const red = Math.round(color.r * 255)
  const green = Math.round(color.g * 255)
  const blue = Math.round(color.b * 255)
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

export function luminance(input: string) {
  const color = fallbackColor(input, '#ffffff')
  const linear = (value: number) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4

  return 0.2126 * linear(color.r) + 0.7152 * linear(color.g) + 0.0722 * linear(color.b)
}

export function asThreeColor(input: string, fallback = '#ffffff') {
  return fallbackColor(input, fallback)
}

function buildVariants(base: string) {
  const source = fallbackColor(base, '#ffffff')
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
