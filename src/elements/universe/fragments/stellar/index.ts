import * as THREE from 'three'

import type { Nullable } from 'nfx-ui/types'
import type { StellarConfig } from './types'

export type { StellarConfig, StellarPalette, StellarShellShaders } from './types'
export { StellarBuilder } from './builder'

function themeSelect(isLight: boolean, value: { light: number; dark: number }) {
  return isLight ? value.light : value.dark
}

export class Stellar {
  readonly group: THREE.Group
  readonly coreMesh: THREE.Mesh
  private shellMesh: THREE.Mesh
  private shellAnimated = false
  private haloMesh: Nullable<THREE.Mesh> = null
  private haloAnimated = false

  constructor(config: StellarConfig) {
    this.group = new THREE.Group()

    const coreColor = new THREE.Color(config.palette.coreColor)
    const shellColor = new THREE.Color(config.palette.shellColor)
    const shellFallbackColor = new THREE.Color(config.palette.shellFallbackColor)
    const haloColor = new THREE.Color(config.palette.haloColor)
    const keyLightColor = new THREE.Color(config.palette.keyLightColor)
    const rimLightColor = new THREE.Color(config.palette.rimLightColor)

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(config.radius, config.segments, config.segments),
      new THREE.MeshPhysicalMaterial({
        color: coreColor,
        emissive: coreColor,
        emissiveIntensity: themeSelect(config.isLight, config.emissive),
        roughness: config.surface.roughness,
        metalness: config.surface.metalness,
        clearcoat: config.surface.clearcoat,
        clearcoatRoughness: config.surface.clearcoatRoughness,
      }),
    )

    this.coreMesh = sphere

    this.shellMesh = new THREE.Mesh(
      new THREE.SphereGeometry(config.shell.radius, config.segments, config.segments),
      config.shellShaders
        ? new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            uniforms: {
              uColor: { value: shellColor },
              uOpacity: { value: themeSelect(config.isLight, config.shell.opacity) },
            },
            vertexShader: config.shellShaders.vertex,
            fragmentShader: config.shellShaders.fragment,
          })
        : new THREE.MeshBasicMaterial({
            color: shellFallbackColor,
            transparent: true,
            opacity: themeSelect(config.isLight, config.shell.opacity),
            depthWrite: false,
          }),
    )

    this.shellAnimated = config.shell.ifanimate
    this.group.add(sphere, this.shellMesh)

    if (config.halo) {
      this.haloMesh = new THREE.Mesh(
        new THREE.SphereGeometry(config.halo.radius, config.segments, config.segments),
        new THREE.MeshBasicMaterial({
          color: haloColor,
          transparent: true,
          opacity: themeSelect(config.isLight, config.halo.opacity),
          depthWrite: false,
        }),
      )
      this.haloAnimated = config.halo.ifanimate
      this.group.add(this.haloMesh)
    }

    const keyLight = new THREE.PointLight(
      keyLightColor,
      themeSelect(config.isLight, config.keyLight.intensity),
      config.keyLight.distance,
      2,
    )
    keyLight.position.set(...config.keyLight.position)
    this.group.add(keyLight)

    if (config.rimLight) {
      const rimLight = new THREE.PointLight(
        rimLightColor,
        themeSelect(config.isLight, config.rimLight.intensity),
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
