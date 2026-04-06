import * as THREE from 'three'

import { Starship, StarshipBuilder } from '../fragments/starship'
import { UNIVERSE_STARSHIP_LANES } from '../constants'
import type { StarSystemRuntime } from '../systems'
import { loadGltfSceneAndClips } from './loadGltf'
import { STARSHIP_GLB_URLS, STARSHIP_SCENE_I18N_KEYS } from './universeAssets'
import type { Nullable } from 'nfx-ui/types'

type LaneState = {
  starship: Nullable<Starship>
  startBody: Nullable<THREE.Object3D>
  endBody: Nullable<THREE.Object3D>
  lastArrivalBody: Nullable<THREE.Object3D>
  /** 起飞前在起点「趴窝」倒计时（秒），错开各条航线 */
  launchDelayLeft: number
  restLeft: number
  laneIndex: number
}

const scratch = {
  a: new THREE.Vector3(),
  b: new THREE.Vector3(),
  pos: new THREE.Vector3(),
  dir: new THREE.Vector3(),
}

function collectPlanetBodies(runtimes: StarSystemRuntime[]): THREE.Object3D[] {
  const bodies: THREE.Object3D[] = []
  for (const rt of runtimes) {
    for (const p of rt.planets) {
      bodies.push(p.body)
    }
  }
  return bodies
}

function pickTwoDistinct(bodies: THREE.Object3D[]): [THREE.Object3D, THREE.Object3D] | null {
  if (bodies.length < 2) return null
  const a = Math.floor(Math.random() * bodies.length)
  let b = Math.floor(Math.random() * (bodies.length - 1))
  if (b >= a) b += 1
  return [bodies[a]!, bodies[b]!]
}

function pickRandomEndFrom(start: THREE.Object3D, bodies: THREE.Object3D[]): THREE.Object3D {
  const candidates = bodies.filter((b) => b !== start)
  if (candidates.length === 0) return bodies[0]!
  return candidates[Math.floor(Math.random() * candidates.length)]!
}

/** 只更新起点/终点引用，并把飞船放到起点行星中心；飞行由 `update` 每帧按 `cruiseSpeed` 追终点。 */
function pickLeg(lane: LaneState, bodies: THREE.Object3D[]): void {
  if (bodies.length < 2 || !lane.starship) return

  let start: THREE.Object3D
  let end: THREE.Object3D

  if (lane.lastArrivalBody) {
    start = lane.lastArrivalBody
    end = pickRandomEndFrom(start, bodies)
    let ok = false
    for (let k = 0; k < 24; k++) {
      start.getWorldPosition(scratch.a)
      end.getWorldPosition(scratch.b)
      if (scratch.a.distanceTo(scratch.b) >= UNIVERSE_STARSHIP_LANES.minChord) {
        ok = true
        break
      }
      end = pickRandomEndFrom(start, bodies)
    }
    if (!ok) {
      start.getWorldPosition(scratch.a)
      end.getWorldPosition(scratch.b)
    }
  } else {
    let chosen: [THREE.Object3D, THREE.Object3D] | null = null
    for (let k = 0; k < 22; k++) {
      const pair = pickTwoDistinct(bodies)
      if (!pair) return
      pair[0].getWorldPosition(scratch.a)
      pair[1].getWorldPosition(scratch.b)
      if (scratch.a.distanceTo(scratch.b) >= UNIVERSE_STARSHIP_LANES.minChord) {
        chosen = pair
        break
      }
    }
    if (!chosen) {
      chosen = pickTwoDistinct(bodies)
      if (!chosen) return
    }
    start = chosen[0]
    end = chosen[1]
  }

  lane.startBody = start
  lane.endBody = end
  start.getWorldPosition(scratch.a)
  lane.starship.group.position.copy(scratch.a)
  if (UNIVERSE_STARSHIP_LANES.hideWhileDocked) {
    lane.starship.group.visible = true
  }
}

export function createStarshipLanes(
  systemRuntimes: StarSystemRuntime[],
  onAllShipsLoaded?: () => void,
  getChaseViewport?: () => { width: number; height: number },
) {
  const planetBodies = collectPlanetBodies(systemRuntimes)
  const root = new THREE.Group()
  root.name = 'starshipLanes'

  const laneCount = STARSHIP_SCENE_I18N_KEYS.length
  const lanes: LaneState[] = Array.from({ length: laneCount }, (_, laneIndex) => ({
    starship: null,
    startBody: null,
    endBody: null,
    lastArrivalBody: null,
    launchDelayLeft: 0,
    restLeft: 0,
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
        pickLeg(lane, planetBodies)
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

  const eps = UNIVERSE_STARSHIP_LANES.arrivalEpsilon

  function update(delta: number, prefersReducedMotion: boolean) {
    if (planetBodies.length < 2) return

    for (const lane of lanes) {
      const ship = lane.starship
      if (!ship || !lane.startBody || !lane.endBody) continue

      if (prefersReducedMotion) {
        ship.group.visible = false
        continue
      }

      if (lane.restLeft > 0) {
        if (UNIVERSE_STARSHIP_LANES.hideWhileDocked) {
          ship.group.visible = false
        }
        lane.restLeft -= delta
        lane.endBody.getWorldPosition(scratch.b)
        ship.updateParked(scratch.b, scratch.b, delta)
        if (lane.restLeft <= 0) {
          pickLeg(lane, planetBodies)
          lane.launchDelayLeft = Math.random() * 0.75
        }
        continue
      }

      ship.group.visible = true

      lane.endBody.getWorldPosition(scratch.b)

      if (lane.launchDelayLeft > 0) {
        lane.launchDelayLeft -= delta
        lane.startBody.getWorldPosition(scratch.pos)
        ship.group.position.copy(scratch.pos)
        ship.updateParked(scratch.pos, scratch.b, delta)
        continue
      }

      scratch.pos.copy(ship.group.position)
      scratch.dir.subVectors(scratch.b, scratch.pos)
      const dist = scratch.dir.length()
      if (dist <= eps) {
        lane.lastArrivalBody = lane.endBody
        lane.restLeft = 0.35 + Math.random() * 1.85
        continue
      }

      scratch.dir.multiplyScalar(1 / dist)
      const step = Math.min(dist, ship.cruiseSpeed * delta)
      scratch.pos.addScaledVector(scratch.dir, step)
      ship.updateFlightChord(scratch.pos, scratch.b, delta)
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
