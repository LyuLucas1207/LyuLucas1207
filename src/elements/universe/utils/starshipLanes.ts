import * as THREE from 'three'

import { Starship, StarshipBuilder } from '../fragments/starship'
import { UNIVERSE_STARSHIP_LANES } from '../constants'
import type { StarSystemRuntime } from '../systems'
import { loadGltfSceneAndClips } from './loadGltf'
import { STARSHIP_GLB_URLS } from './universeAssets'
import type { Nullable } from 'nfx-ui/types'

type LaneState = {
  starship: Nullable<Starship>
  /** 当前目标行星（碰撞球 mesh 世界球心） */
  endBody: Nullable<THREE.Object3D>
  /** 首发趴窝期间固定的世界坐标 */
  launchHold: THREE.Vector3
  launchDelayLeft: number
  /** >0：休息中，仍朝当前 `endBody` 球心飞；到时换下一目标 */
  restLeft: number
  alongSpeed: number
  laneIndex: number
}

const scratch = {
  a: new THREE.Vector3(),
  b: new THREE.Vector3(),
  pos: new THREE.Vector3(),
  dir: new THREE.Vector3(),
}

function chordDistance(a: THREE.Object3D, b: THREE.Object3D): number {
  a.getWorldPosition(scratch.a)
  b.getWorldPosition(scratch.b)
  return scratch.a.distanceTo(scratch.b)
}

function distancePointToWaypoint(from: THREE.Vector3, w: THREE.Object3D): number {
  w.getWorldPosition(scratch.b)
  return from.distanceTo(scratch.b)
}

function collectPlanetWaypoints(runtimes: StarSystemRuntime[]): THREE.Object3D[] {
  const out: THREE.Object3D[] = []
  for (const rt of runtimes) {
    for (const p of rt.planets) {
      out.push(p.mesh)
    }
  }
  return out
}

function pickTwoDistinct(bodies: THREE.Object3D[]): [THREE.Object3D, THREE.Object3D] | null {
  if (bodies.length < 2) return null
  const a = Math.floor(Math.random() * bodies.length)
  let b = Math.floor(Math.random() * (bodies.length - 1))
  if (b >= a) b += 1
  return [bodies[a]!, bodies[b]!]
}

function pickRandomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

function pickFarthestWaypointFromPoint(
  from: THREE.Vector3,
  waypoints: THREE.Object3D[],
  exclude: THREE.Object3D | null,
): THREE.Object3D {
  let best = exclude !== waypoints[0] ? waypoints[0]! : waypoints[1]!
  let bestD = distancePointToWaypoint(from, best)
  for (const w of waypoints) {
    if (exclude !== null && w === exclude) continue
    const d = distancePointToWaypoint(from, w)
    if (d > bestD) {
      bestD = d
      best = w
    }
  }
  return best
}

/** 从飞船当前世界坐标选下一目标：优先弦长 ≥ minChord，否则取最远 */
function pickNextDestinationWaypoint(
  from: THREE.Vector3,
  waypoints: THREE.Object3D[],
  preferExclude: THREE.Object3D | null,
): THREE.Object3D {
  const candidates =
    preferExclude !== null ? waypoints.filter((w) => w !== preferExclude) : [...waypoints]
  const pool = candidates.length > 0 ? candidates : waypoints

  let pick = pickRandomFrom(pool)
  for (let k = 0; k < 24; k++) {
    if (distancePointToWaypoint(from, pick) >= UNIVERSE_STARSHIP_LANES.minChord) return pick
    pick = pickRandomFrom(pool)
  }
  return pickFarthestWaypointFromPoint(from, waypoints, preferExclude)
}

function pickRandomBootstrapPair(waypoints: THREE.Object3D[]): [THREE.Object3D, THREE.Object3D] | null {
  if (waypoints.length < 2) return null
  const minLen = UNIVERSE_STARSHIP_LANES.minChord * 1.35
  for (let k = 0; k < 26; k++) {
    const pair = pickTwoDistinct(waypoints)
    if (!pair) return null
    if (chordDistance(pair[0]!, pair[1]!) >= minLen) return pair
  }
  return pickTwoDistinct(waypoints)
}

function applySpawnJitter(pos: THREE.Vector3): void {
  const { spawnJitterMin, spawnJitterMax } = UNIVERSE_STARSHIP_LANES
  const r = spawnJitterMin + Math.random() * Math.max(0, spawnJitterMax - spawnJitterMin)
  const a = Math.random() * Math.PI * 2
  pos.x += Math.cos(a) * r
  pos.z += Math.sin(a) * r
  pos.y += (Math.random() - 0.5) * r * 0.55
}

/** 首次生成：**每条 lane 随机**起点行星 + 终点（尽量满足最短弦长）；出生点在球心附近抖动 */
function bootstrapLane(lane: LaneState, waypoints: THREE.Object3D[]): void {
  const ship = lane.starship
  if (!ship || waypoints.length < 2) return

  const pair = pickRandomBootstrapPair(waypoints)
  if (!pair) return
  const [spawnWp, endWp] = Math.random() < 0.5 ? pair : [pair[1], pair[0]]

  lane.endBody = endWp
  spawnWp.getWorldPosition(lane.launchHold)
  applySpawnJitter(lane.launchHold)
  ship.group.position.copy(lane.launchHold)
  lane.alongSpeed = ship.cruiseSpeed
}

