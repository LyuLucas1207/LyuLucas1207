import * as THREE from 'three'

import type { Nullable } from 'nfx-ui/types'
import type { ThemeValue, UniversePalette } from '../types'
import type { StellarConfig } from './types'

export type { StellarConfig, StellarShellShaders } from './types'
export { StellarBuilder } from './builder'

function themeSelect(palette: UniversePalette, value: ThemeValue) {
  return palette.isLight ? value.light : value.dark
}

export class Stellar {
  readonly group: THREE.Group
  private shellMesh: THREE.Mesh
  private shellAnimated = false
  private haloMesh: Nullable<THREE.Mesh> = null
  private haloAnimated = false

  constructor(config: StellarConfig) {
    this.group = new THREE.Group()

    const primary = new THREE.Color(config.palette.primary)
    const light = new THREE.Color(config.palette.primaryLight)
    const highlight = new THREE.Color(config.palette.fgHighlight)

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(config.radius, config.segments, config.segments),
      new THREE.MeshPhysicalMaterial({
        color: primary,
        emissive: primary,
        emissiveIntensity: themeSelect(config.palette, config.emissive),
        roughness: config.surface.roughness,
        metalness: config.surface.metalness,
        clearcoat: config.surface.clearcoat,
        clearcoatRoughness: config.surface.clearcoatRoughness,
      }),
    )

    this.shellMesh = new THREE.Mesh(
      new THREE.SphereGeometry(config.shell.radius, config.segments, config.segments),
      config.shellShaders
        ? new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            uniforms: {
              uColor: { value: light },
              uOpacity: { value: themeSelect(config.palette, config.shell.opacity) },
            },
            vertexShader: config.shellShaders.vertex,
            fragmentShader: config.shellShaders.fragment,
          })
        : new THREE.MeshBasicMaterial({
            color: highlight,
            transparent: true,
            opacity: themeSelect(config.palette, config.shell.opacity),
            depthWrite: false,
          }),
    )

    this.shellAnimated = config.shell.ifanimate
    this.group.add(sphere, this.shellMesh)

    if (config.halo) {
      this.haloMesh = new THREE.Mesh(
        new THREE.SphereGeometry(config.halo.radius, config.segments, config.segments),
        new THREE.MeshBasicMaterial({
          color: light,
          transparent: true,
          opacity: themeSelect(config.palette, config.halo.opacity),
          depthWrite: false,
        }),
      )
      this.haloAnimated = config.halo.ifanimate
      this.group.add(this.haloMesh)
    }

    const keyLight = new THREE.PointLight(
      highlight,
      themeSelect(config.palette, config.keyLight.intensity),
      config.keyLight.distance,
      2,
    )
    keyLight.position.set(...config.keyLight.position)
    this.group.add(keyLight)

    if (config.rimLight) {
      const rimLight = new THREE.PointLight(
        light,
        themeSelect(config.palette, config.rimLight.intensity),
        config.rimLight.distance,
        2,
      )
      rimLight.position.set(...config.rimLight.position)
      this.group.add(rimLight)
    }
  }

  update(elapsed: number) {
    if (this.shellAnimated) {
      const scale = 1 + Math.sin(elapsed * 1.2) * 0.08
      this.shellMesh.scale.setScalar(scale)
    }
    if (this.haloMesh && this.haloAnimated) {
      const scale = 1 + Math.sin(elapsed * 0.8) * 0.32
      this.haloMesh.scale.setScalar(scale)
    }
  }
}
