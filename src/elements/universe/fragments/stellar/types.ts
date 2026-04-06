import type { GlowOnOff } from '../types'
import type { Nilable } from 'nfx-ui/types'

export interface StellarPalette {
  /** 恒星核心色 — 球体表面色 & 自发光色 */
  coreColor: string
  /** 外壳色 — ShaderMaterial uniform 颜色 */
  shellColor: string
  /** 外壳回退色 — 无 shader 时 BasicMaterial 的颜色 */
  shellFallbackColor: string
  /** 光晕色 — 光晕层材质颜色 */
  haloColor: string
  /** 关键光源色 — 主方向 PointLight 颜色 */
  keyLightColor: string
  /** 边缘光源色 — 轮廓补光 PointLight 颜色 */
  rimLightColor: string
}

export interface StellarLightConfig {
  intensity: GlowOnOff
  distance: number
  position: [number, number, number]
}

export interface StellarSurfaceConfig {
  roughness: number
  metalness: number
  clearcoat: number
  clearcoatRoughness: number
}

export interface StellarShellConfig {
  radius: number
  opacity: GlowOnOff
  ifanimate: boolean
}

export interface StellarHaloConfig {
  radius: number
  opacity: GlowOnOff
  ifanimate: boolean
}

export interface StellarShellShaders {
  vertex: string
  fragment: string
}

export interface StellarConfig {
  radius: number
  segments: number
  /** 核心（球/GLB）绕本地 Y 自转角速度，弧度/秒；`update` 内用 `elapsed * coreSpinSpeed` */
  coreSpinSpeed: number
  emissive: GlowOnOff
  palette: StellarPalette
  isLight: boolean
  surface: StellarSurfaceConfig
  /** 半透明外壳；`undefined` 时不创建外层球壳 */
  shell: Nilable<StellarShellConfig>
  keyLight: StellarLightConfig
  halo: Nilable<StellarHaloConfig>
  rimLight: Nilable<StellarLightConfig>
  shellShaders: Nilable<StellarShellShaders>
}
