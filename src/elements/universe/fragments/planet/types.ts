import type { Nilable } from 'nfx-ui/types'

import type { GlowOnOff } from '../types'

export interface PlanetPalette {
  /** 行星表面候选色池 — 未指定 accent 时随机选取 */
  surfaceColorPool: string[]
}

export interface PlanetSurfaceConfig {
  roughness: number
  metalness: number
  emissive: GlowOnOff
}

/** 透明碰撞球 `mesh` 上供 `SceneInput` / 相机跟焦使用的字段 */
export interface PlanetPickConfig {
  planetId: string
  systemName: string
  label: string
  action: () => void
  baseScale?: number
  hovered?: boolean
}

export interface PlanetConfig {
  planetRadius: number
  segments: number
  /** 绕本地 Y 自转角速度，弧度/秒 */
  spinSpeed: number
  palette: PlanetPalette
  isLight: boolean
  surface: PlanetSurfaceConfig
  /** 星系场景传入；不设则不为碰撞体写交互字段（仅 `planetRadius` / `planetBody` 仍会写入） */
  pick: Nilable<PlanetPickConfig>
}
