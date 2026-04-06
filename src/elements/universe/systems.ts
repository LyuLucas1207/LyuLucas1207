import * as THREE from 'three'

import { UNIVERSE_SYSTEM_LAYOUT } from './constants'
import {
  Label, LabelBuilder,
  Orbit, OrbitBuilder,
  Planet, PlanetBuilder,
  Ring, RingBuilder,
  Satellite, SatelliteBuilder,
  Stellar, StellarBuilder,
} from './fragments'
import type { PlanetRuntime } from './fragments'
import type { StarSystemConfig, UniversePalette } from './types'

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
  anchor: THREE.Vector3,
) {
  const group = new THREE.Group()
  group.position.copy(anchor)
  group.userData.systemId = config.id

  const stellar = new Stellar(
    new StellarBuilder()
      .palette(palette.stellar)
      .isLight(palette.isStellarLight)
      .done(),
  )
  const star = stellar.group
  const starMesh = stellar.coreMesh
  const label = new Label(
    new LabelBuilder()
      .text(config.name)
      .variant('system')
      .palette(palette.label)
      .isLight(palette.isLabelLight)
      .done(),
  )
  starMesh.userData.baseScale = 1
  starMesh.userData.hovered = false
  starMesh.userData.systemName = config.name
  starMesh.userData.label = config.name
  group.add(star, label.sprite)

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

    const orbit = new Orbit(
      new OrbitBuilder()
        .radius(planetConfig.orbitRadius)
        .palette(palette.orbit)
        .isLight(palette.isOrbitLight)
        .done(),
    )

    const planetPalette = planetConfig.accent
      ? { surfaceColorPool: [planetConfig.accent] }
      : palette.planet

    const builtPlanetConfig = new PlanetBuilder()
      .planetRadius(planetConfig.planetRadius)
      .palette(planetPalette)
      .isLight(palette.isPlanetLight)
      .done()
    const planet = new Planet(builtPlanetConfig)
    planet.body.position.set(planetConfig.orbitRadius, 0, 0)
    planet.mesh.userData.planetRadius = planetConfig.planetRadius
    planet.mesh.userData.action = planetConfig.onSelect
    planet.mesh.userData.baseScale = 1
    planet.mesh.userData.hovered = false
    planet.mesh.userData.systemName = config.name
    planet.mesh.userData.label = planetConfig.label

    // 星环与卫星二选一（各 50%），避免同时出现；此前并存时卫星轨道常与星环相交，视觉上像「乱飞」。
    const ringOrSatellite = Math.random()
    if (ringOrSatellite < 0.5) {
      const ringPalette = planetConfig.accent
        ? { bandColorPool: [planetConfig.accent] }
        : palette.ring

      const ring = new Ring(
        new RingBuilder()
          .innerRadius(planetConfig.planetRadius * 1.4)
          .outerRadius(planetConfig.planetRadius * (2.8 + variance * 0.8))
          .ringNumber(1 + Math.floor(Math.random() * 3))
          .palette(ringPalette)
          .isLight(palette.isRingLight)
          .rotation([Math.PI / 2 + (variance - 0.5) * 0.9, 0, (variance - 0.5) * 0.7])
          .done(),
      )
      planet.body.add(ring.group)
    } else {
      const satellite = new Satellite(
        new SatelliteBuilder()
          .radius(planetConfig.planetRadius * 0.2)
          .orbitRadius(planetConfig.planetRadius * (3.0 + Math.random() * 0.55))
          .speed(0.015 + variance * 0.02)
          .palette(palette.satellite)
          .isLight(palette.isSatelliteLight)
          .surface({
            roughness: builtPlanetConfig.surface.roughness,
            metalness: builtPlanetConfig.surface.metalness,
          })
          .done(),
      )
      planet.body.add(satellite.group)
      satellites.push(satellite)
    }

    const planetLabel = new Label(
      new LabelBuilder()
        .text(planetConfig.label)
        .variant('planet')
        .palette(palette.label)
        .isLight(palette.isLabelLight)
        .done(),
    )
    planetLabel.sprite.position.set(planetConfig.orbitRadius, 2.9, 0)

    orbitCarrier.add(planet.body, planetLabel.sprite)
    orbitPlane.add(orbit.mesh, orbitCarrier)
    pivot.add(orbitPlane)
    group.add(pivot)
    planets.push({
      planet,
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
