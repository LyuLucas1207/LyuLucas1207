import { LanguageEnum } from 'nfx-ui/languages'
import { useTheme } from 'nfx-ui/themes'

export function LanguageMoodGraphics({
  language,
  className,
}: {
  language: LanguageEnum
  className?: string
}) {
  const { currentTheme } = useTheme()
  const { variables } = currentTheme.colors

  const stroke = variables.primary
  const dotFill = variables.primaryTransparent

  const commonDrawProps = { stroke, fill: 'none' as const }
  const commonDotProps = { stroke, fill: dotFill }

  switch (language) {
    case LanguageEnum.ZH:
      return (
        <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
          {/* 方块字格 + 笔画意象 */}
          <path d="M200 90 H440 V250 H200 Z" data-overlay-draw {...commonDrawProps} />
          <path d="M230 120 H410" data-overlay-draw {...commonDrawProps} />
          <path d="M320 120 V220" data-overlay-draw {...commonDrawProps} />
          <path d="M250 180 H390" data-overlay-draw {...commonDrawProps} />
          <path d="M260 220 H380" data-overlay-draw {...commonDrawProps} />
          <circle cx="230" cy="145" r="7" data-overlay-dot {...commonDotProps} />
          <circle cx="410" cy="195" r="6" data-overlay-dot {...commonDotProps} />
        </svg>
      )
    case LanguageEnum.EN:
      return (
        <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
          {/* 拉丁行距 + 衬线弧 */}
          <path d="M180 120 H460" data-overlay-draw {...commonDrawProps} />
          <path d="M180 170 H440" data-overlay-draw {...commonDrawProps} />
          <path d="M200 220 H420" data-overlay-draw {...commonDrawProps} />
          <path d="M220 95 C240 75 280 75 300 95" data-overlay-draw {...commonDrawProps} />
          <path d="M380 95 C400 75 440 75 460 95" data-overlay-draw {...commonDrawProps} />
          <circle cx="320" cy="145" r="8" data-overlay-dot {...commonDotProps} />
          <circle cx="250" cy="195" r="6" data-overlay-dot {...commonDotProps} />
          <circle cx="390" cy="195" r="6" data-overlay-dot {...commonDotProps} />
        </svg>
      )
    case LanguageEnum.FR:
      return (
        <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
          {/* 流动弧线 + 重音点 */}
          <path d="M180 200 C240 120 400 120 460 200" data-overlay-draw {...commonDrawProps} />
          <path d="M200 230 C280 180 360 180 440 230" data-overlay-draw {...commonDrawProps} />
          <path d="M300 90 L315 70 L330 90" data-overlay-draw {...commonDrawProps} />
          <path d="M400 85 L415 65 L430 85" data-overlay-draw {...commonDrawProps} />
          <circle cx="315" cy="62" r="5" data-overlay-dot {...commonDotProps} />
          <circle cx="415" cy="57" r="5" data-overlay-dot {...commonDotProps} />
          <circle cx="320" cy="200" r="9" data-overlay-dot {...commonDotProps} />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
          <circle cx="320" cy="170" r="88" data-overlay-draw {...commonDrawProps} />
          <path d="M260 170 H400" data-overlay-draw {...commonDrawProps} />
          <circle cx="320" cy="170" r="10" data-overlay-dot {...commonDotProps} />
        </svg>
      )
  }
}
