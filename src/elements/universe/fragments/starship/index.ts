import * as THREE from 'three'

import { disposeObject3DSubtree } from '../../utils/disposeThreeResources'
import { scaleAndCenterModelToRadius } from '../../utils/loadGltf'
import type { Nullable } from 'nfx-ui/types'

import { Fragment } from '../../libs/fragment'
import { Group } from '../../libs/group'
import type { StarshipConfig } from './types'

export type {
  StarshipChaseCamConfig,
  StarshipConfig,
  StarshipGlowConfig,
  StarshipPlanetHopConfig,
  StarshipPoseConfig,
} from './types'
export { StarshipBuilder } from './builder'

const scratch = {
  dir: new THREE.Vector3(),
  lookAt: new THREE.Vector3(),
  m: new THREE.Matrix4(),
  planarB: new THREE.Vector3(),
  cross: new THREE.Vector3(),
  worldUp: new THREE.Vector3(),
  hopA: new THREE.Vector3(),
  hopB: new THREE.Vector3(),
}

/**
 * 宇宙飞船片段（`Fragment`）。
 *
 * **场景层级（单一路径，无重复别名）**  
 * `group`（世界位姿、点光）→ `facing`（机头朝向四元数，`CameraRig` 跟焦用 `follow: ship.facing`）→ `bank`（横滚）→ GLB 模型（`attachGlbRoot` 挂载）。
 *
 * **两阶段与 `Planet` 一致**  
 * 1. `new Starship(config)`：创建 `group` / `facing` / `bank`、追击相机、点光（config **不含** GLB URL，与行星一致）。  
 * 2. 场景侧 `attachStarshipGlbRoot(ship, shipIndex)` 从 `STARSHIP_GLB_URLS` 加载后再调 `attachGlbRoot(root, clips)`。
 *
 * **运动**  
 * 位移在 `group`；`tickPlanetHop` / `updateSeekDestination` 等推进目标；`applyFacingAndBank` 把飞行方向写入 `facing.quaternion`；停泊用 `updateParked`。  
 * 参数一律读 `this.config`（构建时快照）。
 */
export class Starship extends Fragment {
  /** 根节点：世界坐标平移、可见性、与 `Fragment.root` 一致 */
  readonly group: THREE.Group
  /**
   * 机头朝向层：每帧写入四元数；与 `CameraFocusTarget.follow` 对接（场景里 `follow: ship.facing`）。
   * 其下挂 `chaseCamera`（拖拽轨道）与 `bank`（横滚）→ 模型。
   */
  readonly facing: THREE.Group
  /** 追击相机：本地位姿由 `config.chaseCam` 初值 + `CameraRig` 拖拽增量决定，挂在 `facing` 下 */
  readonly chaseCamera: THREE.PerspectiveCamera

  /** 构建时快照；运动/姿态参数读 `config` */
  readonly config: StarshipConfig
  private readonly bank: THREE.Group
  private readonly glowLight: THREE.PointLight
  private glbRoot: Nullable<THREE.Object3D> = null
  private mixer: Nullable<THREE.AnimationMixer> = null
  private readonly targetQuat = new THREE.Quaternion()
  /** 和弦线方向做指数趋近，避免换终点时机头/横滚一帧拧死 */
  private readonly smoothedFlightDir = new THREE.Vector3(0, 0, 1)
  /** 上一帧**瞬时**水平航向，用于算转弯角速度并驱动横滚（与机头平滑解耦） */
  private readonly lastInstantPlanar = new THREE.Vector3(0, 0, 1)
  private readonly lastFlightDir = new THREE.Vector3(0, 0, 1)
  private instantPlanarReady = false
  private smoothedTurnRate = 0
  private bankAngle = 0
  private targetBank = 0
  /** 朝 `updateSeekDestination` 目标推进时的沿线速度（世界单位/秒） */
  private alongSpeed = 0
  private readonly seekPos = new THREE.Vector3()
  private readonly seekDir = new THREE.Vector3()
  /** 行星间跳跃 */
  private hopEndBody: Nullable<THREE.Object3D> = null
  private readonly hopHold = new THREE.Vector3()
  private hopLaunchLeft = 0
  private hopRestLeft = 0

