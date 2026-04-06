import * as THREE from 'three'

import { scaleAndCenterModelToRadius } from '../../utils/loadGltf'
import type { Nullable } from 'nfx-ui/types'

import type { StarshipConfig, StarshipGlowConfig } from './types'

export type { StarshipChaseCamConfig, StarshipConfig, StarshipGlowConfig, StarshipPoseConfig } from './types'
export { StarshipBuilder } from './builder'

const scratch = {
  dir: new THREE.Vector3(),
  lookAt: new THREE.Vector3(),
  m: new THREE.Matrix4(),
  planarA: new THREE.Vector3(),
  planarB: new THREE.Vector3(),
  cross: new THREE.Vector3(),
  worldUp: new THREE.Vector3(),
}

/**
 * 航线飞船：与 `Planet` 同款两阶段 —— **`new Starship(config)`** 同步搭好 `group` / 追击相机 / 光，`attachGlbRoot` 再挂 GLB。
 * `group` → `attitude` → `bank` → **模型**；姿态与航线逻辑同前。
 */
export class Starship {
  readonly group: THREE.Group
  /** 机头朝向节点（与姿态 `attitude` 同一 Group） */
  readonly facing: THREE.Group
  /** 挂在 `attitude` 下，局部位姿由 `config.chaseCam` + `CameraRig` 拖拽增量决定 */
  readonly chaseCamera: THREE.PerspectiveCamera

  readonly modelRadius: number
  readonly cruiseSpeed: number
  readonly alongAcceleration: number
  readonly alongDeceleration: number
  /** 供 `CameraRig` 跟船拖拽 pitch 夹紧 */
  readonly chaseOrbitPitchLimit: number

  private readonly config: StarshipConfig
  private readonly attitude: THREE.Group
  private readonly bank: THREE.Group
  private readonly glowLight: THREE.PointLight
  private glbRoot: Nullable<THREE.Object3D> = null
  private mixer: Nullable<THREE.AnimationMixer> = null
  private readonly targetQuat = new THREE.Quaternion()
  /** 和弦线方向做指数趋近，避免换终点时机头/横滚一帧拧死 */
  private readonly smoothedFlightDir = new THREE.Vector3(0, 0, 1)
  private readonly lastPlanarDir = new THREE.Vector3(0, 0, 1)
  private readonly lastFlightDir = new THREE.Vector3(0, 0, 1)
  private bankAngle = 0
  private targetBank = 0

  constructor(config: StarshipConfig) {
    this.config = config
    this.modelRadius = config.modelRadius
    this.cruiseSpeed = config.cruiseSpeed
    this.alongAcceleration = config.alongAcceleration
    this.alongDeceleration = config.alongDeceleration
    this.chaseOrbitPitchLimit = config.chaseCam.orbitPitchLimit

    this.group = new THREE.Group()
    this.group.name = 'starship'
    this.attitude = new THREE.Group()
    this.facing = this.attitude
    this.bank = new THREE.Group()
    const ch = config.chaseCam
    this.chaseCamera = new THREE.PerspectiveCamera(ch.fov, 1, ch.near, ch.far)
    this.chaseCamera.name = 'starshipChaseCamera'
    this.chaseCamera.position.set(ch.localX, ch.localY, ch.localZ)
    this.chaseCamera.quaternion.identity()

    const g = config.glow
    this.glowLight = new THREE.PointLight(g.pointColor, g.pointIntensity, g.pointDistance, g.pointDecay)
    this.group.add(this.glowLight, this.attitude)
    this.attitude.add(this.chaseCamera, this.bank)
  }

  /**
   * 与 `Planet.attachGlbRoot` 同思路：传入 GLB 场景根（会先 `scaleAndCenterModelToRadius`）+ `gltf.animations` 对应轨。
   */
  attachGlbRoot(root: THREE.Object3D, clips: THREE.AnimationClip[]) {
    if (this.glbRoot) {
      this.bank.remove(this.glbRoot)
      Starship.disposeObject3DResources(this.glbRoot)
      this.glbRoot = null
    }
    this.mixer?.stopAllAction()
    this.mixer = null

    scaleAndCenterModelToRadius(root, this.config.modelRadius)
    const fix = this.config.pose
    root.rotation.order = 'YXZ'
    root.rotation.set(fix.modelPitchCorrection, fix.modelYawCorrection, fix.modelRollCorrection)
    Starship.applyEmissiveToVisual(root, this.config.glow)

    this.bank.add(root)
    this.glbRoot = root

    if (clips.length > 0) {
      this.mixer = new THREE.AnimationMixer(root)
      const clip = clips[0]!
      this.mixer.clipAction(clip).reset().play()
    }
  }

