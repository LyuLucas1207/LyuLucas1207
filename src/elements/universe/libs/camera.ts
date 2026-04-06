import * as THREE from 'three'

import {
  UNIVERSE_CAMERA_DRIFT,
  UNIVERSE_CAMERA_LIMITS,
  UNIVERSE_MOTION,
  UNIVERSE_ROTATION_SPEED,
} from '../constants'
import type { SceneInput } from './input'

/** 与 `CameraRig` 共享的可变状态；跟焦结束时由 fragment `exitToMainCamera` 写回主相机 */
export type CameraRigMovement = {
  yaw: number
  pitch: number
  targetYaw: number
  targetPitch: number
  velocity: THREE.Vector3
  thrust: number
}

/**
 * 各 fragment 自建 `PerspectiveCamera`（恒星 / 行星 / 飞船追击等），由场景组装后交给 `CameraRig`。
 * 跟焦时每帧 `tick`；离开时 `exitToMainCamera` 把位姿同步到全局主相机。
 */
export interface UniverseFocusCamera {
  readonly camera: THREE.PerspectiveCamera
  readonly orbitPitchLimit: number
  resize(width: number, height: number): void
  tick(yawOffset: number, pitchOffset: number, movement: CameraRigMovement): void
  exitToMainCamera(main: THREE.PerspectiveCamera, movement: CameraRigMovement): void
}

export function clampCameraPosition(position: THREE.Vector3) {
  position.x = THREE.MathUtils.clamp(position.x, -UNIVERSE_CAMERA_LIMITS.x, UNIVERSE_CAMERA_LIMITS.x)
  position.y = THREE.MathUtils.clamp(position.y, UNIVERSE_CAMERA_LIMITS.yMin, UNIVERSE_CAMERA_LIMITS.yMax)
  position.z = THREE.MathUtils.clamp(position.z, -UNIVERSE_CAMERA_LIMITS.z, UNIVERSE_CAMERA_LIMITS.z)
}

/**
 * 名义机位：世界空间下从观察目标指向相机的偏移 `target → cam`（`camWorld = target + offset`）。
 * 返回轨道半径与基座 yaw/pitch（世界 Y 竖直、YXZ、无横滚，与全局主相机一致）。
 */
export function worldOrbitBaseFromOffsetTowardTarget(
  offsetX: number,
  offsetY: number,
  offsetZ: number,
): { dist: number; baseYaw: number; basePitch: number } {
  const dist = Math.hypot(offsetX, offsetY, offsetZ)
  if (dist < 1e-8) {
    return { dist: 1e-3, baseYaw: 0, basePitch: 0 }
  }
  const dx = -offsetX / dist
  const dy = -offsetY / dist
  const dz = -offsetZ / dist
  return {
    dist,
    baseYaw: Math.atan2(-dx, -dz),
    basePitch: Math.asin(THREE.MathUtils.clamp(dy, -1, 1)),
  }
}

export function unwrapYawNear(desiredYaw: number, refYaw: number): number {
  let y = desiredYaw
  const twoPi = Math.PI * 2
  while (y - refYaw > Math.PI) y -= twoPi
  while (y - refYaw < -Math.PI) y += twoPi
  return y
}

/** 世界 Y 竖直：相机 −Z 在世界中的单位方向（由 yaw/pitch 得到） */
export function worldYawPitchToCameraMinusZ(yaw: number, pitch: number, out: THREE.Vector3) {
  const cosP = Math.cos(pitch)
  out.set(-Math.sin(yaw) * cosP, Math.sin(pitch), -Math.cos(yaw) * cosP)
  return out
}

/**
 * 由**世界空间观察方向**（相机 −Z，即 `getWorldDirection`）写主相机：
 * 强制 **roll=0**、世界 Y 为竖直，与全局自由飞 `YXZ` 一致，避免跟焦相机父级旋转把主相机「拧斜」后变不回来。
 */
