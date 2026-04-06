import * as THREE from 'three'

/** `BufferGeometry` 上具名属性；仅当为 `BufferAttribute` 时返回（避免 `as`）。 */
export function getBufferAttribute(
  geometry: THREE.BufferGeometry,
  name: string,
): THREE.BufferAttribute | null {
  const attr = geometry.getAttribute(name)
  return attr instanceof THREE.BufferAttribute ? attr : null
}
