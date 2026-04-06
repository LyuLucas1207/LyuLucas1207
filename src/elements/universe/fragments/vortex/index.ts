import * as THREE from 'three'

import type { Nullable } from 'nfx-ui/types'
import { pickColor, randomBetween } from 'nfx-ui/utils'
import { buildStarMaterial } from '../../utils/material'
import { getBufferAttribute } from '../../utils/threeAttributes'
import { Fragment } from '../../libs/fragment'
import type { VortexConfig } from './types'

export type { VortexConfig, VortexPalette, VortexShaders } from './types'
export { VortexBuilder } from './builder'

// 螺旋盘面：距中心距离 r_disk(u) = R_QUAD·u² + R_LINEAR·u（u 为母线参数 0→1）
const VORTEX_SPIRAL_R_QUAD = 248
const VORTEX_SPIRAL_R_LINEAR = 18

/**
 * 圆锥 + 螺旋：先定圆锥（底面半径 R₀），再沿母线撒点。
 * 几何：底面半径 R₀；母线参数 u∈[0,1]，圆锥横截面半径 R_cone(u) = R₀·(1−u)（越靠近锥尖越小，至 0）。
 */
type SpiralConeModel = {
  /** 圆锥底面半径 R₀（u=0 时横截面最大） */
  coneBaseRadius: number
  radialExp: number
  baseLinearBlend: number
  spiralAngleScale: number
  verticalWiggleScale: number
  verticalWiggleFreq: number
  radialJitterMax: number
  angleJitterBase: number
  verticalJitterBase: number
}

function buildSpiralConeModel(config: VortexConfig): SpiralConeModel {
  return {
    coneBaseRadius: config.coneBaseRadius,
    radialExp: 1.52,
    baseLinearBlend: 0.28,
    spiralAngleScale: 11.4,
    verticalWiggleScale: 2.4,
    verticalWiggleFreq: 9.5,
    radialJitterMax: 2.8,
    angleJitterBase: 0.1,
    verticalJitterBase: 1.6,
  }
}

/** 盘面上距中心距离（螺旋臂随 u 向外展开） */
function diskRadiusFromU(u: number): number {
  return u * u * VORTEX_SPIRAL_R_QUAD + u * VORTEX_SPIRAL_R_LINEAR
}

/**
 * 圆锥横截面半径：先给定底面半径 R₀，再沿母线递减，u=1 时为锥尖 0。
 * R_cone(u) = R₀ · (1 − u)
 */
function coneCrossSectionRadius(u: number, coneBaseRadius: number): number {
  return Math.max(0, coneBaseRadius * (1 - u))
}

function coneProgressFromLinear(linear: number, model: SpiralConeModel): number {
  const { radialExp: exp, baseLinearBlend: blend } = model
  return Math.min(1, (1 - blend) * Math.pow(linear, exp) + blend * linear)
}

/** 归一化锥面收窄（0→1），用于与原先扰动系数相乘：等价于 (1−u) */
function coneWidthNormalized(u: number, coneBaseRadius: number): number {
  if (coneBaseRadius <= 1e-6) return 0
  return coneCrossSectionRadius(u, coneBaseRadius) / coneBaseRadius
}

/**
 * 螺旋管状体内部一点：t 沿臂、截面圆盘 (α, ρ)。
 * ρ 用 √rand 使圆盘内近似均匀。
 */
function spiralProfileVolumePoint(
  t: number,
  alpha: number,
  rhoRel: number,
  R0: number,
  model: Nullable<SpiralConeModel>,
  arm: number,
  armCount: number,
): { x: number; y: number; z: number } {
  const fr = spiralProfileFrame(t, model, arm, armCount)
  const sr = profileSectionRadius(t, R0, model)
  const rho = rhoRel * sr
  const cp = Math.cos(alpha)
  const sp = Math.sin(alpha)
  return {
    x: fr.cx + rho * (cp * fr.nx + sp * fr.bx),
    y: fr.cy + rho * (cp * fr.ny + sp * fr.by),
    z: fr.cz + rho * (cp * fr.nz + sp * fr.bz),
  }
}

function sampleParticleInSpiralTube(
  linear: number,
  arm: number,
  armCount: number,
  R0: number,
  model: Nullable<SpiralConeModel>,
): { x: number; y: number; z: number } {
  const t = Math.min(1 - 1e-4, Math.max(1e-4, linear))
  const alpha = randomBetween(0, Math.PI * 2)
  const rhoRel = Math.sqrt(Math.random())
  let p = spiralProfileVolumePoint(t, alpha, rhoRel, R0, model, arm, armCount)
  if (model) {
    const u = spiralProfileU(t, model)
    const w = coneWidthNormalized(u, R0)
    const vy =
      Math.sin(u * model.verticalWiggleFreq + arm) * model.verticalWiggleScale * 0.35 +
      randomBetween(-model.verticalJitterBase, model.verticalJitterBase) * 0.35 * Math.max(w, 0.08)
    p = { x: p.x, y: p.y + vy, z: p.z }
  } else {
    const vy =
      Math.sin(linear * 9.5 + arm) * 2.4 * 0.35 + randomBetween(-1.6, 1.6) * 0.35
    p = { x: p.x, y: p.y + vy, z: p.z }
  }
  return p
}

/** legacy 圆柱模式与粒子角向：φ ≈ u · spiralAngleScale */
const VORTEX_PROFILE_SPIRAL_TURN = 11.4

/** 沿臂线参数 t∈[0,1] 映射到锥面进度 u（与粒子一致） */
function spiralProfileU(t: number, model: Nullable<SpiralConeModel>): number {
  if (model) return coneProgressFromLinear(t, model)
  return t
}