  get root() {
    return this.group
  }

  constructor(config: StarshipConfig) {
    super()
    this.config = config

    this.group = new Group({ name: 'starship' })
    this.facing = new Group({ name: 'starshipFacing' })
    this.bank = new Group({ name: 'starshipBank' })
    const ch = config.chaseCam
    this.chaseCamera = new THREE.PerspectiveCamera(ch.fov, 1, ch.near, ch.far)
    this.chaseCamera.name = 'starshipChaseCamera'
    this.chaseCamera.position.set(ch.localX, ch.localY, ch.localZ)
    this.chaseCamera.quaternion.identity()

    const g = config.glow
    this.glowLight = new THREE.PointLight(g.pointColor, g.pointIntensity, g.pointDistance, g.pointDecay)
    this.group.add(this.glowLight, this.facing)
    this.facing.add(this.chaseCamera, this.bank)
  }

  /**
   * 与 `Planet.attachGlbRoot` 同思路：传入 GLB 场景根（会先 `scaleAndCenterModelToRadius`）+ `gltf.animations` 对应轨。
   */
  attachGlbRoot(root: THREE.Object3D, clips: THREE.AnimationClip[]) {
    if (this.glbRoot) {
      this.bank.remove(this.glbRoot)
      disposeObject3DSubtree(this.glbRoot)
      this.glbRoot = null
    }
    this.mixer?.stopAllAction()
    this.mixer = null

    scaleAndCenterModelToRadius(root, this.config.modelRadius)
    const fix = this.config.pose
    root.rotation.order = 'YXZ'
    root.rotation.set(fix.modelPitchCorrection, fix.modelYawCorrection, fix.modelRollCorrection)

    this.bank.add(root)
    this.glbRoot = root

    if (clips.length > 0) {
      this.mixer = new THREE.AnimationMixer(root)
      const clip = clips[0]!
      this.mixer.clipAction(clip).reset().play()
    }
  }

  /**
   * 换一段追击前把沿线速度拉回巡航初值（进入到达圈、换行星目标等时由编排层调用）。
   */
  prepareSeek() {
    this.alongSpeed = this.config.cruiseSpeed
  }

  /** GLB 就绪后由场景调用：随机出生点与第一个目标行星 */
  bootstrapPlanetHop(waypoints: THREE.Object3D[]) {
    if (waypoints.length < 2) return
    const pair = this.pickRandomBootstrapPair(waypoints)
    if (!pair) return
    const [spawnWp, endWp] = Math.random() < 0.5 ? pair : [pair[1], pair[0]]
    this.hopEndBody = endWp
    spawnWp.getWorldPosition(this.hopHold)
    this.applySpawnJitter(this.hopHold)
    this.group.position.copy(this.hopHold)
    this.prepareSeek()
  }

  /** 首曝前「停在出生点」的倒计时（秒） */
  setPlanetHopLaunchDelay(seconds: number) {
    this.hopLaunchLeft = seconds
  }

  /** 与行星 `update` 同级：每帧朝当前目标飞，进圈减速、休息、换终点 */
  tickPlanetHop(waypoints: THREE.Object3D[], delta: number, prefersReducedMotion: boolean) {
    if (waypoints.length < 2 || !this.hopEndBody) return

    let dt = Number.isFinite(delta) && delta > 0 ? delta : 0
    if (dt > 0 && dt < 1 / 1200) {
      dt = 1 / 1200
    }

    if (prefersReducedMotion) {
      this.group.visible = false
      return
    }

    this.group.visible = true

    const { arrivalZoneRadius, restSecondsMin, restSecondsMax } = this.config.planetHop

    this.hopEndBody.getWorldPosition(scratch.hopB)

    if (this.hopLaunchLeft > 0) {
      this.hopLaunchLeft -= dt
      this.group.position.copy(this.hopHold)
      this.updateParked(this.hopHold, scratch.hopB, dt)
      return
    }

    const distToEnd = this.group.position.distanceTo(scratch.hopB)

    if (this.hopRestLeft <= 0 && distToEnd <= arrivalZoneRadius) {
      this.hopRestLeft = restSecondsMin + Math.random() * Math.max(0, restSecondsMax - restSecondsMin)
      this.prepareSeek()
    }

    this.updateSeekDestination(scratch.hopB, dt, this.hopRestLeft > 0)

    if (this.hopRestLeft > 0) {
      this.hopRestLeft -= dt
      if (this.hopRestLeft <= 0) {
        this.pickNextHopDestination(waypoints)
      }
    }
  }

