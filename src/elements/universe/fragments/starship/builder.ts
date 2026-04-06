import type {
  StarshipChaseCamConfig,
  StarshipConfig,
  StarshipGlowConfig,
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
  emissiveHex: 0x9ce8ff,
  emissiveIntensity: 9.5,
  pointColor: 0xd6f0ff,
  pointIntensity: 14,
  pointDistance: 0,
  pointDecay: 1,
}

const DEFAULT_POSE: StarshipPoseConfig = {
  bankSlerp: 8,
  maxBank: 0.45,
  bankGain: 2.4,
  worldUp: [0, 1, 0],
  modelYawCorrection: Math.PI,
  modelPitchCorrection: 0,
  modelRollCorrection: 0,
}

const DEFAULTS: StarshipConfig = {
  glbUrl: '',
  modelRadius: 1.05,
  cruiseSpeed: 12,
  chaseCam: DEFAULT_CHASE_CAM,
  glow: DEFAULT_GLOW,
  pose: DEFAULT_POSE,
}

function cloneConfig(base: StarshipConfig): StarshipConfig {
  return {
    ...base,
    chaseCam: { ...base.chaseCam },
    glow: { ...base.glow },
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

  glbUrl(value: string) {
    this.config.glbUrl = value
    return this
  }

  modelRadius(value: number) {
    this.config.modelRadius = value
    return this
  }

  cruiseSpeed(value: number) {
    this.config.cruiseSpeed = value
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
