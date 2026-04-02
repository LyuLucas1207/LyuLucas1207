import * as THREE from 'three'

import type { Nilable } from 'nfx-ui/types'

import {
  UNIVERSE_CAMERA_DRIFT,
  UNIVERSE_CAMERA_LIMITS,
  UNIVERSE_MOTION,
  UNIVERSE_ROTATION_SPEED,
  UNIVERSE_SYSTEM_FOCUS,
} from '../constants'
import type { SceneInput } from './input'

export interface CameraFocusTarget {
  group: THREE.Group
  maxOrbitRadius: number
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
    if (target) {
      this.movement.velocity.set(0, 0, 0)
      this.movement.thrust = 0
      this.onFocusSystemChange?.(target.group.userData.systemId as string | undefined)
    }
  }

  clearFocus() {
    this.focusTarget = null
    this.followingFocus = false
    this.onFocusSystemChange?.(undefined)
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / Math.max(height, 1)
    this.camera.updateProjectionMatrix()
  }

  update(input: SceneInput, elapsed: number, options: CameraUpdateOptions) {
    const { dx, dy } = input.consumeDragDelta()
    this.movement.targetYaw -= dx * 0.0024
    this.movement.targetPitch -= dy * 0.0021
    this.movement.targetPitch = THREE.MathUtils.clamp(this.movement.targetPitch, -1.45, 1.45)

    const wheelDelta = input.consumeWheelDelta()
    this.movement.thrust += THREE.MathUtils.clamp(
      wheelDelta * UNIVERSE_MOTION.wheelForce,
      -UNIVERSE_MOTION.wheelClamp,
      UNIVERSE_MOTION.wheelClamp,
    )

    if (this.focusTarget && this.followingFocus) {
      this.focusTarget.group.getWorldPosition(this.lookTarget)
      this.focusOffset.set(0, UNIVERSE_SYSTEM_FOCUS.heightOffset, this.focusTarget.maxOrbitRadius * 1.5)
      this.desiredPosition.copy(this.focusTarget.group.localToWorld(this.focusOffset.clone()))
      this.clampPosition(this.desiredPosition)
      this.camera.position.lerp(this.desiredPosition, UNIVERSE_SYSTEM_FOCUS.lerp)
      this.applyLookAt(this.camera.position, this.lookTarget)
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

    if (!options.prefersReducedMotion && !input.isDragging) {
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

  private applyLookAt(position: THREE.Vector3, target: THREE.Vector3) {
    const direction = target.clone().sub(position).normalize()
    this.movement.targetYaw = Math.atan2(-direction.x, -direction.z)
    this.movement.targetPitch = Math.asin(THREE.MathUtils.clamp(direction.y, -1, 1))
  }
}
