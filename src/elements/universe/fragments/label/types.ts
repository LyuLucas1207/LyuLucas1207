export type LabelPalette =
  | {
      /** 单色标签：用于渐变起止色相同 */
      color: string
    }
  | {
      /** 双端渐变标签 */
      startColor: string
      endColor: string
    }

export type LabelVariant = 'system' | 'planet'

export interface LabelConfig {
  text: string
  variant: LabelVariant
  palette: LabelPalette
  isLight: boolean
}
