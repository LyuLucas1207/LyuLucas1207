import * as THREE from 'three'

/** 释放材质上的 `map`（若存在）；用 `in` 收窄，避免对 `Material` 做无意义交叉类型断言。 */
export function disposeMaterialMap(material: THREE.Material): void {
  const map = 'map' in material ? material.map : undefined
  if (map instanceof THREE.Texture) {
    map.dispose()
  }
}

/** 释放一组材质及其 `map`。 */
export function disposeMaterials(material: THREE.Material | THREE.Material[] | undefined): void {
  if (!material) return
  const list = Array.isArray(material) ? material : [material]
  for (const m of list) {
    disposeMaterialMap(m)
    m.dispose()
  }
}

/**
 * 深度遍历并释放几何、材质（含常见 `map`）。
 * 用 `instanceof` 识别可挂几何/材质的对象，避免把 `Object3D` 断言成 `Mesh`。
 */
export function disposeObject3DSubtree(obj: THREE.Object3D): void {
  obj.traverse((child) => {
    if (
      child instanceof THREE.Mesh ||
      child instanceof THREE.Line ||
      child instanceof THREE.LineSegments ||
      child instanceof THREE.LineLoop ||
      child instanceof THREE.Points
    ) {
      child.geometry.dispose()
      disposeMaterials(child.material)
    } else if (child instanceof THREE.Sprite) {
      disposeMaterials(child.material)
    }
  })
}
