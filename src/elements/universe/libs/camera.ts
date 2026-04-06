import * as THREE from 'three'

import type { Nilable } from 'nfx-ui/types'

import {
  UNIVERSE_CAMERA_DRIFT,
  UNIVERSE_CAMERA_LIMITS,
  UNIVERSE_MOTION,
  UNIVERSE_PLANET_FOCUS,
  UNIVERSE_ROTATION_SPEED,
  UNIVERSE_SYSTEM_FOCUS,
} from '../constants'
import type { SceneInput } from './input'

export interface CameraFocusTarget {
  group: THREE.Group
  maxOrbitRadius: number
  /** 若设置，观察目标与相机偏移相对于该物体（如行星 `body`），否则相对 `group`（星系锚点）。 */
  follow?: THREE.Object3D
  /** 与 `follow` 配套，用于计算相机距离（通常取行星半径）。 */
  followFrameRadius?: number
}

export interface CameraUpdateOptions {
  prefersReducedMotion: boolean
  isLight: boolean
}

export class CameraRig {
  onFocusSystemChange?: (systemId?: string) => void

  private readonly camera: THREE.PerspectiveCamera
  private readonly movement: {
    yaw: number
    pitch: number
    targetYaw: number
    targetPitch: number
    velocity: THREE.Vector3
    thrust: number
  }

  private focusTarget: Nilable<CameraFocusTarget> = null
  private followingFocus = false
  /** 跟焦时在「朝向目标」基础上的额外 yaw/pitch（拖拽写这里，避免被每帧基准朝向覆盖） */
  private focusYawOffset = 0
  private focusPitchOffset = 0

  private readonly forward = new THREE.Vector3()
  private readonly strafe = new THREE.Vector3()
  private readonly worldUp = new THREE.Vector3(0, 1, 0)
  private readonly moveVector = new THREE.Vector3()
  private readonly desiredPosition = new THREE.Vector3()
  private readonly lookTarget = new THREE.Vector3()
  private readonly focusOffset = new THREE.Vector3()

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

  setFocus(target: Nilable<CameraFocusTarget>) {
    this.focusTarget = target
    this.followingFocus = target !== null
    this.focusYawOffset = 0
    this.focusPitchOffset = 0
    if (target) {
      this.movement.velocity.set(0, 0, 0)
      this.movement.thrust = 0
      this.onFocusSystemChange?.(target.group.userData.systemId as string | undefined)
    }
  }

  clearFocus() {
    this.focusTarget = null
    this.followingFocus = false
    this.focusYawOffset = 0
    this.focusPitchOffset = 0
    this.onFocusSystemChange?.(undefined)
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / Math.max(height, 1)
    this.camera.updateProjectionMatrix()
  }

  update(input: SceneInput, elapsed: number, options: CameraUpdateOptions) {
    const { dx, dy } = input.consumeDragDelta()
    if (this.focusTarget && this.followingFocus) {
      this.focusYawOffset -= dx * 0.0024
      this.focusPitchOffset -= dy * 0.0021
      this.focusPitchOffset = THREE.MathUtils.clamp(this.focusPitchOffset, -0.95, 0.95)
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

    if (this.focusTarget && this.followingFocus) {
      const follow = this.focusTarget.follow
      const planetFollow = follow != null
      const anchor = planetFollow ? follow : this.focusTarget.group
      const frameR = planetFollow
        ? (this.focusTarget.followFrameRadius ?? this.focusTarget.maxOrbitRadius)
        : this.focusTarget.maxOrbitRadius
      const cam = planetFollow ? UNIVERSE_PLANET_FOCUS : UNIVERSE_SYSTEM_FOCUS
      anchor.getWorldPosition(this.lookTarget)
      this.focusOffset.set(0, cam.heightOffset, frameR * 1.5)
      this.desiredPosition.copy(anchor.localToWorld(this.focusOffset.clone()))
      this.clampPosition(this.desiredPosition)
      this.camera.position.lerp(this.desiredPosition, cam.lerp)
      const direction = this.lookTarget.clone().sub(this.camera.position).normalize()
      const baseYaw = Math.atan2(-direction.x, -direction.z)
      const basePitch = Math.asin(THREE.MathUtils.clamp(direction.y, -1, 1))
      this.movement.targetYaw = baseYaw + this.focusYawOffset
      this.movement.targetPitch = THREE.MathUtils.clamp(
        basePitch + this.focusPitchOffset,
        -1.45,
        1.45,
      )
    }

    this.movement.yaw = THREE.MathUtils.lerp(this.movement.yaw, this.movement.targetYaw, UNIVERSE_MOTION.yawLerp)
    this.movement.pitch = THREE.MathUtils.lerp(this.movement.pitch, this.movement.targetPitch, UNIVERSE_MOTION.pitchLerp)
    this.camera.rotation.order = 'YXZ'
    this.camera.rotation.y = this.movement.yaw
    this.camera.rotation.x = this.movement.pitch

    if (this.followingFocus) {
      this.movement.velocity.multiplyScalar(0.76)
      this.movement.thrust = 0
    } else {
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
      this.clampPosition(this.camera.position)
    }

    // 跟焦时禁用漂移，否则相机会在世界里抖动，无法与目标（尤其行星）保持相对静止
    if (!options.prefersReducedMotion && !input.isDragging && !this.followingFocus) {
      this.movement.targetYaw += options.isLight
        ? UNIVERSE_ROTATION_SPEED.driftLight
        : UNIVERSE_ROTATION_SPEED.driftDark
      this.camera.position.x += Math.sin(elapsed * 0.16) * UNIVERSE_CAMERA_DRIFT.xAmplitude
      this.camera.position.y += Math.cos(elapsed * 0.13) * UNIVERSE_CAMERA_DRIFT.yAmplitude
      this.clampPosition(this.camera.position)
    }
  }

  private clampPosition(position: THREE.Vector3) {
    position.x = THREE.MathUtils.clamp(position.x, -UNIVERSE_CAMERA_LIMITS.x, UNIVERSE_CAMERA_LIMITS.x)
    position.y = THREE.MathUtils.clamp(position.y, UNIVERSE_CAMERA_LIMITS.yMin, UNIVERSE_CAMERA_LIMITS.yMax)
    position.z = THREE.MathUtils.clamp(position.z, -UNIVERSE_CAMERA_LIMITS.z, UNIVERSE_CAMERA_LIMITS.z)
  }

}