export function syncMainCameraWorldUpView(
  main: THREE.PerspectiveCamera,
  worldViewDir: THREE.Vector3,
  movement: CameraRigMovement,
) {
  const dir = worldViewDir
  const yaw = Math.atan2(-dir.x, -dir.z)
  const pitch = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1))
  main.rotation.order = 'YXZ'
  main.rotation.x = pitch
  main.rotation.y = yaw
  main.rotation.z = 0
  movement.yaw = yaw
  movement.pitch = pitch
  movement.targetYaw = yaw
  movement.targetPitch = pitch
}

const _parentWorldQuat = new THREE.Quaternion()
const _localFromWorldQuat = new THREE.Quaternion()

const _lookMat = new THREE.Matrix4()
const _lookDecompPos = new THREE.Vector3()
const _lookDecompScale = new THREE.Vector3()
const _lookQuat = new THREE.Quaternion()
const _worldUpForLookAt = new THREE.Vector3(0, 1, 0)

/**
 * 跟焦相机朝向：用世界 up=(0,1,0) 做 `lookAt`，消除 `setFromUnitVectors(−Z, dir)` 绕视线任意扭转带来的横滚，
 * 否则画面倾斜时鼠标「横拖 / 竖拖」在屏幕上会像斜向orbit。
 */
export function setLocalQuaternionFromWorldLookAt(
  object: THREE.Object3D,
  eyeWorld: THREE.Vector3,
  targetWorld: THREE.Vector3,
) {
  _lookMat.identity()
  _lookMat.lookAt(eyeWorld, targetWorld, _worldUpForLookAt)
  _lookMat.decompose(_lookDecompPos, _lookQuat, _lookDecompScale)
  setLocalQuaternionFromWorld(object, _lookQuat)
}

/** 子物体在父节点有旋转/缩放时，将世界空间朝向写成正确的 `object.quaternion`（本地） */
export function setLocalQuaternionFromWorld(object: THREE.Object3D, worldQuaternion: THREE.Quaternion) {
  const parent = object.parent
  if (!parent) {
    object.quaternion.copy(worldQuaternion)
    return
  }
  parent.updateWorldMatrix(true, false)
  parent.getWorldQuaternion(_parentWorldQuat)
  _localFromWorldQuat.copy(_parentWorldQuat).invert().multiply(worldQuaternion)
  object.quaternion.copy(_localFromWorldQuat)
}

/**
 * 全局自由飞行主相机 + 跟焦时切换到 fragment 提供的 `UniverseFocusCamera.camera`。
 * 星系 / 行星 / 飞船的具体机位与轨道在对应 fragment 的 `tick` 内完成。
 */
export class CameraRig {
  private readonly camera: THREE.PerspectiveCamera
  private readonly movement: CameraRigMovement

  private focus: UniverseFocusCamera | null = null
  private followingFocus = false
  private focusYawOffset = 0
  private focusPitchOffset = 0

