import * as THREE from 'three'

import type { Nilable, Nullable } from 'nfx-ui/types'
import { safeNullable, safeOr } from 'nfx-ui/utils'

import { CameraRig } from './libs/camera'
import type { CameraFocusTarget } from './libs/camera'
import { Group } from './libs/group'
import {
  UNIVERSE_CAMERA_POSITION,
  UNIVERSE_FOG,
  UNIVERSE_LOOK_AT,
  UNIVERSE_ROTATION_SPEED,
} from './constants'
import { SceneInput } from './libs/input'
import type { HoverInfo } from './libs/input'
import {
  collectPlanetWaypoints,
  Nebula, NebulaBuilder,
  Starship, StarshipBuilder,
  Stellar, StellarBuilder,
  Stream, StreamBuilder,
  Vortex, VortexBuilder,
} from './fragments'
import { attachRandomPlanetGlb } from './textures/planetGlb'
import { attachSatelliteSurfaceTexture } from './textures/satelliteTexture'
import { attachRandomRingStripTexture } from './textures/ringTextures'
import { attachRandomSystemStellarGlb } from './textures/stellarGlb'
import {
  attachRandomUniverseTexture,
  disposeUniverseTexture,
  spinUniverseTexture,
} from './textures/universeTextures'
import { createStarSystem, createSystemAnchors } from './systems'
import { attachStarshipGlbRoot } from './textures/starshipGlb'
import type { StarSystemConfig, UniversePalette } from './types'
import { disposeObject3DSubtree } from './utils/disposeThreeResources'
import type { UniverseShaders } from './utils/shaders'

export type { HoverInfo } from './libs/input'

type CreateSceneOptions = {
  host: HTMLDivElement
  palette: UniversePalette
  shaders: UniverseShaders
  prefersReducedMotion: boolean
  onDraggingChange: (dragging: boolean) => void
  systems: StarSystemConfig[]
  /** 飞船数量，由 Home / World 页面传入 */
  starshipCount: number
  onFocusSystemChange?: (systemId?: string) => void
  /** 用户拖拽打断跟焦时触发（清空 React 里的跟船状态等） */
  onBreakCameraFollow?: () => void
  onHoverChange?: (info: Nilable<HoverInfo>) => void
}

export type UniverseSceneController = {
  destroy: () => void
  setFocusSystem: (systemId?: string) => void
  setFocusPlanet: (systemId: string, planetId: string) => void
  /** `shipIndex` 对应舰队下标（与 `attachStarshipGlbRoot` 取模同一列表）；`null` 取消跟船 */
  setFollowStarship: (shipIndex: Nullable<number>) => void
}

