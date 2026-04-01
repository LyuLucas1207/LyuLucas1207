import * as THREE from 'three'

import {
  UNIVERSE_CAMERA_POSITION,
  UNIVERSE_CORE_STAR,
  UNIVERSE_FOG,
  UNIVERSE_LIGHT_INTENSITY,
  UNIVERSE_LOOK_AT,
  UNIVERSE_MOTION,
  UNIVERSE_ROTATION_SPEED,
  UNIVERSE_STAR_MATERIAL,
  UNIVERSE_VORTEX_COUNT,
} from './constants'
import { asThreeColor } from './color'
import { buildStreamGeometry, buildVortexGeometry } from './geometry'
import { createNebulaSprites } from './nebula'
import { starfieldFragmentShader } from './shaders/starfieldFragment'
import { starfieldVertexShader } from './shaders/starfieldVertex'
import { createUniverseColors } from './theme'
import type { UniversePalette } from './types'

function buildStarMaterial(baseSize: number, opacity: number, isLight: boolean) {
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
    vertexShader: starfieldVertexShader,
    fragmentShader: starfieldFragmentShader,
  })
}

function createCoreStar(palette: UniversePalette) {
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
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vView;

        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vNormal = normalize(mat3(modelMatrix) * normal);
          vView = normalize(cameraPosition - worldPosition.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vView;
        uniform vec3 uColor;
        uniform float uOpacity;

        void main() {
          float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.4);
          gl_FragColor = vec4(uColor, fresnel * uOpacity);
        }
      `,
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
  prefersReducedMotion: boolean
  onDraggingChange: (dragging: boolean) => void
}

export function createUniverseScene({
  host,
  palette,
  prefersReducedMotion,
  onDraggingChange,
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
      ),
    )
    streamGroup.add(stream)
    streamMaterials.push(stream.material as THREE.ShaderMaterial)
  }

  const galaxyCore = new THREE.Group()
  const coreStar = createCoreStar(palette)
  galaxyCore.add(vortex, streamGroup, coreStar)

  const nebula = createNebulaSprites(palette, colors)
  scene.add(nebula, galaxyCore)

  const forward = new THREE.Vector3()
  const movement = {
    yaw: camera.rotation.y,
    pitch: camera.rotation.x,
    targetYaw: camera.rotation.y,
    targetPitch: camera.rotation.x,
    velocity: new THREE.Vector3(),
    thrust: 0,
  }
  const drag = { active: false, x: 0, y: 0 }

  const rotateCamera = () => {
    camera.rotation.order = 'YXZ'
    camera.rotation.y = movement.yaw
    camera.rotation.x = movement.pitch
  }

  const onPointerDown = (event: PointerEvent) => {
    event.preventDefault()
    drag.active = true
    drag.x = event.clientX
    drag.y = event.clientY
    host.setPointerCapture?.(event.pointerId)
    onDraggingChange(true)
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!drag.active) {
      return
    }

    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    drag.x = event.clientX
    drag.y = event.clientY

    movement.targetYaw -= dx * 0.0024
    movement.targetPitch -= dy * 0.0021
    movement.targetPitch = THREE.MathUtils.clamp(movement.targetPitch, -1.45, 1.45)
  }

  const onPointerUp = (event?: PointerEvent) => {
    drag.active = false
    if (event) {
      host.releasePointerCapture?.(event.pointerId)
    }
    onDraggingChange(false)
  }

  const onWheel = (event: WheelEvent) => {
    event.preventDefault()
    movement.thrust += THREE.MathUtils.clamp(
      event.deltaY * UNIVERSE_MOTION.wheelForce,
      -UNIVERSE_MOTION.wheelClamp,
      UNIVERSE_MOTION.wheelClamp,
    )
  }

  host.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
  host.addEventListener('wheel', onWheel, { passive: false })

  const timer = new THREE.Timer()
  timer.connect(document)
  timer.reset()
  let frameId = 0

  const materials = [vortex.material, ...streamMaterials] as THREE.ShaderMaterial[]

  const animate = () => {
    timer.update()
    const elapsed = timer.getElapsed()

    movement.yaw = THREE.MathUtils.lerp(movement.yaw, movement.targetYaw, UNIVERSE_MOTION.yawLerp)
    movement.pitch = THREE.MathUtils.lerp(movement.pitch, movement.targetPitch, UNIVERSE_MOTION.pitchLerp)
    rotateCamera()

    camera.getWorldDirection(forward)
    movement.velocity.addScaledVector(forward, -movement.thrust * 0.014)
    movement.thrust *= UNIVERSE_MOTION.thrustDecay
    movement.velocity.multiplyScalar(UNIVERSE_MOTION.velocityDecay)
    camera.position.add(movement.velocity)

    if (!prefersReducedMotion && !drag.active) {
      movement.targetYaw += palette.isLight ? UNIVERSE_ROTATION_SPEED.driftLight : UNIVERSE_ROTATION_SPEED.driftDark
      camera.position.x += Math.sin(elapsed * 0.16) * 0.01
      camera.position.y += Math.cos(elapsed * 0.13) * 0.008
    }

    galaxyCore.rotation.y += palette.isLight ? UNIVERSE_ROTATION_SPEED.coreLight : UNIVERSE_ROTATION_SPEED.coreDark

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

  return () => {
    window.cancelAnimationFrame(frameId)
    resizeObserver.disconnect()
    timer.dispose()
    host.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
    host.removeEventListener('wheel', onWheel)
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
}
