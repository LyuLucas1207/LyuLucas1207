import * as THREE from 'three'

import {
  UNIVERSE_CAMERA_LIMITS,
  UNIVERSE_CAMERA_POSITION,
  UNIVERSE_CAMERA_DRIFT,
  UNIVERSE_CORE_STAR,
  UNIVERSE_FOG,
  UNIVERSE_LIGHT_INTENSITY,
  UNIVERSE_LOOK_AT,
  UNIVERSE_MOTION,
  UNIVERSE_ROTATION_SPEED,
  UNIVERSE_STAR_MATERIAL,
  UNIVERSE_SYSTEM_FOCUS,
  UNIVERSE_VORTEX_COUNT,
} from './constants'
import { asThreeColor } from './color'
import { buildStreamGeometry, buildVortexGeometry } from './geometry'
import { createNebulaSprites } from './nebula'
import type { UniverseShaders } from './shaders'
import { createUniverseColors } from './theme'
import { createStarSystem, createSystemAnchors } from './systems'
import type { StarSystemConfig, UniversePalette } from './types'

function buildStarMaterial(
  baseSize: number,
  opacity: number,
  isLight: boolean,
  vertexShader: string,
  fragmentShader: string,
) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexColors: true,
    blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uBaseSize: { value: baseSize },
      uOpacity: { value: opacity },
    },
    vertexShader,
    fragmentShader,
  })
}

function createCoreStar(palette: UniversePalette, shellVertexShader: string, shellFragmentShader: string) {
  const group = new THREE.Group()
  const primaryColor = asThreeColor(palette.primary)
  const lightColor = asThreeColor(palette.primaryLight)
  const highlightColor = asThreeColor(palette.fgHighlight)

  const star = new THREE.Mesh(
    new THREE.SphereGeometry(UNIVERSE_CORE_STAR.radius, 48, 48),
    new THREE.MeshPhysicalMaterial({
      color: primaryColor,
      emissive: primaryColor,
      emissiveIntensity: palette.isLight
        ? UNIVERSE_CORE_STAR.emissiveIntensityLight
        : UNIVERSE_CORE_STAR.emissiveIntensityDark,
      roughness: 0.18,
      metalness: 0.02,
      clearcoat: 0.72,
      clearcoatRoughness: 0.16,
    }),
  )

  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(UNIVERSE_CORE_STAR.shellRadius, 48, 48),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      uniforms: {
        uColor: { value: lightColor },
        uOpacity: { value: palette.isLight ? 0.34 : 0.46 },
      },
      vertexShader: shellVertexShader,
      fragmentShader: shellFragmentShader,
    }),
  )

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(UNIVERSE_CORE_STAR.haloRadius, 48, 48),
    new THREE.MeshBasicMaterial({
      color: lightColor,
      transparent: true,
      opacity: palette.isLight ? UNIVERSE_CORE_STAR.haloOpacityLight : UNIVERSE_CORE_STAR.haloOpacityDark,
      depthWrite: false,
    }),
  )

  const keyLight = new THREE.PointLight(
    highlightColor,
    palette.isLight ? UNIVERSE_CORE_STAR.keyLightIntensityLight : UNIVERSE_CORE_STAR.keyLightIntensityDark,
    UNIVERSE_CORE_STAR.keyLightDistance,
    2,
  )
  keyLight.position.set(10, 7, 14)

  const rimLight = new THREE.PointLight(
    lightColor,
    palette.isLight ? UNIVERSE_CORE_STAR.rimLightIntensityLight : UNIVERSE_CORE_STAR.rimLightIntensityDark,
    UNIVERSE_CORE_STAR.rimLightDistance,
    2,
  )
  rimLight.position.set(-16, -10, -18)

  group.add(star, shell, halo, keyLight, rimLight)
  return group
}

type CreateSceneOptions = {
  host: HTMLDivElement
  palette: UniversePalette
  shaders: UniverseShaders
  prefersReducedMotion: boolean
  onDraggingChange: (dragging: boolean) => void
  systems: StarSystemConfig[]
  sessionSeed: number
  onFocusSystemChange?: (systemId?: string) => void
}

export type UniverseSceneController = {
  destroy: () => void
  setFocusSystem: (systemId?: string) => void
}

