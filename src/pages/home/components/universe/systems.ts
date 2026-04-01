import * as THREE from 'three'

import { asThreeColor, pickColor, toRgba } from './color'
import { UNIVERSE_SYSTEM_LAYOUT } from './constants'
import type { StarSystemConfig, UniverseColorPool, UniversePalette } from './types'

type PlanetRuntime = {
  orbitCarrier: THREE.Group
  body: THREE.Object3D
  mesh: THREE.Mesh
  speed: number
  baseScale: number
}

export type StarSystemRuntime = {
  group: THREE.Group
  star: THREE.Object3D
  planets: PlanetRuntime[]
  interactiveObjects: THREE.Object3D[]
  maxOrbitRadius: number
}

function createLabelSprite(label: string, color: string, variant: 'system' | 'planet' = 'planet') {
  const canvas = document.createElement('canvas')
  canvas.width = variant === 'system' ? 352 : 248
  canvas.height = variant === 'system' ? 90 : 68
  const context = canvas.getContext('2d')

  if (!context) {
    return new THREE.Sprite()
  }

  const width = canvas.width
  const height = canvas.height
  const inset = variant === 'system' ? 12 : 10
  const radius = variant === 'system' ? 8 : 7
  const fillGradient = context.createLinearGradient(0, 0, width, height)
  fillGradient.addColorStop(0, toRgba(color, variant === 'system' ? 0.085 : 0.065))
  fillGradient.addColorStop(1, toRgba(color, variant === 'system' ? 0.018 : 0.014))

  context.clearRect(0, 0, width, height)
  context.fillStyle = fillGradient
  context.beginPath()
  context.roundRect(inset, inset, width - inset * 2, height - inset * 2, radius)
  context.fill()

  context.strokeStyle = toRgba(color, variant === 'system' ? 0.18 : 0.12)
  context.lineWidth = 1
  context.stroke()

  context.fillStyle = color
  context.font = variant === 'system' ? '700 22px "Segoe UI"' : '600 18px "Segoe UI"'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(label, width / 2, height / 2 + 2)

  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(variant === 'system' ? 22 : 13.8, variant === 'system' ? 5.8 : 3.8, 1)
  sprite.position.set(0, variant === 'system' ? 10.6 : 3.25, 0)
  return sprite
}

function createSystemStar(palette: UniversePalette) {
  const group = new THREE.Group()
  const primary = asThreeColor(palette.primary)
  const highlight = asThreeColor(palette.fgHighlight)

  const star = new THREE.Mesh(
    new THREE.SphereGeometry(3.2, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: primary,
      emissive: primary,
      emissiveIntensity: palette.isLight ? 2.4 : 3.4,
      roughness: 0.2,
      clearcoat: 0.7,
      clearcoatRoughness: 0.14,
    }),
  )

  const corona = new THREE.Mesh(
    new THREE.SphereGeometry(5.2, 32, 32),
    new THREE.MeshBasicMaterial({
      color: highlight,
      transparent: true,
      opacity: palette.isLight ? 0.16 : 0.22,
      depthWrite: false,
    }),
  )

  const keyLight = new THREE.PointLight(highlight, palette.isLight ? 10 : 14, 54, 2)
  keyLight.position.set(4, 4, 5)

  group.add(star, corona, keyLight)
  return group
}

function createOrbitRing(radius: number, color: string) {
  return new THREE.Mesh(
    new THREE.TorusGeometry(radius, 0.04, 10, 120),
    new THREE.MeshBasicMaterial({
      color: asThreeColor(color),
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    }),
  )
}

function createPlanet(option: StarSystemConfig['planets'][number], color: string, palette: UniversePalette) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(option.planetRadius, 24, 24),
    new THREE.MeshStandardMaterial({
      color: asThreeColor(color),
      emissive: asThreeColor(color),
      emissiveIntensity: palette.isLight ? 0.6 : 1.2,
      roughness: 0.34,
      metalness: 0.12,
    }),
  )
}

function seededValue(seed: string) {
  let hash = 2166136261

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 1000) / 1000
}

