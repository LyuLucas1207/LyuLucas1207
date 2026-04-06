import type {
  StarshipChaseCamConfig,
  StarshipConfig,
  StarshipGlowConfig,
  StarshipPlanetHopConfig,
  StarshipPoseConfig,
} from './types'

const DEFAULT_CHASE_CAM: StarshipChaseCamConfig = {
  fov: 68,
  near: 0.08,
  far: 2800,
  localX: 0,
  localY: -1,
  localZ: 10,
  orbitPitchLimit: 1.18,
}

const DEFAULT_GLOW: StarshipGlowConfig = {
  pointColor: 0xd6f0ff,
  pointIntensity: 14,
  pointDistance: 0,
  pointDecay: 1,
}

const DEFAULT_PLANET_HOP: StarshipPlanetHopConfig = {
  minChord: 7,
  spawnJitterMin: 0.6,
  spawnJitterMax: 3.2,
  arrivalZoneRadius: 5,
  restSecondsMin: 0.35,
  restSecondsMax: 2.2,
}

const DEFAULT_POSE: StarshipPoseConfig = {
  headingSlerp: 7,
  bankSlerp: 8,
  maxBank: 0.45,
  bankGain: 0.22,
  bankTurnRateSmoothing: 10,
  worldUp: [0, 1, 0],
  modelYawCorrection: Math.PI,
  modelPitchCorrection: 0,
  modelRollCorrection: 0,
}

const DEFAULTS: StarshipConfig = {
  modelRadius: 1.05,
  cruiseSpeed: 3,
  alongAcceleration: 5,
  alongDeceleration: 7,
  chaseCam: DEFAULT_CHASE_CAM,
  glow: DEFAULT_GLOW,
  planetHop: DEFAULT_PLANET_HOP,
  pose: DEFAULT_POSE,
}

function cloneConfig(base: StarshipConfig): StarshipConfig {
  return {
    ...base,
    chaseCam: { ...base.chaseCam },
    glow: { ...base.glow },
    planetHop: { ...base.planetHop },
    pose: {
      ...base.pose,
      worldUp: [base.pose.worldUp[0], base.pose.worldUp[1], base.pose.worldUp[2]],
    },
  }
}

export class StarshipBuilder {
  private config: StarshipConfig

  constructor() {
    this.config = cloneConfig(DEFAULTS)
  }

  modelRadius(value: number) {
    this.config.modelRadius = value
    return this
  }

  cruiseSpeed(value: number) {
    this.config.cruiseSpeed = value
    return this
  }

  alongAcceleration(value: number) {
    this.config.alongAcceleration = value
    return this
  }

  alongDeceleration(value: number) {
    this.config.alongDeceleration = value
    return this
  }

  chaseCam(value: Partial<StarshipChaseCamConfig>) {
    this.config.chaseCam = { ...this.config.chaseCam, ...value }
    return this
  }

  glow(value: Partial<StarshipGlowConfig>) {
    this.config.glow = { ...this.config.glow, ...value }
    return this
  }

  planetHop(value: Partial<StarshipPlanetHopConfig>) {
    this.config.planetHop = { ...this.config.planetHop, ...value }
    return this
  }

  pose(value: Partial<StarshipPoseConfig>) {
    const next = { ...this.config.pose, ...value }
    if (value.worldUp != null) {
      next.worldUp = [value.worldUp[0], value.worldUp[1], value.worldUp[2]]
    }
    this.config.pose = next
    return this
  }

  done(): StarshipConfig {
    return cloneConfig(this.config)
  }
}
