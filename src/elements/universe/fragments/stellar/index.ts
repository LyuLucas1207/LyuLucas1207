import * as THREE from 'three'

import type { Nullable } from 'nfx-ui/types'
import { safeZeroable } from 'nfx-ui/utils'

import type { CameraRigMovement } from '../../libs/camera'
import {
  clampCameraPosition,
  setLocalQuaternionFromWorldLookAt,
  syncMainCameraWorldUpView,
  unwrapYawNear,
  worldOrbitBaseFromOffsetTowardTarget,
  worldYawPitchToCameraMinusZ,
} from '../../libs/camera'
import { Fragment } from '../../libs/fragment'
import { disposeMaterials, disposeObject3DSubtree } from '../../utils/disposeThreeResources'
import type { StellarConfig } from './types'

export type {
  StellarConfig,
  StellarCoreHoverConfig,
  StellarFocusCameraConfig,
  StellarPalette,
  StellarShellShaders,
} from './types'
export { StellarBuilder } from './builder'

export class Stellar extends Fragment {
  readonly group: THREE.Group
  readonly coreMesh: THREE.Mesh
  /** 星系跟焦：挂在 `group` 下的机位（由 `tickSystemFocus` 每帧更新） */
  readonly focusCamera: THREE.PerspectiveCamera
  /** 球体/GLB 统一使用的目标半径（与 `StellarConfig.radius` 一致） */
  readonly coreTargetRadius: number
  private readonly coreSlot: THREE.Group
  private readonly focusCfg: StellarConfig['focusCamera']
  private systemMaxOrbit = 48
  private readonly camScratch = {
    lookTarget: new THREE.Vector3(),
    focusOffset: new THREE.Vector3(),
    localDesired: new THREE.Vector3(),
    lookDirScratch: new THREE.Vector3(),
    camWorldPos: new THREE.Vector3(),
  }
  private shellMesh: Nullable<THREE.Mesh> = null
  private shellAnimated = false
  private haloMesh: Nullable<THREE.Mesh> = null
  private haloAnimated = false
  private glbCore: Nullable<THREE.Object3D> = null
  /** GLB 核心自发光：与原先球体同主题色与 emissive 档位 */
  private readonly glbEmissiveColor: THREE.Color
  private readonly glbEmissiveIntensity: number
  private readonly coreSpinSpeed: number
  private readonly coreSpinPhase: number

  get root() {
    return this.group
  }

  /** 射线/交互写在 `coreMesh.userData`，与银河中心球等不同 */
  protected get userDataTarget() {
    return this.coreMesh
  }

  get focusOrbitPitchLimit() {
    return this.focusCfg.orbitPitchLimit
  }

  constructor(config: StellarConfig) {
    super()
    this.focusCfg = config.focusCamera
    this.group = new THREE.Group()
    this.coreSlot = new THREE.Group()
    this.coreTargetRadius = config.radius
    this.coreSpinSpeed = config.coreSpinSpeed * (0.88 + Math.random() * 0.28)
    this.coreSpinPhase = Math.random() * Math.PI * 2

    const coreColor = new THREE.Color(config.palette.coreColor)
    this.glbEmissiveColor = coreColor.clone()
    this.glbEmissiveIntensity = config.isLight ? config.emissive.on : config.emissive.off
    const haloColor = new THREE.Color(config.palette.haloColor)
    const keyLightColor = new THREE.Color(config.palette.keyLightColor)
    const rimLightColor = new THREE.Color(config.palette.rimLightColor)

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(config.radius, config.segments, config.segments),
      new THREE.MeshPhysicalMaterial({
        color: coreColor,
        emissive: coreColor,
        emissiveIntensity: config.isLight ? config.emissive.on : config.emissive.off,
        roughness: config.surface.roughness,
        metalness: config.surface.metalness,
        clearcoat: config.surface.clearcoat,
        clearcoatRoughness: config.surface.clearcoatRoughness,
      }),
    )

    this.coreMesh = sphere
    const hover = config.coreHover
    if (hover) {
      this.mergeUserData({
        baseScale: hover.baseScale ?? 1,
        hovered: hover.hovered ?? false,
        systemName: hover.systemName,
        label: hover.label,
      })
    }
    this.coreSlot.add(sphere)
    this.group.add(this.coreSlot)

    if (config.shell) {
      const shellColor = new THREE.Color(config.palette.shellColor)
      const shellFallbackColor = new THREE.Color(config.palette.shellFallbackColor)
      this.shellMesh = new THREE.Mesh(
        new THREE.SphereGeometry(config.shell.radius, config.segments, config.segments),
        config.shellShaders
          ? new THREE.ShaderMaterial({
              transparent: true,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
              side: THREE.BackSide,
              uniforms: {
                uColor: { value: shellColor },
                uOpacity: { value: config.isLight ? config.shell.opacity.on : config.shell.opacity.off },
              },
              vertexShader: config.shellShaders.vertex,
              fragmentShader: config.shellShaders.fragment,
            })
          : new THREE.MeshBasicMaterial({
              color: shellFallbackColor,
              transparent: true,
              opacity: config.isLight ? config.shell.opacity.on : config.shell.opacity.off,
              depthWrite: false,
            }),
      )
      this.shellAnimated = config.shell.ifanimate
      this.group.add(this.shellMesh)
    }

    if (config.halo) {
      this.haloMesh = new THREE.Mesh(
        new THREE.SphereGeometry(config.halo.radius, config.segments, config.segments),
        new THREE.MeshBasicMaterial({
          color: haloColor,
          transparent: true,
          opacity: config.isLight ? config.halo.opacity.on : config.halo.opacity.off,
          depthWrite: false,
        }),
      )
      this.haloAnimated = config.halo.ifanimate
      this.group.add(this.haloMesh)
    }

