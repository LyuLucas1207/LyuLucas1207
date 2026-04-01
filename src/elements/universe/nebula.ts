import * as THREE from 'three'

import { pickColor, randomBetween, toRgba } from './color'
import type { UniverseColorPool, UniversePalette } from './types'

function createNebulaTexture(color: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 320
  canvas.height = 320
  const context = canvas.getContext('2d')

  if (!context) {
    return new THREE.Texture()
  }

  const gradient = context.createRadialGradient(160, 160, 0, 160, 160, 160)
  gradient.addColorStop(0, toRgba(color, 0.9))
  gradient.addColorStop(0.3, toRgba(color, 0.28))
  gradient.addColorStop(1, toRgba(color, 0))
  context.fillStyle = gradient
  context.fillRect(0, 0, 320, 320)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export function createNebulaSprites(palette: UniversePalette, colors: UniverseColorPool) {
  const cloud = new THREE.Group()

  for (let index = 0; index < 3; index += 1) {
    const color = pickColor(colors.all)
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: createNebulaTexture(color),
        transparent: true,
        opacity: palette.isLight ? 0.1 + index * 0.03 : 0.07 + index * 0.03,
        blending: palette.isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )

    sprite.position.set(randomBetween(-280, 280), randomBetween(-80, 80), -randomBetween(220, 460))
    sprite.scale.set(randomBetween(160, 260), randomBetween(96, 180), 1)
    ;(sprite.material as THREE.SpriteMaterial).rotation = randomBetween(0, Math.PI * 2)
    cloud.add(sprite)
  }

  return cloud
}
