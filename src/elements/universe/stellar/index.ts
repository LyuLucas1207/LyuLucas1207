import * as THREE from 'three'

import { asThreeColor } from '../color'
import type { UniversePalette } from '../types'

type ThemeValue = { light: number; dark: number }

type LightConfig = {
  intensity: ThemeValue
  distance: number
  position: [number, number, number]
}

export type StarConfig = {
  radius: number
  segments: number
  emissive: ThemeValue
  surface: {
    roughness: number
    metalness: number
    clearcoat: number
    clearcoatRoughness: number
  }
  shell: {
    radius: number
    opacity: ThemeValue
  }
  halo?: {
    radius: number
    opacity: ThemeValue
    ifanimate: boolean
  }
  keyLight: LightConfig
  rimLight?: LightConfig
}

export type StarShellShaders = {
  vertex: string
  fragment: string
}

export const CORE_STAR_PRESET: StarConfig = {
  radius: 8,
  segments: 48,
  emissive: { light: 2.8, dark: 4.2 },
  surface: { roughness: 0.18, metalness: 0.02, clearcoat: 0.72, clearcoatRoughness: 0.16 },
  shell: { radius: 9.8, opacity: { light: 0.34, dark: 0.46 } },
  halo: { radius: 13.5, opacity: { light: 0.18, dark: 0.24 }, ifanimate: true },
  keyLight: { intensity: { light: 26, dark: 36 }, distance: 96, position: [10, 7, 14] },
  rimLight: { intensity: { light: 8, dark: 14 }, distance: 120, position: [-16, -10, -18] },
}

export const SYSTEM_STAR_PRESET: StarConfig = {
  radius: 3.2,
  segments: 32,
  emissive: { light: 2.4, dark: 3.4 },
  surface: { roughness: 0.2, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.14 },
  shell: { radius: 5.2, opacity: { light: 0.16, dark: 0.22 } },
  keyLight: { intensity: { light: 10, dark: 14 }, distance: 54, position: [4, 4, 5] },
}

function themeSelect(palette: UniversePalette, value: ThemeValue) {
  return palette.isLight ? value.light : value.dark
}

export class Stellar {
  readonly group: THREE.Group
  private haloMesh: THREE.Mesh | null = null
  private haloAnimated = false

  constructor(config: StarConfig, palette: UniversePalette, shellShaders?: StarShellShaders) {
    this.group = new THREE.Group()

    const primary = asThreeColor(palette.primary)
    const light = asThreeColor(palette.primaryLight)
    const highlight = asThreeColor(palette.fgHighlight)
    const seg = config.segments

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(config.radius, seg, seg),
      new THREE.MeshPhysicalMaterial({
        color: primary,
        emissive: primary,
        emissiveIntensity: themeSelect(palette, config.emissive),
        roughness: config.surface.roughness,
        metalness: config.surface.metalness,
        clearcoat: config.surface.clearcoat,
        clearcoatRoughness: config.surface.clearcoatRoughness,
      }),
    )

    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(config.shell.radius, seg, seg),
      shellShaders
        ? new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            uniforms: {
              uColor: { value: light },
              uOpacity: { value: themeSelect(palette, config.shell.opacity) },
            },
            vertexShader: shellShaders.vertex,
            fragmentShader: shellShaders.fragment,
          })
        : new THREE.MeshBasicMaterial({
            color: highlight,
            transparent: true,
            opacity: themeSelect(palette, config.shell.opacity),
            depthWrite: false,
          }),
    )

    this.group.add(sphere, shell)

    if (config.halo) {
      this.haloMesh = new THREE.Mesh(
        new THREE.SphereGeometry(config.halo.radius, seg, seg),
        new THREE.MeshBasicMaterial({
          color: light,
          transparent: true,
          opacity: themeSelect(palette, config.halo.opacity),
          depthWrite: false,
        }),
      )
      this.haloAnimated = config.halo.ifanimate
      this.group.add(this.haloMesh)
    }

    const keyLight = new THREE.PointLight(
      highlight,
      themeSelect(palette, config.keyLight.intensity),
      config.keyLight.distance,
      2,
    )
    keyLight.position.set(...config.keyLight.position)
    this.group.add(keyLight)

    if (config.rimLight) {
      const rimLight = new THREE.PointLight(
        light,
        themeSelect(palette, config.rimLight.intensity),
        config.rimLight.distance,
        2,
      )
      rimLight.position.set(...config.rimLight.position)
      this.group.add(rimLight)
    }
  }

  update(elapsed: number) {
    if (this.haloMesh && this.haloAnimated) {
      const scale = 1 + Math.sin(elapsed * 0.8) * 0.32
      this.haloMesh.scale.setScalar(scale)
    }
  }
}