export function createUniverseScene({
  host,
  palette,
  shaders,
  prefersReducedMotion,
  onDraggingChange,
  systems,
  starshipCount,
  onFocusSystemChange,
  onBreakCameraFollow,
  onHoverChange,
}: CreateSceneOptions) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  })

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(host.clientWidth, host.clientHeight)
  renderer.setClearColor(palette.sceneBg, 1)
  renderer.domElement.style.touchAction = 'none'
  host.replaceChildren(renderer.domElement)

  const scene = new THREE.Scene()
  attachRandomUniverseTexture(scene)
  // Keep fog density as "dark-universe" baseline; colors come from the theme.
  scene.fog = new THREE.FogExp2(palette.sceneFogColor, UNIVERSE_FOG.dark)

  const camera = new THREE.PerspectiveCamera(68, host.clientWidth / Math.max(host.clientHeight, 1), 0.1, 2800)
  camera.position.set(UNIVERSE_CAMERA_POSITION.x, UNIVERSE_CAMERA_POSITION.y, UNIVERSE_CAMERA_POSITION.z)
  camera.rotation.order = 'YXZ'
  camera.lookAt(UNIVERSE_LOOK_AT.x, UNIVERSE_LOOK_AT.y, UNIVERSE_LOOK_AT.z)


  const vortex = new Vortex(
    new VortexBuilder()
      .palette(palette.vortex)
      .isLight(palette.isVortexLight)
      .shaders({ vertex: shaders.starfieldVertex, fragment: shaders.starfieldFragment })
      .done(),
  )

  const stream = new Stream(
    new StreamBuilder()
      .palette(palette.stream)
      .isLight(palette.isStreamLight)
      .shaders({ vertex: shaders.starfieldVertex, fragment: shaders.starfieldFragment })
      .done(),
  )

  const galaxyCore = new Group({ name: 'galaxyCore' })
  const coreStarInstance = new Stellar(
    new StellarBuilder().coreStar()
      .palette(palette.stellar)
      .isLight(palette.isStellarLight)
      .shellShaders({ vertex: shaders.coreShellVertex, fragment: shaders.coreShellFragment })
      .done(),
  )
  vortex.attach(galaxyCore)
  stream.attach(galaxyCore)
  coreStarInstance.attach(galaxyCore)

  const systemAnchors = createSystemAnchors(Math.min(systems.length, 3))
  // The 3 visible "galaxy systems" felt a bit too small visually, so we
  // slightly scale up the whole group (planets, orbits, label sprites, etc.).
  const SYSTEM_GROUP_SCALE = 1.98
  const systemRuntimes = systems.slice(0, 3).map((system, index) => {
    const runtime = createStarSystem(system, palette, safeOr(systemAnchors[index], new THREE.Vector3()))
    runtime.group.scale.multiplyScalar(SYSTEM_GROUP_SCALE)
    return runtime
  })
  const systemRuntimeMap = new Map(systemRuntimes.map((runtime, index) => [systems[index]?.id, runtime]))
  const maxGalaxyOrbit = Math.max(1, ...systemRuntimes.map((r) => r.maxOrbitRadius))
  systemRuntimes.forEach((runtime) => {
    runtime.stellar.mergeUserData({ focusSystem: runtime })
    galaxyCore.add(runtime.group)
    void attachRandomSystemStellarGlb(runtime.stellar)
    runtime.planets.forEach((p) => {
      void attachRandomPlanetGlb(p)
      if (p.ring) void attachRandomRingStripTexture(p.ring)
    })
    runtime.satellites.forEach((sat) => {
      const u = sat.userData.satelliteTextureUrl
      void attachSatelliteSurfaceTexture(sat, typeof u === 'string' ? u : undefined)
    })
  })

  const nebula = new Nebula(
    new NebulaBuilder()
      .palette(palette.nebula)
      .isLight(palette.isNebulaLight)
      .done(),
  )
  const warmRendererPrograms = () => {
    try {
      renderer.compile(scene, camera)
    } catch {
      /* compile 在极个别环境下可能抛错，忽略即可 */
    }
  }

  const planetWaypoints = collectPlanetWaypoints(systemRuntimes)
  const starshipRoot = new Group({ name: 'starships' })
  const starships: Starship[] = []
  const shipN = Math.max(1, Math.floor(starshipCount))
  let starshipLoadsPending = shipN
  const onStarshipLoadDone = () => {
    starshipLoadsPending -= 1
    if (starshipLoadsPending <= 0) {
      requestAnimationFrame(() => {
        for (const s of starships) {
          s.resizeChaseCamera(host.clientWidth, host.clientHeight)
        }
        warmRendererPrograms()
      })
    }
  }
  for (let i = 0; i < shipN; i++) {
    const ship = new Starship(new StarshipBuilder().done())
    ship.setPlanetHopLaunchDelay(i * 1.05 + Math.random() * 1.6)
    ship.attach(starshipRoot)
    starships.push(ship)
    void attachStarshipGlbRoot(ship, i)
      .then(() => {
        ship.bootstrapPlanetHop(planetWaypoints)
        ship.resizeChaseCamera(host.clientWidth, host.clientHeight)
        onStarshipLoadDone()
      })
      .catch((err) => {
        console.warn('[universe] starship GLB failed', i, err)
        onStarshipLoadDone()
      })
  }
  nebula.attach(scene)
  scene.add(galaxyCore, starshipRoot)
  for (const s of starships) {
    s.resizeChaseCamera(host.clientWidth, host.clientHeight)
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(warmRendererPrograms)
  })
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(warmRendererPrograms, { timeout: 2500 })
  } else {
    window.setTimeout(warmRendererPrograms, 1200)
  }

  const interactiveObjects = systemRuntimes.flatMap((runtime) => runtime.interactiveObjects)
  let cameraRig!: CameraRig
  const input = new SceneInput(host, () => cameraRig.getRenderCamera(), interactiveObjects)
  cameraRig = new CameraRig(camera)

  input.onDraggingChange = onDraggingChange
  input.onHoverChange = onHoverChange
  input.onBreakFocus = () => {
    cameraRig.clearFocus()
    onBreakCameraFollow?.()
  }
  input.onObjectClick = (obj, event) => {
    if (event.button !== 0) return

    const action = obj.userData.action
    if (typeof action === 'function') {
      action()
      return
    }

    const runtime = obj.userData.focusSystem as (CameraFocusTarget & { group: THREE.Group }) | undefined
    if (runtime) {
      setFocusSystem(runtime.group.userData.systemId as string | undefined)
    }
  }
  cameraRig.onFocusSystemChange = onFocusSystemChange

  const setFocusSystem = (systemId?: string) => {
    if (!systemId) {
      cameraRig.clearFocus()
      return
    }
    const rt = safeNullable(systemRuntimeMap.get(systemId))
    if (!rt) return
    cameraRig.setFocus({
      group: rt.group,
      maxOrbitRadius: rt.maxOrbitRadius,
    })
  }

  const setFocusPlanet = (systemId: string, planetId: string) => {
    const rt = systemRuntimeMap.get(systemId)
    if (!rt) return
    const entry = rt.planets.find((p) => p.mesh.userData.planetId === planetId)
    if (!entry) return
    cameraRig.setFocus({
      group: rt.group,
      maxOrbitRadius: rt.maxOrbitRadius,
      follow: entry.body,
      followFrameRadius: entry.mesh.userData.planetRadius as number,
      followRole: 'planet',
    })
  }

  const setFollowStarship = (shipIndex: Nullable<number>) => {
    if (shipIndex === null) {
      cameraRig.clearFocus()
      return
    }
    const ship = starships[shipIndex]
    if (!ship) return
    ship.resizeChaseCamera(host.clientWidth, host.clientHeight)
    cameraRig.setFocus({
      group: galaxyCore,
      maxOrbitRadius: maxGalaxyOrbit,
      follow: ship.facing,
      followFrameRadius: ship.config.modelRadius,
      followRole: 'starship',
      starshipChaseCamera: ship.chaseCamera,
      starshipOrbitPitchLimit: ship.config.chaseCam.orbitPitchLimit,
    })
  }

  const timer = new THREE.Timer()
  timer.connect(document)
  timer.reset()
  let frameId = 0
  const materials = [vortex.material, ...stream.materials]

  const animate = () => {
    timer.update()
    const elapsed = timer.getElapsed()
    const delta = timer.getDelta()
    spinUniverseTexture(scene, delta, !prefersReducedMotion)

    coreStarInstance.update(elapsed)
    vortex.update(elapsed)
    stream.update(elapsed)

    cameraRig.update(input, elapsed, {
      prefersReducedMotion,
      // Treat universe baseline as dark.
      isLight: false,
    })

    galaxyCore.rotation.y += UNIVERSE_ROTATION_SPEED.coreDark

    systemRuntimes.forEach((runtime) => {
      const starHovered = Boolean(runtime.starMesh.userData.hovered)
      runtime.star.scale.lerp(
        new THREE.Vector3(starHovered ? 1.08 : 1, starHovered ? 1.08 : 1, starHovered ? 1.08 : 1),
        0.18,
      )
      runtime.planets.forEach((planet) => {
        planet.orbitCarrier.rotation.z += planet.speed
        planet.planet.update(elapsed)
        const hovered = Boolean(planet.mesh.userData.hovered)
        const targetScale = hovered ? planet.baseScale * 1.2 : planet.baseScale
        planet.body.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.18)
      })
      runtime.satellites.forEach((sat) => sat.update())
      runtime.stellar.update(elapsed)
    })

    /* 航线端点必须用 **本帧** galaxyCore + 轨道角更新后的 world 矩阵，否则船会相对行星中心漂移 */
    for (const ship of starships) {
      ship.tickPlanetHop(planetWaypoints, delta, prefersReducedMotion)
    }

    nebula.group.children.forEach((child: THREE.Object3D, index: number) => {
      child.position.x += Math.sin(elapsed * 0.08 + index) * 0.014
      child.position.y += Math.cos(elapsed * 0.06 + index * 1.3) * 0.012
    })

    materials.forEach((material) => {
      material.uniforms.uTime.value = elapsed
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
    })

    renderer.render(scene, cameraRig.getRenderCamera())
    frameId = window.requestAnimationFrame(animate)
  }

  animate()

  const resizeObserver = new ResizeObserver(() => {
    const width = host.clientWidth
    const height = host.clientHeight
    renderer.setSize(width, height)
    cameraRig.resize(width, height)
    for (const s of starships) {
      s.resizeChaseCamera(width, height)
    }
  })
  resizeObserver.observe(host)

  const destroy = () => {
    window.cancelAnimationFrame(frameId)
    resizeObserver.disconnect()
    timer.dispose()
    input.destroy()
    for (const s of starships) {
      s.dispose()
    }
    disposeUniverseTexture(scene)
    disposeObject3DSubtree(scene)
    renderer.dispose()
    host.replaceChildren()
  }

  return {
    destroy,
    setFocusSystem,
    setFocusPlanet,
    setFollowStarship,
  } satisfies UniverseSceneController
}