  private readonly forward = new THREE.Vector3()
  private readonly strafe = new THREE.Vector3()
  private readonly worldUp = new THREE.Vector3(0, 1, 0)
  private readonly moveVector = new THREE.Vector3()

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera
    this.movement = {
      yaw: camera.rotation.y,
      pitch: camera.rotation.x,
      targetYaw: camera.rotation.y,
      targetPitch: camera.rotation.x,
      velocity: new THREE.Vector3(),
      thrust: 0,
    }
  }

  setFocus(target: UniverseFocusCamera | null) {
    if (this.focus && this.focus !== target) {
      this.focus.exitToMainCamera(this.camera, this.movement)
    }
    this.focus = target
    this.followingFocus = target !== null
    this.focusYawOffset = 0
    this.focusPitchOffset = 0
    if (target) {
      this.movement.velocity.set(0, 0, 0)
      this.movement.thrust = 0
    }
  }

  clearFocus() {
    if (this.focus) {
      this.focus.exitToMainCamera(this.camera, this.movement)
    }
    this.focus = null
    this.followingFocus = false
    this.focusYawOffset = 0
    this.focusPitchOffset = 0
  }

  getRenderCamera(): THREE.PerspectiveCamera {
    if (this.followingFocus && this.focus) {
      return this.focus.camera
    }
    return this.camera
  }

  resize(width: number, height: number) {
    const aspect = width / Math.max(height, 1)
    this.camera.aspect = aspect
    this.camera.updateProjectionMatrix()
    this.focus?.resize(width, height)
  }

  update(input: SceneInput, elapsed: number, options: { prefersReducedMotion: boolean; isLight: boolean }) {
    const { dx, dy } = input.consumeDragDelta()
    if (this.focus && this.followingFocus) {
      const k = 0.0024
      this.focusYawOffset -= dx * k
      this.focusPitchOffset -= dy * k
      const cap = this.focus.orbitPitchLimit
      this.focusPitchOffset = THREE.MathUtils.clamp(this.focusPitchOffset, -cap, cap)
    } else {
      this.movement.targetYaw -= dx * 0.0024
      this.movement.targetPitch -= dy * 0.0021
      this.movement.targetPitch = THREE.MathUtils.clamp(this.movement.targetPitch, -1.45, 1.45)
    }

    const wheelDelta = input.consumeWheelDelta()
    this.movement.thrust += THREE.MathUtils.clamp(
      wheelDelta * UNIVERSE_MOTION.wheelForce,
      -UNIVERSE_MOTION.wheelClamp,
      UNIVERSE_MOTION.wheelClamp,
    )

    if (this.focus && this.followingFocus) {
      this.focus.tick(this.focusYawOffset, this.focusPitchOffset, this.movement)
      this.movement.velocity.multiplyScalar(0.76)
      this.movement.thrust = 0
    } else {
      this.movement.yaw = THREE.MathUtils.lerp(this.movement.yaw, this.movement.targetYaw, UNIVERSE_MOTION.yawLerp)
      this.movement.pitch = THREE.MathUtils.lerp(
        this.movement.pitch,
        this.movement.targetPitch,
        UNIVERSE_MOTION.pitchLerp,
      )
      this.camera.rotation.order = 'YXZ'
      this.camera.rotation.y = this.movement.yaw
      this.camera.rotation.x = this.movement.pitch
      this.camera.rotation.z = 0

      this.camera.getWorldDirection(this.forward)
      this.strafe.crossVectors(this.forward, this.worldUp).normalize()
      this.moveVector.set(0, 0, 0)

      if (input.keys.forward) this.moveVector.add(this.forward)
      if (input.keys.backward) this.moveVector.addScaledVector(this.forward, -1)
      if (input.keys.left) this.moveVector.addScaledVector(this.strafe, -1)
      if (input.keys.right) this.moveVector.add(this.strafe)
      if (input.keys.up) this.moveVector.add(this.worldUp)
      if (input.keys.down) this.moveVector.addScaledVector(this.worldUp, -1)

      if (this.moveVector.lengthSq() > 0) {
        this.moveVector.normalize()
        this.movement.velocity.addScaledVector(this.moveVector, UNIVERSE_MOTION.keyAcceleration)
        this.movement.velocity.y += this.moveVector.y * UNIVERSE_MOTION.keyVerticalAcceleration
        this.movement.velocity.clampLength(0, UNIVERSE_MOTION.keyMaxSpeed)
      }

      this.movement.velocity.addScaledVector(this.forward, -this.movement.thrust * 0.014)
      this.movement.thrust *= UNIVERSE_MOTION.thrustDecay
      this.movement.velocity.multiplyScalar(UNIVERSE_MOTION.velocityDecay)
      this.camera.position.add(this.movement.velocity)
      clampCameraPosition(this.camera.position)
    }

    if (!options.prefersReducedMotion && !input.isDragging && !this.followingFocus) {
      this.movement.targetYaw += options.isLight
        ? UNIVERSE_ROTATION_SPEED.driftLight
        : UNIVERSE_ROTATION_SPEED.driftDark
      this.camera.position.x += Math.sin(elapsed * 0.16) * UNIVERSE_CAMERA_DRIFT.xAmplitude
      this.camera.position.y += Math.cos(elapsed * 0.13) * UNIVERSE_CAMERA_DRIFT.yAmplitude
      clampCameraPosition(this.camera.position)
    }
  }
}