export function createUniverseScene({
  host,
  palette,
  shaders,
  prefersReducedMotion,
  onDraggingChange,
  systems,
  sessionSeed,
  onFocusSystemChange,
}: CreateSceneOptions) {
  const colors = createUniverseColors(palette)
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  })

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(host.clientWidth, host.clientHeight)
  renderer.setClearColor(palette.bg, 1)
  renderer.domElement.style.touchAction = 'none'
  host.replaceChildren(renderer.domElement)

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(palette.bg3, palette.isLight ? UNIVERSE_FOG.light : UNIVERSE_FOG.dark)

  const camera = new THREE.PerspectiveCamera(68, host.clientWidth / Math.max(host.clientHeight, 1), 0.1, 2800)
  camera.position.set(UNIVERSE_CAMERA_POSITION.x, UNIVERSE_CAMERA_POSITION.y, UNIVERSE_CAMERA_POSITION.z)
  camera.rotation.order = 'YXZ'
  camera.lookAt(UNIVERSE_LOOK_AT.x, UNIVERSE_LOOK_AT.y, UNIVERSE_LOOK_AT.z)

  const ambientLight = new THREE.AmbientLight(
    '#ffffff',
    palette.isLight ? UNIVERSE_LIGHT_INTENSITY.ambientLight : UNIVERSE_LIGHT_INTENSITY.ambientDark,
  )
  const glowA = new THREE.PointLight(
    colors.primary[2],
    palette.isLight ? UNIVERSE_LIGHT_INTENSITY.glowPrimaryLight : UNIVERSE_LIGHT_INTENSITY.glowPrimaryDark,
    460,
    2,
  )
  const glowB = new THREE.PointLight(
    colors.light[3],
    palette.isLight ? UNIVERSE_LIGHT_INTENSITY.glowAccentLight : UNIVERSE_LIGHT_INTENSITY.glowAccentDark,
    420,
    2,
  )
  glowA.position.set(-50, 34, 18)
  glowB.position.set(42, -24, -30)
  scene.add(ambientLight, glowA, glowB)

  const vortex = new THREE.Points(
    buildVortexGeometry({
      count: palette.isLight ? UNIVERSE_VORTEX_COUNT.light : UNIVERSE_VORTEX_COUNT.dark,
      colors,
      isLight: palette.isLight,
    }),
    buildStarMaterial(
      UNIVERSE_STAR_MATERIAL.vortexBaseSize,
      palette.isLight ? UNIVERSE_STAR_MATERIAL.vortexOpacityLight : UNIVERSE_STAR_MATERIAL.vortexOpacityDark,
      palette.isLight,
      shaders.starfieldVertex,
      shaders.starfieldFragment,
    ),
  )

  const streamGroup = new THREE.Group()
  const streamMaterials: THREE.ShaderMaterial[] = []

  for (let pathIndex = 0; pathIndex < 5; pathIndex += 1) {
    const stream = new THREE.Points(
      buildStreamGeometry({
        pathIndex,
        colors,
        isLight: palette.isLight,
      }),
      buildStarMaterial(
        UNIVERSE_STAR_MATERIAL.streamBaseSize,
        palette.isLight ? UNIVERSE_STAR_MATERIAL.streamOpacityLight : UNIVERSE_STAR_MATERIAL.streamOpacityDark,
        palette.isLight,
        shaders.starfieldVertex,
        shaders.starfieldFragment,
      ),
    )
    streamGroup.add(stream)
    streamMaterials.push(stream.material as THREE.ShaderMaterial)
  }

  const galaxyCore = new THREE.Group()
  const coreStar = createCoreStar(palette, shaders.coreShellVertex, shaders.coreShellFragment)
  galaxyCore.add(vortex, streamGroup, coreStar)

  const systemAnchors = createSystemAnchors(Math.min(systems.length, 3))
  const systemRuntimes = systems.slice(0, 3).map((system, index) =>
    createStarSystem(system, palette, colors, systemAnchors[index] ?? new THREE.Vector3(), sessionSeed + index),
  )
  const systemRuntimeMap = new Map(systemRuntimes.map((runtime, index) => [systems[index]?.id, runtime] as const))
  systemRuntimes.forEach((runtime) => {
    runtime.star.userData.focusSystem = runtime
    galaxyCore.add(runtime.group)
  })

  const nebula = createNebulaSprites(palette, colors)
  scene.add(nebula, galaxyCore)

  const forward = new THREE.Vector3()
  const strafe = new THREE.Vector3()
  const worldUp = new THREE.Vector3(0, 1, 0)
  const moveVector = new THREE.Vector3()
  const movement = {
    yaw: camera.rotation.y,
    pitch: camera.rotation.x,
    targetYaw: camera.rotation.y,
    targetPitch: camera.rotation.x,
    velocity: new THREE.Vector3(),
    thrust: 0,
  }
  const drag = { active: false, x: 0, y: 0 }
  const dragStart = { x: 0, y: 0 }
  const pointer = new THREE.Vector2()
  const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  }
  const raycaster = new THREE.Raycaster()
  const interactiveObjects = systemRuntimes.flatMap((runtime) => runtime.interactiveObjects)
  let hoveredPlanet: THREE.Object3D | null = null
  let focusedSystem: ReturnType<typeof systemRuntimeMap.get> | null = null
  let followFocusedSystem = false
  const desiredCameraPosition = new THREE.Vector3()
  const focusTarget = new THREE.Vector3()
  const focusOffset = new THREE.Vector3()

  const clearFocus = () => {
    focusedSystem = null
    followFocusedSystem = false
    onFocusSystemChange?.(undefined)
  }

  const setFocusSystem = (systemId?: string) => {
    if (!systemId) {
      clearFocus()
      return
    }

    const runtime = systemRuntimeMap.get(systemId) ?? null
    focusedSystem = runtime
    followFocusedSystem = Boolean(runtime)
    if (runtime) {
      movement.velocity.set(0, 0, 0)
      movement.thrust = 0
      onFocusSystemChange?.(runtime.group.userData.systemId as string | undefined)
    }
  }

  const rotateCamera = () => {
    camera.rotation.order = 'YXZ'
    camera.rotation.y = movement.yaw
    camera.rotation.x = movement.pitch
  }

  const applyLookAt = (position: THREE.Vector3, target: THREE.Vector3) => {
    const direction = target.clone().sub(position).normalize()
    movement.targetYaw = Math.atan2(-direction.x, -direction.z)
    movement.targetPitch = Math.asin(THREE.MathUtils.clamp(direction.y, -1, 1))
  }

  const clampCameraPosition = (position: THREE.Vector3) => {
    position.x = THREE.MathUtils.clamp(position.x, -UNIVERSE_CAMERA_LIMITS.x, UNIVERSE_CAMERA_LIMITS.x)
    position.y = THREE.MathUtils.clamp(position.y, UNIVERSE_CAMERA_LIMITS.yMin, UNIVERSE_CAMERA_LIMITS.yMax)
    position.z = THREE.MathUtils.clamp(position.z, -UNIVERSE_CAMERA_LIMITS.z, UNIVERSE_CAMERA_LIMITS.z)
  }

  const updateHoverState = (clientX: number, clientY: number) => {
    const bounds = host.getBoundingClientRect()
    pointer.x = ((clientX - bounds.left) / bounds.width) * 2 - 1
    pointer.y = -((clientY - bounds.top) / bounds.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(interactiveObjects, false)[0]?.object ?? null

    if (hoveredPlanet !== hit) {
      if (hoveredPlanet) hoveredPlanet.userData.hovered = false
      hoveredPlanet = hit
      if (hoveredPlanet) hoveredPlanet.userData.hovered = true
      host.style.cursor = hoveredPlanet ? 'pointer' : 'default'
    }
  }

  const onPointerDown = (event: PointerEvent) => {
    event.preventDefault()
    drag.active = true
    drag.x = event.clientX
    drag.y = event.clientY
    dragStart.x = event.clientX
    dragStart.y = event.clientY
    updateHoverState(event.clientX, event.clientY)
    host.setPointerCapture?.(event.pointerId)
    onDraggingChange(true)
  }

  const onPointerMove = (event: PointerEvent) => {
    updateHoverState(event.clientX, event.clientY)

    if (!drag.active) {
      return
    }

    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    drag.x = event.clientX
    drag.y = event.clientY

    if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
      if (followFocusedSystem || focusedSystem) {
        clearFocus()
      }
    }

    movement.targetYaw -= dx * 0.0024
    movement.targetPitch -= dy * 0.0021
    movement.targetPitch = THREE.MathUtils.clamp(movement.targetPitch, -1.45, 1.45)
  }

  const onPointerUp = (event?: PointerEvent) => {
    const clickDistance = Math.hypot((event?.clientX ?? dragStart.x) - dragStart.x, (event?.clientY ?? dragStart.y) - dragStart.y)
    const shouldActivate = clickDistance < 6 && hoveredPlanet && typeof hoveredPlanet.userData.action === 'function'
    const shouldFocus = clickDistance < 6 && hoveredPlanet && hoveredPlanet.userData.focusSystem
    drag.active = false
    if (event) {
      host.releasePointerCapture?.(event.pointerId)
    }
    onDraggingChange(false)
    if (shouldActivate && hoveredPlanet) {
      hoveredPlanet.userData.action()
    }
    if (shouldFocus && hoveredPlanet) {
      const runtime = hoveredPlanet.userData.focusSystem as (typeof focusedSystem)
      setFocusSystem(runtime?.group.userData.systemId as string | undefined)
    }
  }

  const onWheel = (event: WheelEvent) => {
    event.preventDefault()
    if (followFocusedSystem || focusedSystem) {
      clearFocus()
    }
    movement.thrust += THREE.MathUtils.clamp(
      event.deltaY * UNIVERSE_MOTION.wheelForce,
      -UNIVERSE_MOTION.wheelClamp,
      UNIVERSE_MOTION.wheelClamp,
    )
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase()

    if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
      if (followFocusedSystem || focusedSystem) {
        clearFocus()
      }
      if (key === 'w') keys.forward = true
      if (key === 's') keys.backward = true
      if (key === 'a') keys.left = true
      if (key === 'd') keys.right = true
    }
  }

  const onKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase()

    if (key === 'w') keys.forward = false
    if (key === 's') keys.backward = false
    if (key === 'a') keys.left = false
    if (key === 'd') keys.right = false
  }

  host.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
  host.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)

  const timer = new THREE.Timer()
  timer.connect(document)
  timer.reset()
  let frameId = 0

  const materials = [vortex.material, ...streamMaterials] as THREE.ShaderMaterial[]

  const animate = () => {
    timer.update()
    const elapsed = timer.getElapsed()

    if (focusedSystem && followFocusedSystem) {
      focusedSystem.group.getWorldPosition(focusTarget)
      focusOffset.set(0, UNIVERSE_SYSTEM_FOCUS.heightOffset, focusedSystem.maxOrbitRadius * 1.5)
      desiredCameraPosition.copy(focusedSystem.group.localToWorld(focusOffset.clone()))
      clampCameraPosition(desiredCameraPosition)
      camera.position.lerp(desiredCameraPosition, UNIVERSE_SYSTEM_FOCUS.lerp)
      applyLookAt(camera.position, focusTarget)
    }

    movement.yaw = THREE.MathUtils.lerp(movement.yaw, movement.targetYaw, UNIVERSE_MOTION.yawLerp)
    movement.pitch = THREE.MathUtils.lerp(movement.pitch, movement.targetPitch, UNIVERSE_MOTION.pitchLerp)
    rotateCamera()

    if (followFocusedSystem) {
      movement.velocity.multiplyScalar(0.76)
      movement.thrust = 0
    } else {
      camera.getWorldDirection(forward)
      strafe.crossVectors(forward, worldUp).normalize()
      moveVector.set(0, 0, 0)

      if (keys.forward) moveVector.add(forward)
      if (keys.backward) moveVector.addScaledVector(forward, -1)
      if (keys.left) moveVector.addScaledVector(strafe, -1)
      if (keys.right) moveVector.add(strafe)

      if (moveVector.lengthSq() > 0) {
        moveVector.normalize()
        movement.velocity.addScaledVector(moveVector, UNIVERSE_MOTION.keyAcceleration)
        movement.velocity.y += moveVector.y * UNIVERSE_MOTION.keyVerticalAcceleration
        movement.velocity.clampLength(0, UNIVERSE_MOTION.keyMaxSpeed)
      }

      movement.velocity.addScaledVector(forward, -movement.thrust * 0.014)
      movement.thrust *= UNIVERSE_MOTION.thrustDecay
      movement.velocity.multiplyScalar(UNIVERSE_MOTION.velocityDecay)
      camera.position.add(movement.velocity)
      clampCameraPosition(camera.position)
    }

    if (!prefersReducedMotion && !drag.active) {
      movement.targetYaw += palette.isLight ? UNIVERSE_ROTATION_SPEED.driftLight : UNIVERSE_ROTATION_SPEED.driftDark
      camera.position.x += Math.sin(elapsed * 0.16) * UNIVERSE_CAMERA_DRIFT.xAmplitude
      camera.position.y += Math.cos(elapsed * 0.13) * UNIVERSE_CAMERA_DRIFT.yAmplitude
      clampCameraPosition(camera.position)
    }

    galaxyCore.rotation.y += palette.isLight ? UNIVERSE_ROTATION_SPEED.coreLight : UNIVERSE_ROTATION_SPEED.coreDark
    systemRuntimes.forEach((runtime) => {
      const starHovered = Boolean(runtime.star.userData.hovered)
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
    })

    nebula.children.forEach((child, index) => {
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
    camera.aspect = width / Math.max(height, 1)
    camera.updateProjectionMatrix()
  })

  resizeObserver.observe(host)

  const destroy = () => {
    window.cancelAnimationFrame(frameId)
    resizeObserver.disconnect()
    timer.dispose()
    host.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
    host.removeEventListener('wheel', onWheel)
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    host.style.cursor = 'default'
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
  } satisfies UniverseSceneController
}
