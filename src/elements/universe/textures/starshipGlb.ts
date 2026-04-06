import * as THREE from 'three'

import { Starship, StarshipBuilder } from '../fragments/starship'
import { UNIVERSE_STARSHIP_LANES } from '../constants'
import type { StarSystemRuntime } from '../systems'
import { loadGltfSceneAndClips } from '../utils/loadGltf'
import type { Nullable } from 'nfx-ui/types'
import { safeNullable } from 'nfx-ui/utils'

/** 跨星系飞船 GLB（`index % length` 循环选用；条数由场景 `starshipCount` 决定） */
export const STARSHIP_GLB_URLS: string[] = ['/textures/starship/StellarWing.glb']

/** 与 scene / `prefetchWorldEntryAssets` 共用：加载并挂到 `Starship` */
export async function attachStarshipGlbRoot(ship: Starship, url: string): Promise<void> {
  const { scene, clips } = await loadGltfSceneAndClips(url)
  ship.attachGlbRoot(scene.clone(true), clips)
}

type FleetShipState = {
  starship: Nullable<Starship>
  /** 当前追击目标：行星球心 mesh（每帧取世界坐标作终点） */
  endBody: Nullable<THREE.Object3D>
  launchHold: THREE.Vector3
  launchDelayLeft: number
  restLeft: number
  index: number
}

const scratch = {
  a: new THREE.Vector3(),
  b: new THREE.Vector3(),
}

function chordDistance(x: THREE.Object3D, y: THREE.Object3D): number {
  x.getWorldPosition(scratch.a)
  y.getWorldPosition(scratch.b)
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
  const i = Math.floor(Math.random() * bodies.length)
  let j = Math.floor(Math.random() * (bodies.length - 1))
  if (j >= i) j += 1
  return [bodies[i]!, bodies[j]!]
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
  const ang = Math.random() * Math.PI * 2
  pos.x += Math.cos(ang) * r
  pos.z += Math.sin(ang) * r
  pos.y += (Math.random() - 0.5) * r * 0.55
}

function bootstrapFleetShip(row: FleetShipState, waypoints: THREE.Object3D[]): void {
  const ship = row.starship
  if (!ship || waypoints.length < 2) return

  const pair = pickRandomBootstrapPair(waypoints)
  if (!pair) return
  const [spawnWp, endWp] = Math.random() < 0.5 ? pair : [pair[1], pair[0]]

  row.endBody = endWp
  spawnWp.getWorldPosition(row.launchHold)
  applySpawnJitter(row.launchHold)
  ship.group.position.copy(row.launchHold)
  ship.prepareSeek()
}

function pickNextDestination(row: FleetShipState, waypoints: THREE.Object3D[], shipWorld: THREE.Vector3): void {
  const ship = row.starship
  if (!ship || !row.endBody) return
  const prev = row.endBody
  row.endBody = pickNextDestinationWaypoint(shipWorld, waypoints, prev)
  ship.prepareSeek()
}

export type CreateStarshipFleetOptions = {
  shipCount: number
  onAllShipsLoaded?: () => void
  getChaseViewport?: () => { width: number; height: number }
}

/**
 * 多艘飞船：只负责 **选终点行星、首发延迟、到达休息、换目标**；位移与姿态在 `Starship.updateSeekDestination`。
 */
export function createStarshipFleet(systemRuntimes: StarSystemRuntime[], options: CreateStarshipFleetOptions) {
  const { shipCount: rawCount, onAllShipsLoaded, getChaseViewport } = options
  const shipCount = Math.max(1, Math.floor(rawCount))

  const waypoints = collectPlanetWaypoints(systemRuntimes)
  const root = new THREE.Group()
  root.name = 'starshipFleet'

  const fleet: FleetShipState[] = Array.from({ length: shipCount }, (_, index) => ({
    starship: null,
    endBody: null,
    launchHold: new THREE.Vector3(),
    launchDelayLeft: 0,
    restLeft: 0,
    index,
  }))

  let loadsPending = fleet.length
  const notifyShipLoadDone = () => {
    loadsPending -= 1
    if (loadsPending <= 0) onAllShipsLoaded?.()
  }

  for (const row of fleet) {
    const url = STARSHIP_GLB_URLS[row.index % STARSHIP_GLB_URLS.length]!
    const ship = new Starship(new StarshipBuilder().glbUrl(url).done())
    row.starship = ship
    root.add(ship.group)
    void attachStarshipGlbRoot(ship, url)
      .then(() => {
        bootstrapFleetShip(row, waypoints)
        row.launchDelayLeft = row.index * 1.05 + Math.random() * 1.6
        const vp = getChaseViewport?.()
        if (vp) ship.resizeChaseCamera(vp.width, vp.height)
        notifyShipLoadDone()
      })
      .catch((err) => {
        console.warn('[universe] starship failed', url, err)
        notifyShipLoadDone()
      })
  }

  function getStarship(index: number): Nullable<Starship> {
    return safeNullable(fleet[index]?.starship)
  }

  const { arrivalZoneRadius, restSecondsMin, restSecondsMax } = UNIVERSE_STARSHIP_LANES

  function update(delta: number, prefersReducedMotion: boolean) {
    if (waypoints.length < 2) return

    let dt = Number.isFinite(delta) && delta > 0 ? delta : 0
    if (dt > 0 && dt < 1 / 1200) {
      dt = 1 / 1200
    }

    for (const row of fleet) {
      const ship = row.starship
      if (!ship || !row.endBody) continue

      if (prefersReducedMotion) {
        ship.group.visible = false
        continue
      }

      ship.group.visible = true

      row.endBody.getWorldPosition(scratch.b)

      if (row.launchDelayLeft > 0) {
        row.launchDelayLeft -= dt
        ship.group.position.copy(row.launchHold)
        ship.updateParked(row.launchHold, scratch.b, dt)
        continue
      }

      const distToEnd = ship.group.position.distanceTo(scratch.b)

      if (row.restLeft <= 0 && distToEnd <= arrivalZoneRadius) {
        row.restLeft = restSecondsMin + Math.random() * Math.max(0, restSecondsMax - restSecondsMin)
        ship.prepareSeek()
      }

      ship.updateSeekDestination(scratch.b, dt, row.restLeft > 0)

      if (row.restLeft > 0) {
        row.restLeft -= dt
        if (row.restLeft <= 0) {
          pickNextDestination(row, waypoints, ship.group.position)
        }
      }
    }
  }

  function destroy() {
    for (const row of fleet) {
      row.starship?.dispose()
      row.starship = null
    }
    root.removeFromParent()
  }

  function resizeChaseCameras(width: number, height: number) {
    for (const row of fleet) {
      row.starship?.resizeChaseCamera(width, height)
    }
  }

  return { group: root, update, destroy, getStarship, resizeChaseCameras }
}

export type StarshipFleetController = ReturnType<typeof createStarshipFleet>
