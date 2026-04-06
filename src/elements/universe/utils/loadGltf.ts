import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const loader = new GLTFLoader()
const sceneCache = new Map<string, Promise<THREE.Group>>()

export function loadGltfRoot(url: string): Promise<THREE.Group> {
  const hit = sceneCache.get(url)
  if (hit) return hit
  const promise = new Promise<THREE.Group>((resolve, reject) => {
    loader.load(
      url,
      (gltf) => resolve(gltf.scene),
      undefined,
      reject,
    )
  })
  sceneCache.set(url, promise)
  return promise
}

/** 将模型几何中心移到原点，并均匀缩放到直径约 `2 * targetRadius`。 */
export function scaleAndCenterModelToRadius(root: THREE.Object3D, targetRadius: number) {
  const box = new THREE.Box3().setFromObject(root)
  if (box.isEmpty()) return
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z, 1e-6)
  const s = (targetRadius * 2) / maxDim
  root.position.sub(center)
  root.scale.setScalar(s)
}
