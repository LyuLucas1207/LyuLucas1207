import * as THREE from 'three'

export type GroupOptions = {
  /** `Object3D.name`，调试与编辑器里辨识（必填） */
  name: string
  /** 合并进 `userData`（浅合并） */
  userData?: Record<string, unknown>
}

/**
 * 对 `THREE.Group` 的薄封装：创建时 **必须** 带 `name`，可选初值 `userData`。
 * 可当作 `THREE.Group` 使用（继承关系不变）。
 */
export class Group extends THREE.Group {
  constructor(options: GroupOptions) {
    super()
    this.name = options.name
    if (options.userData) {
      Object.assign(this.userData, options.userData)
    }
  }
}