  /**
   * 每帧朝 **本帧世界坐标** `destinationWorld` 推进（终点可由调用方用行星 `getWorldPosition` 更新），
   * 内部用加速度/减速与 `updateFlightChord` 对齐机头与横滚。
   * @param arrivalCoast 为 true 时沿视线减速（到达圈内「靠泊滑行」）
   * @returns 推进后船位到目标的距离
   */
  updateSeekDestination(destinationWorld: THREE.Vector3, delta: number, arrivalCoast: boolean): number {
    this.seekPos.copy(this.group.position)
    this.seekDir.subVectors(destinationWorld, this.seekPos)
    const dist = this.seekDir.length()
    if (dist < 1e-9) {
      this.updateFlightChord(this.seekPos, destinationWorld, delta)
      return 0
    }
    this.seekDir.multiplyScalar(1 / dist)
    if (arrivalCoast) {
      this.alongSpeed = Math.max(0, this.alongSpeed - this.config.alongDeceleration * delta)
    } else {
      this.alongSpeed += this.config.alongAcceleration * delta
    }
    const step = Math.min(dist, this.alongSpeed * delta)
    this.seekPos.addScaledVector(this.seekDir, step)
    this.updateFlightChord(this.seekPos, destinationWorld, delta)
    return this.group.position.distanceTo(destinationWorld)
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
    const {
      headingSlerp,
      bankSlerp,
      maxBank,
      bankGain,
      bankTurnRateSmoothing,
      worldUp: wu,
    } = this.config.pose
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
    this.facing.quaternion.copy(this.targetQuat)

    // 横滚：由**瞬时**弦线在水平面内的转弯角速度驱动；机头仍只靠 smoothedFlightDir 柔顺。
    scratch.planarB.copy(dir)
    scratch.planarB.y = 0
    if (scratch.planarB.lengthSq() < 1e-8) {
      this.smoothedTurnRate = THREE.MathUtils.lerp(this.smoothedTurnRate, 0, 1 - Math.exp(-delta * bankTurnRateSmoothing))
      this.targetBank = THREE.MathUtils.lerp(this.targetBank, 0, 1 - Math.exp(-delta * bankSlerp))
    } else {
      scratch.planarB.normalize()
      if (!this.instantPlanarReady) {
        this.lastInstantPlanar.copy(scratch.planarB)
        this.instantPlanarReady = true
        this.smoothedTurnRate = 0
        this.targetBank = 0
      } else {
        scratch.cross.crossVectors(this.lastInstantPlanar, scratch.planarB)
        const dot = THREE.MathUtils.clamp(this.lastInstantPlanar.dot(scratch.planarB), -1, 1)
        const signedAngle = Math.atan2(scratch.cross.y, dot)
        const omegaRaw = signedAngle / Math.max(delta, 1e-6)
        const omega = THREE.MathUtils.clamp(omegaRaw, -5.5, 5.5)
        const tr = 1 - Math.exp(-delta * bankTurnRateSmoothing)
        this.smoothedTurnRate = THREE.MathUtils.lerp(this.smoothedTurnRate, omega, tr)
        this.lastInstantPlanar.copy(scratch.planarB)
        this.targetBank = THREE.MathUtils.clamp(-this.smoothedTurnRate * bankGain, -maxBank, maxBank)
      }
    }

    const tB = 1 - Math.exp(-delta * bankSlerp)
    this.bankAngle = THREE.MathUtils.lerp(this.bankAngle, this.targetBank, tB)
    this.bank.rotation.z = this.bankAngle
  }

