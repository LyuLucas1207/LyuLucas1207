import * as THREE from 'three'

import { UNIVERSE_SYSTEM_LAYOUT } from './constants'
import { Group } from './libs/group'
import { pickDistinctSatelliteTextureUrls } from './textures/satelliteTexture'
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
  const group = new Group({ name: `starSystem:${config.id}`, userData: { systemId: config.id } })
  group.position.copy(anchor)

  const stellar = new Stellar(
    new StellarBuilder()
      .palette(palette.stellar)
      .isLight(palette.isStellarLight)
      .coreHover({ systemName: config.name, label: config.name, baseScale: 1, hovered: false })
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
  stellar.attach(group)
  label.attach(group)

  const planets: PlanetRuntime[] = []
  const satellites: Satellite[] = []
  const interactiveObjects: THREE.Object3D[] = [starMesh]
  const maxOrbitRadius = config.planets.reduce((largest, planet) => Math.max(largest, planet.orbitRadius), 0)

  config.planets.forEach((planetConfig, index) => {
    const variance = Math.random()
    const pivot = new Group({ name: 'planetOrbitPivot' })
    const orbitPlane = new Group({ name: 'planetOrbitPlane' })
    orbitPlane.rotation.x = Math.PI / 2 + (variance - 0.5) * 0.42
    orbitPlane.rotation.y = variance * Math.PI * 2
    orbitPlane.rotation.z = (variance - 0.5) * 0.36
    const orbitCarrier = new Group({ name: 'planetOrbitCarrier' })
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
      .pick({
        planetId: planetConfig.id,
        systemName: config.name,
        label: planetConfig.label,
        action: planetConfig.onSelect,
        baseScale: 1,
        hovered: false,
      })
      .done()
    const planet = new Planet(builtPlanetConfig)
    planet.setPosition(planetConfig.orbitRadius, 0, 0)

    // 星环与卫星二选一（各 50%），避免同时出现；此前并存时卫星轨道常与星环相交，视觉上像「乱飞」。
    const ringOrSatellite = Math.random()
    let ringForRuntime: Ring | undefined
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
      ringForRuntime = ring
      ring.attach(planet.body)
    } else {
      const satelliteCount = 1 + Math.floor(Math.random() * 3)
      const textureUrls = pickDistinctSatelliteTextureUrls(satelliteCount)
      const satelliteSpeed = 0.015 + variance * 0.02
      for (let j = 0; j < satelliteCount; j++) {
        const jVar = Math.random()
        const roughBase = builtPlanetConfig.surface.roughness
        const satellite = new Satellite(
          new SatelliteBuilder()
            .radius(planetConfig.planetRadius * (0.28 + j * 0.03 + jVar * 0.08))
            .segments(12 + Math.floor(Math.random() * 4) * 2)
            .orbitRadius(planetConfig.planetRadius * (2.72 + j * 0.46 + jVar * 0.52))
            .speed(satelliteSpeed)
            .palette(palette.satellite)
            .isLight(palette.isSatelliteLight)
            .surface({
              roughness: THREE.MathUtils.clamp(roughBase + (jVar - 0.35) * 0.26, 0.12, 0.92),
              metalness: 0,
            })
            .done(),
        )
        satellite.mergeUserData({ satelliteTextureUrl: textureUrls[j] })
        const orbitTilt = new Group({ name: 'satelliteOrbitTilt' })
        orbitTilt.rotation.x = (jVar - 0.5) * 1.22
        orbitTilt.rotation.z = ((j + 1) * 0.41 + variance * 0.55) * (j % 2 === 0 ? 1 : -1)
        orbitTilt.rotation.y = j * 0.89 + jVar * 0.74
        satellite.attach(orbitTilt)
        planet.body.add(orbitTilt)
        satellites.push(satellite)
      }
    }

    const planetLabel = new Label(
      new LabelBuilder()
        .text(planetConfig.label)
        .variant('planet')
        .palette(palette.label)
        .isLight(palette.isLabelLight)
        .done(),
    )
    planetLabel.setPosition(planetConfig.orbitRadius, 2.9, 0)

    planet.attach(orbitCarrier)
    planetLabel.attach(orbitCarrier)
    orbit.attach(orbitPlane)
    orbitPlane.add(orbitCarrier)
    pivot.add(orbitPlane)
    group.add(pivot)
    planets.push({
      planet,
      orbitCarrier,
      body: planet.body,
      mesh: planet.mesh,
      speed: planetConfig.orbitSpeed * (0.72 + variance * 0.66) * (variance > 0.5 ? 1 : -1),
      baseScale: 1,
      ring: ringForRuntime,
    })
    interactiveObjects.push(planet.mesh)
  })

  const runtime = {
    group,
    star,
    starMesh,
    stellar,
    planets,
    satellites,
    interactiveObjects,
    maxOrbitRadius,
  } satisfies StarSystemRuntime
  for (const p of planets) {
    p.planet.mergeUserData({ focusSystem: runtime })
  }
  return runtime
}
