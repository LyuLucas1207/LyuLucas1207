import type { LabelConfig, LabelPalette, LabelVariant } from './types'

const DEFAULT_PALETTE: LabelPalette = {
  color: '#ffffff',
}

const DEFAULTS: LabelConfig = {
  text: '',
  variant: 'planet',
  palette: DEFAULT_PALETTE,
  isLight: true,
}

export class LabelBuilder {
  private config: LabelConfig

  constructor() {
    this.config = { ...DEFAULTS }
  }

  text(value: string) {
    this.config.text = value
    return this
  }

  variant(value: LabelVariant) {
    this.config.variant = value
    return this
  }

  palette(value: LabelPalette) {
    this.config.palette = value
    return this
  }

  isLight(value: boolean) {
    this.config.isLight = value
    return this
  }

  done(): LabelConfig {
    return { ...this.config }
  }
}