function createPlanetBody(
  option: StarSystemConfig['planets'][number],
  color: string,
  palette: UniversePalette,
  variance: number,
) {
  const body = new THREE.Group()
  const mesh = createPlanet(
    {
      ...option,
      planetRadius: option.planetRadius * (0.88 + variance * 0.34),
    },
    color,
    palette,
  )

  body.add(mesh)

  const hasRing = variance > 0.52
  if (hasRing) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(option.planetRadius * (1.65 + variance * 0.5), option.planetRadius * 0.16, 12, 72),
      new THREE.MeshBasicMaterial({
        color: asThreeColor(color),
        transparent: true,
        opacity: palette.isLight ? 0.28 : 0.42,
        depthWrite: false,
      }),
    )
    ring.rotation.x = Math.PI / 2 + (variance - 0.5) * 0.9
    ring.rotation.z = (variance - 0.5) * 0.7
    body.add(ring)
  }

  return { body, mesh }
}

export function createSystemAnchors(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const angle = UNIVERSE_SYSTEM_LAYOUT.startAngle + (Math.PI * 2 * index) / Math.max(count, 1)
    return new THREE.Vector3(
      Math.cos(angle) * UNIVERSE_SYSTEM_LAYOUT.radius,
      0,
      Math.sin(angle) * UNIVERSE_SYSTEM_LAYOUT.radius,
    )
  })
}

export function createStarSystem(
  config: StarSystemConfig,
  palette: UniversePalette,
  colors: UniverseColorPool,
  anchor: THREE.Vector3,
  sessionSeed: number,
) {
  const group = new THREE.Group()
  group.position.copy(anchor)
  group.userData.systemId = config.id

  const systemColors = [...colors.primary, ...colors.hover, ...colors.light]
  const star = createSystemStar(palette)
  const label = createLabelSprite(config.name, palette.primary, 'system')
  star.userData.baseScale = 1
  star.userData.hovered = false
  group.add(star, label)

  const planets: PlanetRuntime[] = []
  const interactiveObjects: THREE.Object3D[] = [star]
  const maxOrbitRadius = config.planets.reduce((largest, planet) => Math.max(largest, planet.orbitRadius), 0)

  config.planets.forEach((planetConfig, index) => {
    const variance = (seededValue(`${planetConfig.id}-${sessionSeed}`) + Math.random() * 0.0001) % 1
    const pivot = new THREE.Group()
    const orbitPlane = new THREE.Group()
    orbitPlane.rotation.x = Math.PI / 2 + (variance - 0.5) * 0.42
    orbitPlane.rotation.y = variance * Math.PI * 2
    orbitPlane.rotation.z = (variance - 0.5) * 0.36
    const orbitCarrier = new THREE.Group()
    orbitCarrier.rotation.z =
      (Math.PI * 2 * index) / Math.max(config.planets.length, 1) + variance * Math.PI * 2

    const ring = createOrbitRing(planetConfig.orbitRadius, pickColor(colors.light))

    const planetColor = planetConfig.accent ?? pickColor(systemColors)
    const { body, mesh } = createPlanetBody(planetConfig, planetColor, palette, variance)
    body.position.set(planetConfig.orbitRadius, 0, 0)
    mesh.userData.action = planetConfig.onSelect
    mesh.userData.baseScale = 1
    mesh.userData.hovered = false
    mesh.userData.label = planetConfig.label

    const planetLabel = createLabelSprite(planetConfig.label, palette.primary, 'planet')
    planetLabel.position.set(planetConfig.orbitRadius, 2.9, 0)

    orbitCarrier.add(body, planetLabel)
    orbitPlane.add(ring, orbitCarrier)
    pivot.add(orbitPlane)
    group.add(pivot)
    planets.push({
      orbitCarrier,
      body,
      mesh,
      speed: planetConfig.orbitSpeed * (0.72 + variance * 0.66) * (variance > 0.5 ? 1 : -1),
      baseScale: 1,
    })
    interactiveObjects.push(mesh)
  })

  return { group, star, planets, interactiveObjects, maxOrbitRadius } satisfies StarSystemRuntime
}
