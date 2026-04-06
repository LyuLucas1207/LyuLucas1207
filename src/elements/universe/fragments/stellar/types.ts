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

/** 星系中心恒星供 `SceneInput` 射线命中时展示；不设则不写 `coreMesh.userData`（如银河中心 `coreStar`） */
export interface StellarCoreHoverConfig {
  systemName: string
  label: string
  /** 悬停缩放基准，写入 `coreMesh.userData`；默认 1 */
  baseScale: Nilable<number>  
  /** 初始悬停状态，`SceneInput` 运行中会改写；默认 false */
  hovered: Nilable<boolean>
}

/** 星系跟焦机位（`focusCamera`）；数值由 `StellarBuilder` 默认，不在 fragment 内读 `constants.ts` */
export interface StellarFocusCameraConfig {
  fov: number
  near: number
  far: number
  heightOffset: number
  /** 本地空间相机偏移 Z = `maxOrbitRadius * distanceZFactor` */
  distanceZFactor: number
  positionLerp: number
  yawLerp: number
  pitchLerp: number
  maxPitch: number
  /** 拖拽 pitch 累计夹紧（弧度），与 `CameraRig` 侧一致 */
  orbitPitchLimit: number
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
  coreHover: Nilable<StellarCoreHoverConfig>
  focusCamera: StellarFocusCameraConfig
}
