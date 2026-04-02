export interface LabelPalette {
  /** 标签文字色 */
  color: string
}

export type LabelVariant = 'system' | 'planet'

export interface LabelConfig {
  text: string
  variant: LabelVariant
  palette: LabelPalette
  isLight: boolean
}