/** 螺旋中心线：r_disk(u)、θ=u·spiralScale+臂相位 — 与粒子同一盘面路径 */
function spiralCenterOnDisk(
  t: number,
  model: Nullable<SpiralConeModel>,
  arm: number,
  armCount: number,
): { x: number; y: number; z: number } {
  const u = spiralProfileU(t, model)
  const rDisk = diskRadiusFromU(u)
  const spiralScale = model ? model.spiralAngleScale : VORTEX_PROFILE_SPIRAL_TURN
  const theta = u * spiralScale + (Math.PI * 2 * arm) / armCount
  return {
    x: Math.cos(theta) * rDisk,
    y: 0,
    z: Math.sin(theta) * rDisk,
  }
}

function profileSectionRadius(t: number, R0: number, model: Nullable<SpiralConeModel>): number {
  if (model) {
    const u = spiralProfileU(t, model)
    return coneCrossSectionRadius(u, R0)
  }
  return R0
}

/**
 * 切向 T、截面基向量 N,B（N = ŷ×T，B = T×N），截面垂直于螺旋前进方向。
 */
function spiralProfileFrame(
  t: number,
  model: Nullable<SpiralConeModel>,
  arm: number,
  armCount: number,
): {
  cx: number
  cy: number
  cz: number
  nx: number
  ny: number
  nz: number
  bx: number
  by: number
  bz: number
} {
  const eps = 2e-5
  const c = spiralCenterOnDisk(t, model, arm, armCount)
  const tA = Math.max(0, t - eps)
  const tB = Math.min(1, t + eps)
  let c0 = spiralCenterOnDisk(tA, model, arm, armCount)
  let c1 = spiralCenterOnDisk(tB, model, arm, armCount)
  let Tx = c1.x - c0.x
  let Ty = c1.y - c0.y
  let Tz = c1.z - c0.z
  if (Math.abs(tB - tA) < 1e-12) {
    c1 = spiralCenterOnDisk(Math.min(1, t + 1e-4), model, arm, armCount)
    Tx = c1.x - c.x
    Ty = c1.y - c.y
    Tz = c1.z - c.z
  }
  let len = Math.hypot(Tx, Ty, Tz) || 1
  Tx /= len
  Ty /= len
  Tz /= len

  let Nx = Tz
  let Ny = 0
  let Nz = -Tx
  len = Math.hypot(Nx, Ny, Nz) || 1
  Nx /= len
  Nz /= len

  const Bx = Ty * Nz - Tz * Ny
  const By = Tz * Nx - Tx * Nz
  const Bz = Tx * Ny - Ty * Nx
  len = Math.hypot(Bx, By, Bz) || 1

  return {
    cx: c.x,
    cy: c.y,
    cz: c.z,
    nx: Nx,
    ny: Ny,
    nz: Nz,
    bx: Bx / len,
    by: By / len,
    bz: Bz / len,
  }
}

export class Vortex extends Fragment {
  readonly points: THREE.Points
  readonly material: THREE.ShaderMaterial
  private baseY: Nullable<Float32Array> = null
  private phases: Nullable<Float32Array> = null
  private animated: boolean
  private offset: number

  get root() {
    return this.points
  }

  constructor(config: VortexConfig) {
    super()
    const count = config.particleCount
    const geometry = this.buildGeometry(count, config)

    this.material = buildStarMaterial(
      config.baseSize,
      config.opacity,
      config.isLight,
      config.shaders.vertex,
      config.shaders.fragment,
    )
    this.points = new THREE.Points(geometry, this.material)
    this.animated = config.ifanimate
    this.offset = config.animateOffset

    if (this.animated) {
      const pos = getBufferAttribute(geometry, 'position')
      if (pos) {
        this.baseY = new Float32Array(count)
        this.phases = new Float32Array(count)
        for (let i = 0; i < count; i++) {
          this.baseY[i] = pos.getY(i)
          this.phases[i] = randomBetween(0, Math.PI * 2)
        }
      } else {
        this.animated = false
      }
    }
  }

  update(elapsed: number) {
    if (!this.animated || !this.baseY || !this.phases) return

    const pos = getBufferAttribute(this.points.geometry, 'position')
    if (!pos) return
    for (let i = 0; i < this.baseY.length; i++) {
      pos.setY(i, this.baseY[i] + Math.sin(elapsed * 0.6 + this.phases[i]) * this.offset)
    }
    pos.needsUpdate = true
  }

  private buildGeometry(count: number, config: VortexConfig) {
    const positions = new Float32Array(count * 3)
    const tint = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)
    const depths = new Float32Array(count)

    const coneModel = config.denseAtCore ? buildSpiralConeModel(config) : null
    const R0 = config.coneBaseRadius

    for (let index = 0; index < count; index++) {
      const linear = count > 1 ? index / (count - 1) : 0
      const arm = index % config.armCount
      const color = new THREE.Color(pickColor(config.palette.particleColorPool))
      const stride = index * 3

      const p = sampleParticleInSpiralTube(linear, arm, config.armCount, R0, coneModel)
      positions[stride] = p.x
      positions[stride + 1] = p.y
      positions[stride + 2] = p.z

      tint[stride] = color.r
      tint[stride + 1] = color.g
      tint[stride + 2] = color.b
      sizes[index] = randomBetween(config.isLight ? 2.2 : 1.1, config.isLight ? 6.2 : 3.4)
      phases[index] = randomBetween(0.5, 2.2)
      depths[index] = randomBetween(0.9, 1.3)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(tint, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    geometry.setAttribute('aDepth', new THREE.BufferAttribute(depths, 1))
    return geometry
  }
}
