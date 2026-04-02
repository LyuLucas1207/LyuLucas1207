import * as THREE from 'three'

import { toRgbaWithAlpha } from 'nfx-ui/utils'

import type { LabelConfig } from './types'

export type { LabelConfig, LabelPalette, LabelVariant } from './types'
export { LabelBuilder } from './builder'

const VARIANT = {
  system: { w: 352, h: 90, inset: 12, radius: 8, font: '700 32px "Segoe UI"', fillA: 0.085, fillB: 0.018, stroke: 0.18, scaleX: 22, scaleY: 5.8, posY: 10.6 },
  planet: { w: 248, h: 68, inset: 10, radius: 7, font: '600 28px "Segoe UI"', fillA: 0.065, fillB: 0.014, stroke: 0.12, scaleX: 13.8, scaleY: 3.8, posY: 3.25 },
} as const

export class Label {
  readonly sprite: THREE.Sprite

  constructor(config: LabelConfig) {
    const v = VARIANT[config.variant]
    const palette = config.palette
    const startColor = 'startColor' in palette ? palette.startColor : palette.color
    const endColor = 'endColor' in palette ? palette.endColor : palette.color

    const canvas = document.createElement('canvas')
    canvas.width = v.w
    canvas.height = v.h
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      const fallback = new THREE.Sprite(
        new THREE.SpriteMaterial({ transparent: true, depthWrite: false, depthTest: false }),
      )
      fallback.renderOrder = 1000
      this.sprite = fallback
      return
    }

    // Label brightness follows `isLight` (now interpreted as glowOn/off).
    const opacityScale = config.isLight ? 1.4 : 1
    const gradient = ctx.createLinearGradient(0, 0, v.w, v.h)
    gradient.addColorStop(0, toRgbaWithAlpha(startColor, v.fillA * opacityScale))
    gradient.addColorStop(1, toRgbaWithAlpha(endColor, v.fillB * opacityScale))

    ctx.clearRect(0, 0, v.w, v.h)
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.roundRect(v.inset, v.inset, v.w - v.inset * 2, v.h - v.inset * 2, v.radius)
    ctx.fill()

    ctx.strokeStyle = toRgbaWithAlpha(startColor, v.stroke * opacityScale)
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = startColor
    ctx.font = v.font
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(config.text, v.w / 2, v.h / 2 + 2)

    const texture = new THREE.CanvasTexture(canvas)
    // 不参与深度测试：避免被同组的恒星/行星球体遮挡；始终后绘于同一系统几何之上
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    })
    this.sprite = new THREE.Sprite(material)
    this.sprite.renderOrder = 1000
    this.sprite.scale.set(v.scaleX, v.scaleY, 1)
    this.sprite.position.set(0, v.posY, 0)
  }
}
