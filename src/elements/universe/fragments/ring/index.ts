import * as THREE from 'three'

import { pickColor } from 'nfx-ui/utils'
import { Fragment } from '../../libs/fragment'
import type { RingConfig } from './types'

export type { RingConfig, RingPalette } from './types'
export { RingBuilder } from './builder'

/**
 * 径向条带图：贴图 **水平方向** = 单环带内从内半径到外半径（一张横条扫一圈）。
 * **竖直方向** 在周向重复 `circumRepeat` 次走完 360°（绕行星「旋转重复」铺满）。
 */
function remapRingRadialStripUVs(
  geometry: THREE.BufferGeometry,
  bandInner: number,
  bandOuter: number,
  circumRepeat: number,
) {
  const pos = geometry.getAttribute('position')
  const uvAttr = geometry.getAttribute('uv')
  if (!(pos instanceof THREE.BufferAttribute) || !(uvAttr instanceof THREE.BufferAttribute)) return
  const rSpan = bandOuter - bandInner

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const r = Math.sqrt(x * x + y * y)
    const theta = Math.atan2(y, x)
    const u = rSpan > 1e-6 ? Math.min(1, Math.max(0, (r - bandInner) / rSpan)) : 0.5
    const v = ((theta + Math.PI) / (Math.PI * 2)) * circumRepeat
    uvAttr.setXY(i, u, v)
  }
  uvAttr.needsUpdate = true
}

export class Ring extends Fragment {
  readonly group: THREE.Group

  private readonly bands: {
    mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
    bandColor: THREE.Color
  }[] = []
  private readonly isLight: boolean
  private readonly circumRepeat: number

  /** 同心环带数 */
  get bandCount() {
    return this.bands.length
  }

  get root() {
    return this.group
  }

  constructor(config: RingConfig) {
    super()
    this.group = new THREE.Group()
    this.isLight = config.isLight
    this.circumRepeat = 10 + Math.floor(Math.random() * 12)

    const gaps: boolean[] = []
    for (let i = 0; i < config.ringNumber - 1; i++) {
      gaps.push(config.randomGap ? Math.random() > 0.5 : true)
    }

    const activeGapCount = gaps.filter(Boolean).length
    const totalSpan = config.outerRadius - config.innerRadius
    const totalGap = config.gap * activeGapCount
    const bandSpan = (totalSpan - totalGap) / config.ringNumber
    const baseColor = new THREE.Color(pickColor(config.palette.bandColorPool))
    const thetaSegments = Math.max(48, config.segments)
    const phiSegments = 2

    let cursor = config.innerRadius
    for (let i = 0; i < config.ringNumber; i++) {
      const inner = cursor
      const outer = inner + bandSpan
      const jitter = (Math.random() * 2 - 1) * config.gapJitter
      cursor = outer + (i < gaps.length && gaps[i] ? Math.max(0, config.gap + jitter) : 0)

      const bandColor = baseColor.clone().offsetHSL(i * 0.06, 0, (i % 2 === 0 ? 0.04 : -0.04))

      const geometry = new THREE.RingGeometry(inner, outer, thetaSegments, phiSegments)
      remapRingRadialStripUVs(geometry, inner, outer, this.circumRepeat)
      geometry.computeVertexNormals()

      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color: bandColor,
          emissive: bandColor,
          emissiveIntensity: config.isLight ? 1.55 : 1.2,
          side: THREE.DoubleSide,
          roughness: 0.55,
          metalness: 0.08,
        }),
      )
      mesh.rotation.x = -Math.PI / 2
      this.bands.push({ mesh, bandColor })
      this.group.add(mesh)
    }

    this.group.rotation.set(...config.rotation)
  }

  /** 横条图 + 与原先一致的主题色自发光（emissive × emissiveMap × intensity） */
  applyRadialStripMap(map: THREE.Texture) {
    const emissiveIntensity = this.isLight ? 2.6 : 2.15
    for (const { mesh, bandColor } of this.bands) {
      mesh.material.dispose()
      mesh.material = new THREE.MeshStandardMaterial({
        map,
        emissiveMap: map,
        emissive: bandColor,
        emissiveIntensity,
        transparent: true,
        alphaTest: 0.02,
        depthWrite: false,
        side: THREE.DoubleSide,
        color: 0xffffff,
        roughness: 0.82,
        metalness: 0.04,
      })
    }
  }
}