function pickNextDestination(lane: LaneState, waypoints: THREE.Object3D[], shipWorld: THREE.Vector3): void {
  const ship = lane.starship
  if (!ship || !lane.endBody) return
  const prev = lane.endBody
  lane.endBody = pickNextDestinationWaypoint(shipWorld, waypoints, prev)
  lane.alongSpeed = ship.cruiseSpeed
}

/** `arrivalCoast`：已进入到达范围且处于休息计时，沿线改为减速靠向球心 */
function integrateTowardEndWorld(
  ship: Starship,
  lane: LaneState,
  endWorld: THREE.Vector3,
  dt: number,
  arrivalCoast: boolean,
): void {
  scratch.pos.copy(ship.group.position)
  scratch.dir.subVectors(endWorld, scratch.pos)
  const dist = scratch.dir.length()
  if (dist < 1e-9) return
  scratch.dir.multiplyScalar(1 / dist)
  if (arrivalCoast) {
    lane.alongSpeed = Math.max(0, lane.alongSpeed - ship.alongDeceleration * dt)
  } else {
    lane.alongSpeed += ship.alongAcceleration * dt
  }
  const step = Math.min(dist, lane.alongSpeed * dt)
  scratch.pos.addScaledVector(scratch.dir, step)
  ship.updateFlightChord(scratch.pos, endWorld, dt)
}

export type CreateStarshipLanesOptions = {
  laneCount: number
  onAllShipsLoaded?: () => void
  getChaseViewport?: () => { width: number; height: number }
}

export function createStarshipLanes(systemRuntimes: StarSystemRuntime[], options: CreateStarshipLanesOptions) {
  const { laneCount: rawLaneCount, onAllShipsLoaded, getChaseViewport } = options
  const laneCount = Math.max(1, Math.floor(rawLaneCount))

  const waypoints = collectPlanetWaypoints(systemRuntimes)
  const root = new THREE.Group()
  root.name = 'starshipLanes'

  const lanes: LaneState[] = Array.from({ length: laneCount }, (_, laneIndex) => ({
    starship: null,
    endBody: null,
    launchHold: new THREE.Vector3(),
    launchDelayLeft: 0,
    restLeft: 0,
    alongSpeed: 0,
    laneIndex,
  }))

  let loadsPending = lanes.length
  const notifyShipLoadDone = () => {
    loadsPending -= 1
    if (loadsPending <= 0) onAllShipsLoaded?.()
  }

  for (const lane of lanes) {
    const url = STARSHIP_GLB_URLS[lane.laneIndex % STARSHIP_GLB_URLS.length]!
    const ship = new Starship(new StarshipBuilder().glbUrl(url).done())
    lane.starship = ship
    root.add(ship.group)
    void loadGltfSceneAndClips(url)
      .then(({ scene, clips }) => {
        ship.attachGlbRoot(scene.clone(true), clips)
        bootstrapLane(lane, waypoints)
        lane.launchDelayLeft = lane.laneIndex * 1.05 + Math.random() * 1.6
        const vp = getChaseViewport?.()
        if (vp) ship.resizeChaseCamera(vp.width, vp.height)
        notifyShipLoadDone()
      })
      .catch((err) => {
        console.warn('[universe] starship failed', url, err)
        notifyShipLoadDone()
      })
  }

  function getStarship(laneIndex: number): Starship | null {
    return lanes[laneIndex]?.starship ?? null
  }

  const { arrivalZoneRadius, restSecondsMin, restSecondsMax } = UNIVERSE_STARSHIP_LANES

  function update(delta: number, prefersReducedMotion: boolean) {
    if (waypoints.length < 2) return

    let dt = Number.isFinite(delta) && delta > 0 ? delta : 0
    if (dt > 0 && dt < 1 / 1200) {
      dt = 1 / 1200
    }

    for (const lane of lanes) {
      const ship = lane.starship
      if (!ship || !lane.endBody) continue

      if (prefersReducedMotion) {
        ship.group.visible = false
        continue
      }

      ship.group.visible = true

      lane.endBody.getWorldPosition(scratch.b)

      if (lane.launchDelayLeft > 0) {
        lane.launchDelayLeft -= dt
        ship.group.position.copy(lane.launchHold)
        ship.updateParked(lane.launchHold, scratch.b, dt)
        continue
      }

      const distToEnd = ship.group.position.distanceTo(scratch.b)

      if (lane.restLeft <= 0 && distToEnd <= arrivalZoneRadius) {
        lane.restLeft = restSecondsMin + Math.random() * Math.max(0, restSecondsMax - restSecondsMin)
        lane.alongSpeed = ship.cruiseSpeed
      }

      integrateTowardEndWorld(ship, lane, scratch.b, dt, lane.restLeft > 0)

      if (lane.restLeft > 0) {
        lane.restLeft -= dt
        if (lane.restLeft <= 0) {
          pickNextDestination(lane, waypoints, ship.group.position)
        }
      }
    }
  }

  function destroy() {
    for (const lane of lanes) {
      lane.starship?.dispose()
      lane.starship = null
    }
    root.removeFromParent()
  }

  function resizeChaseCameras(width: number, height: number) {
    for (const lane of lanes) {
      lane.starship?.resizeChaseCamera(width, height)
    }
  }

  return { group: root, update, destroy, getStarship, resizeChaseCameras }
}

export type StarshipLanesController = ReturnType<typeof createStarshipLanes>
