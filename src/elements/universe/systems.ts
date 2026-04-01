import * as THREE from 'three'

import { pickColor, toRgba } from './color'
import { UNIVERSE_SYSTEM_LAYOUT } from './constants'
import type { PlanetRuntime } from './planet'
import { Planet } from './planet'
import { Stellar, SYSTEM_STAR_PRESET } from './stellar'
import type { StarSystemConfig, UniverseColorPool, UniversePalette } from './types'

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
) {
  const group = new THREE.Group()
  group.position.copy(anchor)
  group.userData.systemId = config.id

  const systemColors = [...colors.primary, ...colors.hover, ...colors.light]
  const { group: star } = new Stellar(SYSTEM_STAR_PRESET, palette)
  const label = createLabelSprite(config.name, palette.primary, 'system')
  star.userData.baseScale = 1
  star.userData.hovered = false
  group.add(star, label)

  const planets: PlanetRuntime[] = []
  const interactiveObjects: THREE.Object3D[] = [star]
  const maxOrbitRadius = config.planets.reduce((largest, planet) => Math.max(largest, planet.orbitRadius), 0)

  config.planets.forEach((planetConfig, index) => {
    const variance = Math.random()
    const pivot = new THREE.Group()
    const orbitPlane = new THREE.Group()
    orbitPlane.rotation.x = Math.PI / 2 + (variance - 0.5) * 0.42
    orbitPlane.rotation.y = variance * Math.PI * 2
    orbitPlane.rotation.z = (variance - 0.5) * 0.36
    const orbitCarrier = new THREE.Group()
    orbitCarrier.rotation.z =
      (Math.PI * 2 * index) / Math.max(config.planets.length, 1) + variance * Math.PI * 2

    const ring = Planet.createOrbitRing(planetConfig.orbitRadius, pickColor(colors.light))

    const planetColor = planetConfig.accent ?? pickColor(systemColors)
    const planet = new Planet(planetConfig, planetColor, palette, variance)
    planet.body.position.set(planetConfig.orbitRadius, 0, 0)
    planet.mesh.userData.action = planetConfig.onSelect
    planet.mesh.userData.baseScale = 1
    planet.mesh.userData.hovered = false
    planet.mesh.userData.label = planetConfig.label

    const planetLabel = createLabelSprite(planetConfig.label, palette.primary, 'planet')
    planetLabel.position.set(planetConfig.orbitRadius, 2.9, 0)

    orbitCarrier.add(planet.body, planetLabel)
    orbitPlane.add(ring, orbitCarrier)
    pivot.add(orbitPlane)
    group.add(pivot)
    planets.push({
      orbitCarrier,
      body: planet.body,
      mesh: planet.mesh,
      speed: planetConfig.orbitSpeed * (0.72 + variance * 0.66) * (variance > 0.5 ? 1 : -1),
      baseScale: 1,
    })
    interactiveObjects.push(planet.mesh)
  })

  return { group, star, planets, interactiveObjects, maxOrbitRadius } satisfies StarSystemRuntime
}
