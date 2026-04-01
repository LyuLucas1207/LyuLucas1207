import type { RingConfig } from './types'

const DEFAULTS: RingConfig = {
  innerRadius: 2.0,
  outerRadius: 3.2,
  thickness: 0.06,
  ringNumber: 1,
  gap: 0.15,
  gapJitter: 0.08,
  randomGap: true,
  segments: 64,
  color: '#ffffff',
  rotation: [0, 0, 0],
}

export class RingBuilder {
  private config: RingConfig

  constructor() {
    this.config = { ...DEFAULTS }
  }

  innerRadius(value: number) {
    this.config.innerRadius = value
    return this
  }

  outerRadius(value: number) {
    this.config.outerRadius = value
    return this
  }

  thickness(value: number) {
    this.config.thickness = value
    return this
  }

  ringNumber(value: number) {
    this.config.ringNumber = value
    return this
  }

  gap(value: number) {
    this.config.gap = value
    return this
  }

  gapJitter(value: number) {
    this.config.gapJitter = value
    return this
  }

  randomGap(value: boolean) {
    this.config.randomGap = value
    return this
  }

  segments(value: number) {
    this.config.segments = value
    return this
  }

  color(value: string) {
    this.config.color = value
    return this
  }

  rotation(value: [number, number, number]) {
    this.config.rotation = value
    return this
  }

  done(): RingConfig {
    return { ...this.config }
  }
}
