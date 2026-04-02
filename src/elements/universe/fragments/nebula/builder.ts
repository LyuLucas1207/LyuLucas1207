import type { NebulaConfig, NebulaPalette } from './types'

const DEFAULT_PALETTE: NebulaPalette = {
  colorPool: ['#aaaaaa'],
}

const DEFAULTS: NebulaConfig = {
  palette: DEFAULT_PALETTE,
  isLight: false,
}

export class NebulaBuilder {
  private config: NebulaConfig

  constructor() {
    this.config = { ...DEFAULTS }
  }

  palette(value: NebulaPalette) {
    this.config.palette = value
    return this
  }

  isLight(value: boolean) {
    this.config.isLight = value
    return this
  }

  done(): NebulaConfig {
    return { ...this.config }
  }
}
