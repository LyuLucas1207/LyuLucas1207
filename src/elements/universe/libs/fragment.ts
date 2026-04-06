import * as THREE from 'three'

/** 宇宙场景里可挂到 `Scene` 的片段基类（统一 `root`、位移、`userData` 等） */
export abstract class Fragment {
  abstract readonly root: THREE.Object3D

  /** 默认与 `root.userData` 同引用；子类若把交互写在子节点上可重写 */
  get userData() {
    return this.root.userData
  }

  /** 浅合并进 `root.userData`；`Planet` / `Stellar` 重写为写碰撞体 */
  mergeUserData(patch: Record<string, unknown>) {
    Object.assign(this.root.userData, patch)
  }

  /** 覆盖 `root.userData` */
  setUserData(data: Record<string, unknown>) {
    const ud = this.root.userData
    for (const k of Object.keys({ ...ud })) {
      delete ud[k]
    }
    Object.assign(ud, data)
  }

  setPosition(x: number, y: number, z: number) {
    this.root.position.set(x, y, z)
  }

  positionCopy(v: THREE.Vector3) {
    this.root.position.copy(v)
  }

  attach(parent: THREE.Object3D) {
    parent.add(this.root)
  }

  detachFromParent() {
    this.root.removeFromParent()
  }
}