  resizeChaseCamera(width: number, height: number) {
    this.chaseCamera.aspect = width / Math.max(height, 1)
    this.chaseCamera.updateProjectionMatrix()
  }

  private pickNextHopDestination(waypoints: THREE.Object3D[]) {
    if (!this.hopEndBody) return
    const prev = this.hopEndBody
    this.hopEndBody = this.pickNextDestinationWaypoint(this.group.position, waypoints, prev)
    this.prepareSeek()
  }

  private static chordDistance(x: THREE.Object3D, y: THREE.Object3D): number {
    x.getWorldPosition(scratch.hopA)
    y.getWorldPosition(scratch.hopB)
    return scratch.hopA.distanceTo(scratch.hopB)
  }

  private static distancePointToWaypoint(from: THREE.Vector3, w: THREE.Object3D): number {
    w.getWorldPosition(scratch.hopB)
    return from.distanceTo(scratch.hopB)
  }

  private static pickTwoDistinct(bodies: THREE.Object3D[]): Nullable<[THREE.Object3D, THREE.Object3D]> {
    if (bodies.length < 2) return null
    const i = Math.floor(Math.random() * bodies.length)
    let j = Math.floor(Math.random() * (bodies.length - 1))
    if (j >= i) j += 1
    return [bodies[i]!, bodies[j]!]
  }

  private static pickRandomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]!
  }

  private static pickFarthestWaypointFromPoint(
    from: THREE.Vector3,
    waypoints: THREE.Object3D[],
    exclude: Nullable<THREE.Object3D>,
  ): THREE.Object3D {
    let best = exclude !== waypoints[0] ? waypoints[0]! : waypoints[1]!
    let bestD = Starship.distancePointToWaypoint(from, best)
    for (const w of waypoints) {
      if (exclude !== null && w === exclude) continue
      const d = Starship.distancePointToWaypoint(from, w)
      if (d > bestD) {
        bestD = d
        best = w
      }
    }
    return best
  }

  private pickNextDestinationWaypoint(
    from: THREE.Vector3,
    waypoints: THREE.Object3D[],
    preferExclude: Nullable<THREE.Object3D>,
  ): THREE.Object3D {
    const { minChord } = this.config.planetHop
    const candidates =
      preferExclude !== null ? waypoints.filter((w) => w !== preferExclude) : [...waypoints]
    const pool = candidates.length > 0 ? candidates : waypoints

    let pick = Starship.pickRandomFrom(pool)
    for (let k = 0; k < 24; k++) {
      if (Starship.distancePointToWaypoint(from, pick) >= minChord) return pick
      pick = Starship.pickRandomFrom(pool)
    }
    return Starship.pickFarthestWaypointFromPoint(from, waypoints, preferExclude)
  }

  private pickRandomBootstrapPair(waypoints: THREE.Object3D[]): Nullable<[THREE.Object3D, THREE.Object3D]> {
    if (waypoints.length < 2) return null
    const minLen = this.config.planetHop.minChord * 1.35
    for (let k = 0; k < 26; k++) {
      const pair = Starship.pickTwoDistinct(waypoints)
      if (!pair) return null
      if (Starship.chordDistance(pair[0]!, pair[1]!) >= minLen) return pair
    }
    return Starship.pickTwoDistinct(waypoints)
  }

  private applySpawnJitter(pos: THREE.Vector3): void {
    const { spawnJitterMin, spawnJitterMax } = this.config.planetHop
    const r = spawnJitterMin + Math.random() * Math.max(0, spawnJitterMax - spawnJitterMin)
    const ang = Math.random() * Math.PI * 2
    pos.x += Math.cos(ang) * r
    pos.z += Math.sin(ang) * r
    pos.y += (Math.random() - 0.5) * r * 0.55
  }

  dispose() {
    this.hopEndBody = null
    this.mixer?.stopAllAction()
    this.mixer = null
    if (this.glbRoot) {
      this.bank.remove(this.glbRoot)
      disposeObject3DSubtree(this.glbRoot)
      this.glbRoot = null
    }
  }
}
