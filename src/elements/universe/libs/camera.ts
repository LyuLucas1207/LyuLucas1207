import * as THREE from 'three'

import type { Nilable } from 'nfx-ui/types'
import { safeOr } from 'nfx-ui/utils'

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
  /** `follow` 为行星体时用 `planet`；为 `Starship.facing` 时用 `starship`（使用飞船子相机渲染）。 */
  followRole?: 'planet' | 'starship'
  /** 跟船：拖拽产生的轨道增量写进该子相机的本地 `rotation`（仍继承 `attitude` 朝向目的地） */
  starshipChaseCamera?: THREE.PerspectiveCamera
  /** 跟船：`StarshipConfig.chaseCam.orbitPitchLimit`，与当前追击相机一致 */
  starshipOrbitPitchLimit?: number
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
  private readonly planetWorldPos = new THREE.Vector3()
  private readonly planetWorldQuat = new THREE.Quaternion()
  private readonly planetWorldScale = new THREE.Vector3()
  private readonly planetLocalOffset = new THREE.Vector3()
  private readonly lookDirScratch = new THREE.Vector3()
  private readonly chaseSyncQuat = new THREE.Quaternion()
  private lastStarshipChaseCamera: Nilable<THREE.PerspectiveCamera> = null

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
    const leavingStarship =
      this.lastStarshipChaseCamera != null &&
      (!target ||
        target.followRole !== 'starship' ||
        target.starshipChaseCamera !== this.lastStarshipChaseCamera)
    if (leavingStarship) {
      this.syncMainCameraFromChase()
    }

    this.focusTarget = target
    this.followingFocus = target !== null
    this.focusYawOffset = 0
    this.focusPitchOffset = 0
    if (target) {
      this.movement.velocity.set(0, 0, 0)
      this.movement.thrust = 0
      this.onFocusSystemChange?.(target.group.userData.systemId as string | undefined)
      if (target.followRole === 'starship' && target.starshipChaseCamera) {
        this.lastStarshipChaseCamera = target.starshipChaseCamera
      } else {
        this.lastStarshipChaseCamera = null
      }
    } else {
      this.lastStarshipChaseCamera = null
    }
  }

  clearFocus() {
    if (this.lastStarshipChaseCamera) {
      this.syncMainCameraFromChase()
    }
    this.focusTarget = null
    this.followingFocus = false
    this.focusYawOffset = 0
    this.focusPitchOffset = 0
    this.lastStarshipChaseCamera = null
    this.onFocusSystemChange?.(undefined)
  }

  /** 主相机用于自由飞行 / 行星跟焦；跟船时用飞船自带追击相机 */
  getRenderCamera(): THREE.PerspectiveCamera {
    if (
      this.followingFocus &&
      this.focusTarget?.followRole === 'starship' &&
      this.focusTarget.starshipChaseCamera
    ) {
      return this.focusTarget.starshipChaseCamera
    }
    return this.camera
  }

  private syncMainCameraFromChase() {
    const chase = this.lastStarshipChaseCamera
    if (!chase) return
    chase.getWorldPosition(this.camera.position)
    chase.getWorldQuaternion(this.chaseSyncQuat)
    this.camera.quaternion.copy(this.chaseSyncQuat)
    this.camera.rotation.setFromQuaternion(this.chaseSyncQuat, 'YXZ')
    this.movement.yaw = this.camera.rotation.y
    this.movement.pitch = this.camera.rotation.x
    this.movement.targetYaw = this.movement.yaw
    this.movement.targetPitch = this.movement.pitch
    this.lastStarshipChaseCamera = null
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
      const orbitPitchCap =
        this.focusTarget.followRole === 'starship'
          ? safeOr(this.focusTarget.starshipOrbitPitchLimit, 1.18)
          : 0.95
      this.focusPitchOffset = THREE.MathUtils.clamp(this.focusPitchOffset, -orbitPitchCap, orbitPitchCap)
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
      const frameR = planetFollow
        ? safeOr(this.focusTarget.followFrameRadius, this.focusTarget.maxOrbitRadius)
        : this.focusTarget.maxOrbitRadius

      if (planetFollow) {
        const role = safeOr(this.focusTarget.followRole, 'planet')

        if (role === 'starship') {
          const chaseCam = this.focusTarget.starshipChaseCamera
          if (chaseCam) {
            chaseCam.rotation.order = 'YXZ'
            const pitchCap = safeOr(this.focusTarget.starshipOrbitPitchLimit, 1.18)
            chaseCam.rotation.y = this.focusYawOffset
            chaseCam.rotation.x = THREE.MathUtils.clamp(this.focusPitchOffset, -pitchCap, pitchCap)
            chaseCam.rotation.z = 0
          }
        } else {
          const pc = UNIVERSE_PLANET_FOCUS
          const dist = frameR * pc.radiusToCameraFactor
          follow.updateWorldMatrix(true, false)
          follow.matrixWorld.decompose(this.planetWorldPos, this.planetWorldQuat, this.planetWorldScale)
          this.lookTarget.copy(this.planetWorldPos)
          this.planetLocalOffset.set(0, pc.heightOffset, dist)
          this.planetLocalOffset.applyQuaternion(this.planetWorldQuat)
          this.desiredPosition.copy(this.planetWorldPos).add(this.planetLocalOffset)

          this.clampPosition(this.desiredPosition)
          this.camera.position.lerp(this.desiredPosition, UNIVERSE_PLANET_FOCUS.lerp)
          this.lookDirScratch.copy(this.lookTarget).sub(this.camera.position)
          if (this.lookDirScratch.lengthSq() < 1e-10) {
            this.lookDirScratch.set(0, 0, -1)
          } else {
            this.lookDirScratch.normalize()
          }
          const baseYaw = Math.atan2(-this.lookDirScratch.x, -this.lookDirScratch.z)
          const basePitch = Math.asin(THREE.MathUtils.clamp(this.lookDirScratch.y, -1, 1))
          const twoPi = Math.PI * 2
          let desiredYaw = baseYaw + this.focusYawOffset
          while (desiredYaw - this.movement.yaw > Math.PI) desiredYaw -= twoPi
          while (desiredYaw - this.movement.yaw < -Math.PI) desiredYaw += twoPi
          this.movement.targetYaw = desiredYaw
          this.movement.targetPitch = THREE.MathUtils.clamp(
            basePitch + this.focusPitchOffset,
            -1.45,
            1.45,
          )
        }
      } else {
        const sc = UNIVERSE_SYSTEM_FOCUS
        const anchor = this.focusTarget.group
        anchor.getWorldPosition(this.lookTarget)
        this.focusOffset.set(0, sc.heightOffset, frameR * 1.5)
        this.desiredPosition.copy(anchor.localToWorld(this.focusOffset.clone()))

        this.clampPosition(this.desiredPosition)
        this.camera.position.lerp(this.desiredPosition, UNIVERSE_SYSTEM_FOCUS.lerp)
        this.lookDirScratch.copy(this.lookTarget).sub(this.camera.position)
        if (this.lookDirScratch.lengthSq() < 1e-10) {
          this.lookDirScratch.set(0, 0, -1)
        } else {
          this.lookDirScratch.normalize()
        }
        const baseYaw = Math.atan2(-this.lookDirScratch.x, -this.lookDirScratch.z)
        const basePitch = Math.asin(THREE.MathUtils.clamp(this.lookDirScratch.y, -1, 1))
        const twoPi = Math.PI * 2
        let desiredYaw = baseYaw + this.focusYawOffset
        while (desiredYaw - this.movement.yaw > Math.PI) desiredYaw -= twoPi
        while (desiredYaw - this.movement.yaw < -Math.PI) desiredYaw += twoPi
        this.movement.targetYaw = desiredYaw
        this.movement.targetPitch = THREE.MathUtils.clamp(
          basePitch + this.focusPitchOffset,
          -1.45,
          1.45,
        )
      }
    }

    const useShipChaseCamera =
      this.followingFocus &&
      this.focusTarget != null &&
      safeOr(this.focusTarget.followRole, 'planet') === 'starship'

    if (!useShipChaseCamera) {
      this.movement.yaw = THREE.MathUtils.lerp(this.movement.yaw, this.movement.targetYaw, UNIVERSE_MOTION.yawLerp)
      this.movement.pitch = THREE.MathUtils.lerp(
        this.movement.pitch,
        this.movement.targetPitch,
        UNIVERSE_MOTION.pitchLerp,
      )
    }
    if (!useShipChaseCamera) {
      this.camera.rotation.order = 'YXZ'
      this.camera.rotation.y = this.movement.yaw
      this.camera.rotation.x = this.movement.pitch
    }

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
