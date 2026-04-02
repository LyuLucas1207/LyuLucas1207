import * as THREE from 'three'

import { pickColor, randomBetween, toRgbaWithAlpha } from 'nfx-ui/utils'
import type { NebulaConfig } from './types'

export type { NebulaConfig, NebulaPalette } from './types'
export { NebulaBuilder } from './builder'

function createNebulaTexture(color: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 320
  canvas.height = 320
  const context = canvas.getContext('2d')

  if (!context) {
    return new THREE.Texture()
  }

  const gradient = context.createRadialGradient(160, 160, 0, 160, 160, 160)
  gradient.addColorStop(0, toRgbaWithAlpha(color, 0.9))
  gradient.addColorStop(0.3, toRgbaWithAlpha(color, 0.28))
  gradient.addColorStop(1, toRgbaWithAlpha(color, 0))
  context.fillStyle = gradient
  context.fillRect(0, 0, 320, 320)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export class Nebula {
  readonly group: THREE.Group

  constructor(config: NebulaConfig) {
    this.group = new THREE.Group()

    for (let index = 0; index < 3; index += 1) {
      const color = pickColor(config.palette.colorPool)
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: createNebulaTexture(color),
          transparent: true,
          // `isLight` means `glowOn`: glow uses additive blending.
          // Opacity should not depend on glowOn/off; use additive/normal blending for glow effect.
          opacity: 0.08 + index * 0.03,
          blending: config.isLight ? THREE.AdditiveBlending : THREE.NormalBlending,
          depthWrite: false,
        }),
      )

      sprite.position.set(randomBetween(-280, 280), randomBetween(-80, 80), -randomBetween(220, 460))
      sprite.scale.set(randomBetween(160, 260), randomBetween(96, 180), 1)
      ;(sprite.material as THREE.SpriteMaterial).rotation = randomBetween(0, Math.PI * 2)
      this.group.add(sprite)
    }
  }
}
