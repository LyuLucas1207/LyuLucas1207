import * as THREE from 'three'

import { pickColor } from 'nfx-ui/utils'
import type { RingAlbedoMaps, RingConfig } from './types'

export type { RingAlbedoMaps, RingConfig, RingPalette } from './types'
export { RingBuilder } from './builder'

/**
 * 俯视图「整张贴图铺在 2R×2R 正方上再裁环」：与极坐标 θ–r 无关，无周向接缝、无沿圈拉伸。
 * 顶点在环局部 XY 上 (RingGeometry)，u = x/(2R)+0.5，v = y/(2R)+0.5；R 取整条环外半径，多环带共用同一贴图坐标系。
 */
function remapRingGeometryPlanarSheetUVs(geometry: THREE.BufferGeometry, sheetHalfExtent: number) {
  const pos = geometry.attributes.position
  const uvAttr = geometry.attributes.uv as THREE.BufferAttribute
  const R = Math.max(sheetHalfExtent, 1e-6)
  const inv = 1 / (2 * R)

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    uvAttr.setXY(i, x * inv + 0.5, y * inv + 0.5)
  }
  uvAttr.needsUpdate = true
}

export class Ring {
  readonly group: THREE.Group

  private readonly bands: { mesh: THREE.Mesh; color: THREE.Color }[] = []
  private readonly isLight: boolean

  /** 同心环带数量（与 `ringNumber` 一致） */
  get bandCount() {
    return this.bands.length
  }

  constructor(config: RingConfig) {
    this.group = new THREE.Group()
    this.isLight = config.isLight

    const gaps: boolean[] = []
    for (let i = 0; i < config.ringNumber - 1; i++) {
      gaps.push(config.randomGap ? Math.random() > 0.5 : true)
    }

    const activeGapCount = gaps.filter(Boolean).length
    const totalSpan = config.outerRadius - config.innerRadius
    const totalGap = config.gap * activeGapCount
    const bandSpan = (totalSpan - totalGap) / config.ringNumber
    const baseColor = new THREE.Color(pickColor(config.palette.bandColorPool))
    const thetaSegments = Math.max(3, config.segments)
    const phiSegments = 2

    let cursor = config.innerRadius
    for (let i = 0; i < config.ringNumber; i++) {
      const inner = cursor
      const outer = inner + bandSpan
      const jitter = (Math.random() * 2 - 1) * config.gapJitter
      cursor = outer + (i < gaps.length && gaps[i] ? Math.max(0, config.gap + jitter) : 0)

      const bandColor = baseColor.clone().offsetHSL(i * 0.06, 0, (i % 2 === 0 ? 0.04 : -0.04))

      const geometry = new THREE.RingGeometry(inner, outer, thetaSegments, phiSegments)
      remapRingGeometryPlanarSheetUVs(geometry, config.outerRadius)
      geometry.computeVertexNormals()

      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color: bandColor,
          emissive: bandColor,
          // `isLight` means `glowOn`: glow on should be stronger.
          emissiveIntensity: config.isLight ? 0.6 : 0.4,
          side: THREE.DoubleSide,
          roughness: 0.5,
          metalness: 0.1,
        }),
      )
      // RingGeometry 在 XY 平面生成，转到与原先 Lathe 一致的 XZ「盘面」朝 ±Y
      mesh.rotation.x = -Math.PI / 2
      this.bands.push({ mesh, color: bandColor })
      this.group.add(mesh)
    }

    this.group.rotation.set(...config.rotation)
  }

  private buildTexturedRingMaterial(maps: RingAlbedoMaps) {
    return new THREE.MeshStandardMaterial({
      map: maps.map,
      emissiveMap: maps.map,
      emissive: 0xffffff,
      emissiveIntensity: this.isLight ? 0.35 : 0.45,
      roughnessMap: maps.roughnessMap,
      roughness: 1,
      bumpMap: maps.bumpMap,
      bumpScale: 0.05,
      alphaMap: maps.alphaMap,
      alphaTest: 0.12,
      transparent: false,
      depthWrite: true,
      metalness: 0.06,
      side: THREE.DoubleSide,
      color: 0xffffff,
    })
  }

  /** 所有环带共用同一套贴图 */
  applyAlbedoMaps(maps: RingAlbedoMaps) {
    for (const { mesh } of this.bands) {
      const oldMat = mesh.material as THREE.MeshStandardMaterial
      oldMat.dispose()
      mesh.material = this.buildTexturedRingMaterial(maps)
    }
  }

  /** 每层环带各自一套贴图（长度须等于 `bandCount`） */
  applyAlbedoMapsPerBand(mapsList: RingAlbedoMaps[]) {
    if (mapsList.length !== this.bands.length) {
      console.warn('[universe] ring texture band count mismatch', mapsList.length, this.bands.length)
      return
    }
    this.bands.forEach(({ mesh }, i) => {
      const oldMat = mesh.material as THREE.MeshStandardMaterial
      oldMat.dispose()
      mesh.material = this.buildTexturedRingMaterial(mapsList[i]!)
    })
  }
}
