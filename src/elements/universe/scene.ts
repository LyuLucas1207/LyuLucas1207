import * as THREE from 'three'

import type { Nilable } from 'nfx-ui/types'

import { CameraRig } from './libs/camera'
import type { CameraFocusTarget } from './libs/camera'
import {
  UNIVERSE_CAMERA_POSITION,
  UNIVERSE_FOG,
  UNIVERSE_LOOK_AT,
  UNIVERSE_ROTATION_SPEED,
} from './constants'
import { SceneInput } from './libs/input'
import type { HoverInfo } from './libs/input'
import {
  Nebula, NebulaBuilder,
  Stellar, StellarBuilder,
  Stream, StreamBuilder,
  Vortex, VortexBuilder,
} from './fragments'
import { attachRandomPlanetGlb } from './utils/planetGlb'
import { attachRandomRingStripTexture } from './utils/ringTextures'
import { attachRandomSystemStellarGlb } from './utils/stellarGlb'
import {
  attachRandomUniverseBackground,
  disposeSceneBackground,
  spinUniverseBackground,
} from './utils/universeBackground'
import { createStarSystem, createSystemAnchors } from './systems'
import type { StarSystemConfig, UniversePalette } from './types'
import type { UniverseShaders } from './utils/shaders'

export type { HoverInfo } from './libs/input'

type CreateSceneOptions = {
  host: HTMLDivElement
  palette: UniversePalette
  shaders: UniverseShaders
  prefersReducedMotion: boolean
  onDraggingChange: (dragging: boolean) => void
  systems: StarSystemConfig[]
  onFocusSystemChange?: (systemId?: string) => void
  onHoverChange?: (info: Nilable<HoverInfo>) => void
}

export type UniverseSceneController = {
  destroy: () => void
  setFocusSystem: (systemId?: string) => void
  setFocusPlanet: (systemId: string, planetId: string) => void
}

export function createUniverseScene({
  host,
  palette,
  shaders,
  prefersReducedMotion,
  onDraggingChange,
  systems,
  onFocusSystemChange,
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
  attachRandomUniverseBackground(scene)
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

  const galaxyCore = new THREE.Group()
  const coreStarInstance = new Stellar(
    new StellarBuilder().coreStar()
      .palette(palette.stellar)
      .isLight(palette.isStellarLight)
      .shellShaders({ vertex: shaders.coreShellVertex, fragment: shaders.coreShellFragment })
      .done(),
  )
  galaxyCore.add(vortex.points, stream.group, coreStarInstance.group)

  const systemAnchors = createSystemAnchors(Math.min(systems.length, 3))
  // The 3 visible "galaxy systems" felt a bit too small visually, so we
  // slightly scale up the whole group (planets, orbits, label sprites, etc.).
  const SYSTEM_GROUP_SCALE = 1.98
  const systemRuntimes = systems.slice(0, 3).map((system, index) => {
    const runtime = createStarSystem(system, palette, systemAnchors[index] ?? new THREE.Vector3())
    runtime.group.scale.multiplyScalar(SYSTEM_GROUP_SCALE)
    return runtime
  })
  const systemRuntimeMap = new Map(systemRuntimes.map((runtime, index) => [systems[index]?.id, runtime]))
  systemRuntimes.forEach((runtime) => {
    runtime.starMesh.userData.focusSystem = runtime
    galaxyCore.add(runtime.group)
    void attachRandomSystemStellarGlb(runtime.stellar)
    runtime.planets.forEach((p) => {
      void attachRandomPlanetGlb(p)
      if (p.ring) void attachRandomRingStripTexture(p.ring)
    })
  })

  const nebula = new Nebula(
    new NebulaBuilder()
      .palette(palette.nebula)
      .isLight(palette.isNebulaLight)
      .done(),
  )
  scene.add(nebula.group, galaxyCore)

  const interactiveObjects = systemRuntimes.flatMap((runtime) => runtime.interactiveObjects)
  const input = new SceneInput(host, camera, interactiveObjects)
  const cameraRig = new CameraRig(camera)

  input.onDraggingChange = onDraggingChange
  input.onHoverChange = onHoverChange
  input.onBreakFocus = () => cameraRig.clearFocus()
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
    const rt = systemRuntimeMap.get(systemId) ?? null
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
    spinUniverseBackground(scene, timer.getDelta(), !prefersReducedMotion)

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
        const hovered = Boolean(planet.mesh.userData.hovered)
        const targetScale = hovered ? planet.baseScale * 1.2 : planet.baseScale
        planet.body.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.18)
      })
      runtime.satellites.forEach((sat) => sat.update())
      runtime.stellar.update(elapsed)
    })

    nebula.group.children.forEach((child: THREE.Object3D, index: number) => {
      child.position.x += Math.sin(elapsed * 0.08 + index) * 0.014
      child.position.y += Math.cos(elapsed * 0.06 + index * 1.3) * 0.012
    })

    materials.forEach((material) => {
      material.uniforms.uTime.value = elapsed
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
    })

    renderer.render(scene, camera)
    frameId = window.requestAnimationFrame(animate)
  }

  animate()

  const resizeObserver = new ResizeObserver(() => {
    const width = host.clientWidth
    const height = host.clientHeight
    renderer.setSize(width, height)
    cameraRig.resize(width, height)
  })
  resizeObserver.observe(host)

  const destroy = () => {
    window.cancelAnimationFrame(frameId)
    resizeObserver.disconnect()
    timer.dispose()
    input.destroy()
    disposeSceneBackground(scene)
    scene.traverse((child) => {
      const target = child as THREE.Mesh | THREE.Points | THREE.Sprite
      if ('geometry' in target && target.geometry) {
        target.geometry.dispose()
      }
      if ('material' in target && target.material) {
        const materialsToDispose = Array.isArray(target.material) ? target.material : [target.material]
        materialsToDispose.forEach((material) => {
          const materialWithMap = material as THREE.Material & { map?: THREE.Texture | null }
          materialWithMap.map?.dispose()
          material.dispose()
        })
      }
    })
    renderer.dispose()
    host.replaceChildren()
  }

  return {
    destroy,
    setFocusSystem,
    setFocusPlanet,
  } satisfies UniverseSceneController
}