  private static disposeObject3DResources(obj: THREE.Object3D) {
    obj.traverse((child) => {
      const node = child as THREE.Mesh
      node.geometry?.dispose()
      const mats = node.material
      if (!mats) return
      const list = Array.isArray(mats) ? mats : [mats]
      list.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial & { map?: THREE.Texture | null }
        mat.map?.dispose()
        m.dispose()
      })
    })
  }

  private static applyEmissiveToVisual(root: THREE.Object3D, glow: StarshipGlowConfig) {
    const emissiveColor = new THREE.Color(glow.emissiveHex)
    const boost = glow.emissiveIntensity
    root.traverse((child) => {
      const mesh = child as THREE.Mesh
      const mat = mesh.material
      if (!mat) return

      const upgrade = (raw: THREE.Material): THREE.Material => {
        if (
          raw instanceof THREE.MeshStandardMaterial ||
          raw instanceof THREE.MeshPhysicalMaterial ||
          raw instanceof THREE.MeshLambertMaterial ||
          raw instanceof THREE.MeshPhongMaterial ||
          raw instanceof THREE.MeshToonMaterial
        ) {
          raw.fog = false
          if (raw.emissiveMap) {
            raw.emissive.set(0xffffff)
          } else {
            raw.emissive.copy(emissiveColor)
          }
          raw.emissiveIntensity = Math.max(raw.emissiveIntensity, boost)
          return raw
        }

        if (raw instanceof THREE.MeshBasicMaterial) {
          const next = new THREE.MeshStandardMaterial({
            map: raw.map,
            lightMap: raw.lightMap,
            aoMap: raw.aoMap,
            vertexColors: raw.vertexColors,
            color: raw.color.clone(),
            emissive: emissiveColor.clone(),
            emissiveIntensity: boost,
            roughness: 0.55,
            metalness: 0.12,
            fog: false,
            transparent: raw.transparent,
            opacity: raw.opacity,
            side: raw.side,
            alphaMap: raw.alphaMap,
            depthWrite: raw.depthWrite,
            depthTest: raw.depthTest,
          })
          raw.dispose()
          return next
        }

        return raw
      }

      if (Array.isArray(mat)) {
        mesh.material = mat.map((m) => upgrade(m))
      } else {
        mesh.material = upgrade(mat)
      }
    })
  }

  /**
   * 沿弦线飞行：机头对齐 **当前位置 → chordEnd**（永远指向目的地），根据水平面转向速率叠加横滚。
   */
  updateFlightChord(worldPos: THREE.Vector3, chordEnd: THREE.Vector3, delta: number) {
    this.group.position.copy(worldPos)
    scratch.dir.subVectors(chordEnd, worldPos)
    if (scratch.dir.lengthSq() > 1e-10) {
      scratch.dir.normalize()
      this.lastFlightDir.copy(scratch.dir)
    } else {
      scratch.dir.copy(this.lastFlightDir)
    }
    this.applyFacingAndBank(scratch.dir, delta)
    if (this.group.visible) {
      this.mixer?.update(delta)
    }
  }

  /** 停在端点：朝向 `lookTarget`（通常为终点行星中心），仍做姿态平滑与动画。 */
  updateParked(worldPos: THREE.Vector3, lookTarget: THREE.Vector3, delta: number) {
    this.group.position.copy(worldPos)
    scratch.dir.subVectors(lookTarget, worldPos)
    if (scratch.dir.lengthSq() > 1e-10) {
      scratch.dir.normalize()
      this.lastFlightDir.copy(scratch.dir)
    } else {
      scratch.dir.copy(this.lastFlightDir)
    }
    this.applyFacingAndBank(scratch.dir, delta)
    if (this.group.visible) {
      this.mixer?.update(delta)
    }
  }

  private applyFacingAndBank(dir: THREE.Vector3, delta: number) {
    const { headingSlerp, bankSlerp, maxBank, bankGain, worldUp: wu } = this.config.pose
    const ht = 1 - Math.exp(-delta * headingSlerp)
    if (dir.lengthSq() > 1e-10) {
      this.smoothedFlightDir.lerp(dir, ht)
      if (this.smoothedFlightDir.lengthSq() > 1e-10) {
        this.smoothedFlightDir.normalize()
      } else {
        this.smoothedFlightDir.copy(dir)
      }
    }

    scratch.worldUp.set(wu[0], wu[1], wu[2])

    scratch.lookAt.copy(this.group.position).add(this.smoothedFlightDir)
    scratch.m.lookAt(this.group.position, scratch.lookAt, scratch.worldUp)
    this.targetQuat.setFromRotationMatrix(scratch.m)
    this.attitude.quaternion.copy(this.targetQuat)

    scratch.planarA.copy(this.smoothedFlightDir)
    scratch.planarA.y = 0
    if (scratch.planarA.lengthSq() < 1e-8) {
      this.targetBank = THREE.MathUtils.lerp(this.targetBank, 0, 1 - Math.exp(-delta * bankSlerp))
    } else {
      scratch.planarA.normalize()
      scratch.cross.crossVectors(this.lastPlanarDir, scratch.planarA)
      const turn = scratch.cross.y
      this.targetBank = THREE.MathUtils.clamp(-turn * bankGain, -maxBank, maxBank)
      this.lastPlanarDir.copy(scratch.planarA)
    }

    const tB = 1 - Math.exp(-delta * bankSlerp)
    this.bankAngle = THREE.MathUtils.lerp(this.bankAngle, this.targetBank, tB)
    this.bank.rotation.z = this.bankAngle
  }

  resizeChaseCamera(width: number, height: number) {
    this.chaseCamera.aspect = width / Math.max(height, 1)
    this.chaseCamera.updateProjectionMatrix()
  }

  dispose() {
    this.mixer?.stopAllAction()
    this.mixer = null
    if (this.glbRoot) {
      this.bank.remove(this.glbRoot)
      Starship.disposeObject3DResources(this.glbRoot)
      this.glbRoot = null
    }
  }
}
