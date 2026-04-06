import * as THREE from 'three'

/** 宇宙场景里可挂到 `Scene` 的片段基类（统一 `root`、位移、`userData` 等） */
export abstract class Fragment {
  abstract readonly root: THREE.Object3D

  /**
   * 交互/射线命中的 `userData` 载体；默认即 `root`。
   * `Stellar` / `Planet` 等若写在子节点（`coreMesh` / 碰撞 `mesh`）上则重写为返回该节点。
   */
  protected get userDataTarget(): THREE.Object3D {
    return this.root
  }

  get userData() {
    return this.userDataTarget.userData
  }

  mergeUserData(patch: Record<string, unknown>) {
    Object.assign(this.userDataTarget.userData, patch)
  }

  setUserData(data: Record<string, unknown>) {
    const ud = this.userDataTarget.userData
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
