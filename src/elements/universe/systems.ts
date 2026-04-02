import * as THREE from 'three'

import { toRgbaWithAlpha } from 'nfx-ui/utils'

import { pickColor } from './color'
import { UNIVERSE_SYSTEM_LAYOUT } from './constants'
import type { PlanetRuntime } from './planet'
import { Planet, PlanetBuilder } from './planet'
import { Ring, RingBuilder } from './ring'
import { Satellite, SatelliteBuilder } from './satellite'
import { Stellar, StellarBuilder } from './stellar'
import type { StarSystemConfig, UniverseColorPool, UniversePalette } from './types'

export type StarSystemRuntime = {
  group: THREE.Group
  star: THREE.Object3D
  starMesh: THREE.Mesh
  stellar: Stellar
  planets: PlanetRuntime[]
  satellites: Satellite[]
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
  fillGradient.addColorStop(0, toRgbaWithAlpha(color, variant === 'system' ? 0.085 : 0.065))
  fillGradient.addColorStop(1, toRgbaWithAlpha(color, variant === 'system' ? 0.018 : 0.014))

  context.clearRect(0, 0, width, height)
  context.fillStyle = fillGradient
  context.beginPath()
  context.roundRect(inset, inset, width - inset * 2, height - inset * 2, radius)
  context.fill()

  context.strokeStyle = toRgbaWithAlpha(color, variant === 'system' ? 0.18 : 0.12)
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

function createOrbitRing(radius: number, color: string) {
  return new THREE.Mesh(
    new THREE.TorusGeometry(radius, 0.04, 10, 120),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    }),
  )
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
  const stellar = new Stellar(new StellarBuilder().palette(palette).done())
  const star = stellar.group
  const starMesh = stellar.coreMesh
  const label = createLabelSprite(config.name, palette.primary, 'system')
  starMesh.userData.baseScale = 1
  starMesh.userData.hovered = false
  starMesh.userData.systemName = config.name
  starMesh.userData.label = config.name
  group.add(star, label)

  const planets: PlanetRuntime[] = []
  const satellites: Satellite[] = []
  const interactiveObjects: THREE.Object3D[] = [starMesh]
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

    const orbitRing = createOrbitRing(planetConfig.orbitRadius, pickColor(colors.light))

    const planetColor = planetConfig.accent ?? pickColor(systemColors)
    const planet = new Planet(
      new PlanetBuilder()
        .planetRadius(planetConfig.planetRadius)
        .color(planetColor)
        .palette(palette)
        .done(),
    )
    planet.body.position.set(planetConfig.orbitRadius, 0, 0)
    planet.mesh.userData.action = planetConfig.onSelect
    planet.mesh.userData.baseScale = 1
    planet.mesh.userData.hovered = false
    planet.mesh.userData.systemName = config.name
    planet.mesh.userData.label = planetConfig.label

    if (variance > 0.52) {
      const ring = new Ring(
        new RingBuilder()
          .innerRadius(planetConfig.planetRadius * 1.4)
          .outerRadius(planetConfig.planetRadius * (2.8 + variance * 0.8))
          .ringNumber(1 + Math.floor(Math.random() * 3))
          .color(planetColor)
          .rotation([Math.PI / 2 + (variance - 0.5) * 0.9, 0, (variance - 0.5) * 0.7])
          .done(),
      )
      planet.body.add(ring.group)
    }

    if (variance > 0.62) {
      const satellite = new Satellite(
        new SatelliteBuilder()
          .radius(planetConfig.planetRadius * 0.2)
          .orbitRadius(planetConfig.planetRadius * 2.2)
          .speed(0.015 + variance * 0.02)
          .color(pickColor(systemColors))
          .isLight(palette.isLight)
          .done(),
      )
      planet.body.add(satellite.group)
      satellites.push(satellite)
    }

    const planetLabel = createLabelSprite(planetConfig.label, palette.primary, 'planet')
    planetLabel.position.set(planetConfig.orbitRadius, 2.9, 0)

    orbitCarrier.add(planet.body, planetLabel)
    orbitPlane.add(orbitRing, orbitCarrier)
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

  return { group, star, starMesh, stellar, planets, satellites, interactiveObjects, maxOrbitRadius } satisfies StarSystemRuntime
}
