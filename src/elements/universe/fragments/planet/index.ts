import * as THREE from 'three'

import { pickColor } from 'nfx-ui/utils'

import type { Nullable } from 'nfx-ui/types'

import type { CameraRigMovement } from '../../libs/camera'
import {
  clampCameraPosition,
  setLocalQuaternionFromWorldLookAt,
  syncMainCameraWorldUpView,
  unwrapYawNear,
  worldOrbitBaseFromOffsetTowardTarget,
  worldYawPitchToCameraMinusZ,
} from '../../libs/camera'
import type { Ring } from '../ring'
import { Fragment } from '../../libs/fragment'
import { disposeMaterials, disposeObject3DSubtree } from '../../utils/disposeThreeResources'
import type { PlanetConfig } from './types'

export type {
  PlanetConfig,
  PlanetFocusCameraConfig,
  PlanetPalette,
  PlanetPickConfig,
  PlanetSurfaceConfig,
} from './types'
export { PlanetBuilder } from './builder'

export type PlanetRuntime = {
  planet: Planet
  orbitCarrier: THREE.Group
  body: THREE.Object3D
  /** 透明碰撞球 — 供 `SceneInput` 射线检测；GLB 只负责外观。 */
  mesh: THREE.Mesh
  speed: number
  baseScale: number
  ring?: Ring
}

export class Planet extends Fragment {
  readonly body: THREE.Group
  /** 行星跟焦：挂在 `body` 下的机位 */
  readonly focusCamera: THREE.PerspectiveCamera
  /** 球体 / GLB 挂在下述节点上自转；碰撞体与星环/卫星仍在 `body` */
  readonly coreSlot: THREE.Group
  readonly mesh: THREE.Mesh
  private readonly planetRadius: number
  private readonly focusCfg: PlanetConfig['focusCamera']
  private readonly camScratch = {
    lookTarget: new THREE.Vector3(),
    localDesired: new THREE.Vector3(),
    lookDirScratch: new THREE.Vector3(),
    camWorldPos: new THREE.Vector3(),
  }
  private visual: Nullable<THREE.Mesh> = null
  private glbRoot: Nullable<THREE.Object3D> = null
  private readonly spinSpeed: number
  private readonly spinPhase: number

  get root() {
    return this.body
  }

  protected get userDataTarget() {
    return this.mesh
  }

  /** 供场景组装 `UniverseFocusCamera` 的 pitch 夹紧，与 `focusCfg.orbitPitchLimit` 一致 */
  get focusOrbitPitchLimit() {
    return this.focusCfg.orbitPitchLimit
  }

  constructor(config: PlanetConfig) {
    super()
    this.focusCfg = config.focusCamera
    this.planetRadius = config.planetRadius
    this.body = new THREE.Group()
    this.coreSlot = new THREE.Group()
    this.spinSpeed = config.spinSpeed * (0.28 + Math.random() * 0.18)
    this.spinPhase = Math.random() * Math.PI * 2

    const color = new THREE.Color(pickColor(config.palette.surfaceColorPool))
    const sphere = new THREE.SphereGeometry(config.planetRadius, config.segments, config.segments)
    this.visual = new THREE.Mesh(
      sphere,
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: config.isLight ? config.surface.emissive.on : config.surface.emissive.off,
        roughness: config.surface.roughness,
        metalness: config.surface.metalness,
      }),
    )

    const pickSegments = Math.max(12, Math.min(config.segments, 28))
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(config.planetRadius, pickSegments, pickSegments),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    )

    this.coreSlot.add(this.visual)
    const fc = config.focusCamera
    this.focusCamera = new THREE.PerspectiveCamera(fc.fov, 1, fc.near, fc.far)
    this.focusCamera.name = 'planetFocusCamera'
    this.body.add(this.coreSlot, this.mesh, this.focusCamera)

    const pick = config.pick
    this.mergeUserData({
      planetRadius: config.planetRadius,
      planetBody: this.body,
      ...(pick
        ? {
            planetId: pick.planetId,
            action: pick.action,
            baseScale: pick.baseScale ?? 1,
            hovered: pick.hovered ?? false,
            systemName: pick.systemName,
            label: pick.label,
          }
        : {}),
    })
  }

  update(elapsed: number) {
    this.coreSlot.rotation.y = elapsed * this.spinSpeed + this.spinPhase
  }

  tickPlanetFocus(yawOffset: number, pitchOffset: number, movement: CameraRigMovement) {
    const fc = this.focusCfg
    const radial = this.planetRadius * fc.radiusToCameraFactor
    this.body.getWorldPosition(this.camScratch.lookTarget)

    const { dist, baseYaw, basePitch } = worldOrbitBaseFromOffsetTowardTarget(0, fc.heightOffset, radial)

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
    this.body.worldToLocal(this.camScratch.localDesired)
    this.focusCamera.position.lerp(this.camScratch.localDesired, fc.positionLerp)

    this.focusCamera.getWorldPosition(this.camScratch.camWorldPos)
    setLocalQuaternionFromWorldLookAt(this.focusCamera, this.camScratch.camWorldPos, this.camScratch.lookTarget)
  }

  exitPlanetFocus(main: THREE.PerspectiveCamera, movement: CameraRigMovement) {
    this.focusCamera.getWorldPosition(main.position)
    this.focusCamera.getWorldDirection(this.camScratch.lookDirScratch)
    syncMainCameraWorldUpView(main, this.camScratch.lookDirScratch, movement)
  }

  /**
   * 用已缩放到行星半径的 GLB 根节点替换程序化球体；重复调用会先释放上一颗 GLB。
   */
  attachGlbRoot(root: THREE.Object3D) {
    if (this.glbRoot) {
      this.coreSlot.remove(this.glbRoot)
      disposeObject3DSubtree(this.glbRoot)
      this.glbRoot = null
    }
    if (this.visual) {
      this.coreSlot.remove(this.visual)
      this.visual.geometry.dispose()
      disposeMaterials(this.visual.material)
      this.visual = null
    }
    this.body.remove(this.mesh)
    this.glbRoot = root
    this.coreSlot.add(root)
    this.body.add(this.mesh)
  }
}