    const keyLight = new THREE.PointLight(
      keyLightColor,
      config.isLight ? config.keyLight.intensity.on : config.keyLight.intensity.off,
      config.keyLight.distance,
      2,
    )
    keyLight.position.set(...config.keyLight.position)
    this.group.add(keyLight)

    if (config.rimLight) {
      const rimLight = new THREE.PointLight(
        rimLightColor,
        config.isLight ? config.rimLight.intensity.on : config.rimLight.intensity.off,
        config.rimLight.distance,
        2,
      )
      rimLight.position.set(...config.rimLight.position)
      this.group.add(rimLight)
    }

    const fc = config.focusCamera
    this.focusCamera = new THREE.PerspectiveCamera(fc.fov, 1, fc.near, fc.far)
    this.focusCamera.name = 'stellarFocusCamera'
    this.group.add(this.focusCamera)
  }

  /** 跟焦该星系前由场景传入 `maxOrbitRadius`（行星轨道包络） */
  prepareSystemFocus(maxOrbitRadius: number) {
    this.systemMaxOrbit = maxOrbitRadius
  }

  tickSystemFocus(yawOffset: number, pitchOffset: number, movement: CameraRigMovement) {
    const fc = this.focusCfg
    const frameR = this.systemMaxOrbit
    this.coreMesh.getWorldPosition(this.camScratch.lookTarget)
    this.camScratch.focusOffset.set(0, fc.heightOffset, frameR * fc.distanceZFactor)
    const { dist, baseYaw, basePitch } = worldOrbitBaseFromOffsetTowardTarget(
      this.camScratch.focusOffset.x,
      this.camScratch.focusOffset.y,
      this.camScratch.focusOffset.z,
    )

    movement.targetYaw = unwrapYawNear(baseYaw + yawOffset, movement.yaw)
    movement.targetPitch = THREE.MathUtils.clamp(basePitch + pitchOffset, -fc.maxPitch, fc.maxPitch)

    movement.yaw = THREE.MathUtils.lerp(movement.yaw, movement.targetYaw, fc.yawLerp)
    movement.pitch = THREE.MathUtils.lerp(movement.pitch, movement.targetPitch, fc.pitchLerp)

    worldYawPitchToCameraMinusZ(movement.yaw, movement.pitch, this.camScratch.lookDirScratch)
    this.camScratch.camWorldPos
      .copy(this.camScratch.lookTarget)
      .addScaledVector(this.camScratch.lookDirScratch, -dist)
    clampCameraPosition(this.camScratch.camWorldPos)
    this.camScratch.localDesired.copy(this.camScratch.camWorldPos)
    this.group.worldToLocal(this.camScratch.localDesired)
    this.focusCamera.position.lerp(this.camScratch.localDesired, fc.positionLerp)

    this.focusCamera.getWorldPosition(this.camScratch.camWorldPos)
    setLocalQuaternionFromWorldLookAt(this.focusCamera, this.camScratch.camWorldPos, this.camScratch.lookTarget)
  }

  exitSystemFocus(main: THREE.PerspectiveCamera, movement: CameraRigMovement) {
    this.focusCamera.getWorldPosition(main.position)
    this.focusCamera.getWorldDirection(this.camScratch.lookDirScratch)
    syncMainCameraWorldUpView(main, this.camScratch.lookDirScratch, movement)
  }

  /**
   * 用已缩放到 `coreTargetRadius` 的 GLB 替换球体核心；`coreMesh` 改为透明碰撞体（引用不变）。
   */
  attachGlbCore(root: THREE.Object3D) {
    if (this.glbCore) {
      this.coreSlot.remove(this.glbCore)
      disposeObject3DSubtree(this.glbCore)
      this.glbCore = null
    }

    this.coreSlot.remove(this.coreMesh)
    this.coreMesh.geometry.dispose()
    disposeMaterials(this.coreMesh.material)

    const pickSeg = Math.max(12, Math.min(28, Math.floor(this.coreTargetRadius * 2)))
    this.coreMesh.geometry = new THREE.SphereGeometry(this.coreTargetRadius, pickSeg, pickSeg)
    this.coreMesh.material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })

    this.coreSlot.add(root)
    this.coreSlot.add(this.coreMesh)
    this.glbCore = root
    Stellar.applyGlbCoreEmissive(root, this.glbEmissiveColor, this.glbEmissiveIntensity)
  }

  /** 给 GLB 内带 `emissive` / `emissiveIntensity` 的材质叠主题色自发光 */
  private static applyGlbCoreEmissive(root: THREE.Object3D, color: THREE.Color, intensity: number) {
    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !child.material) return
      const list = Array.isArray(child.material) ? child.material : [child.material]
      for (const m of list) {
        if (!m || typeof m !== 'object') continue
        if (!('emissive' in m) || !('emissiveIntensity' in m)) continue
        if (!(m.emissive instanceof THREE.Color)) continue
        m.emissive.copy(color)
        const boosted = intensity * 1.4
        m.emissiveIntensity = Math.max(safeZeroable(m.emissiveIntensity), boosted)
      }
    })
  }

  update(elapsed: number) {
    this.coreSlot.rotation.y = elapsed * this.coreSpinSpeed + this.coreSpinPhase

    if (this.shellMesh && this.shellAnimated) {
      const scale = 1 + Math.sin(elapsed * 1.2) * 0.08
      this.shellMesh.scale.setScalar(scale)
    }
    if (this.haloMesh && this.haloAnimated) {
      const scale = 1 + Math.sin(elapsed * 0.8) * 0.32
      this.haloMesh.scale.setScalar(scale)
    }
  }
}
