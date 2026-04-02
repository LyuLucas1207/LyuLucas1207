import { ThemeEnum } from 'nfx-ui/themes'

type ThemePalette = {
  // Theme-stable (hardcoded) palette, used for all moods of the same theme.
  primary: string
  bg2: string
  bg3: string
  /** rgba(primaryLight, 0.16) */
  dotFill: string
  /** rgba(primary, 0.24) */
  glowStrokeFill: string
}

function getThemePalette(theme: ThemeEnum): ThemePalette {
  // Hardcoded values copied from local `NFX-UI/src/themes/themes/colors/*.ts`.
  // Important: these colors do NOT depend on runtime theme CSS variables.
  switch (theme) {
    case ThemeEnum.LIGHT:
      return {
        bg2: '#F8FAFC',
        bg3: '#F1F5F9',
        primary: '#334155',
        dotFill: 'rgba(203, 213, 225, 0.16)', // #CBD5E1
        glowStrokeFill: 'rgba(51, 65, 85, 0.24)', // #334155
      }
    case ThemeEnum.CORPORATE:
      return {
        bg2: '#F8FAFC',
        bg3: '#EFF6FF',
        primary: '#2563EB',
        dotFill: 'rgba(147, 197, 253, 0.16)', // #93C5FD
        glowStrokeFill: 'rgba(37, 99, 235, 0.24)', // #2563EB
      }
    case ThemeEnum.FOREST:
      return {
        bg2: '#F0FDF4',
        bg3: '#ECFDF5',
        primary: '#15803D',
        dotFill: 'rgba(134, 239, 172, 0.16)', // #86EFAC
        glowStrokeFill: 'rgba(21, 128, 61, 0.24)', // #15803D
      }
    case ThemeEnum.DARK:
      return {
        bg2: '#18181B',
        bg3: '#27272A',
        primary: '#D97706',
        dotFill: 'rgba(252, 211, 77, 0.16)', // #FCD34D
        glowStrokeFill: 'rgba(217, 119, 6, 0.24)', // #D97706
      }
    case ThemeEnum.COSMIC:
      return {
        bg2: '#151332',
        bg3: '#1E1B4B',
        primary: '#8B5CF6',
        dotFill: 'rgba(196, 181, 253, 0.16)', // #C4B5FD
        glowStrokeFill: 'rgba(139, 92, 246, 0.24)', // #8B5CF6
      }
    case ThemeEnum.COFFEE:
      return {
        bg2: '#28201A',
        bg3: '#3A2E24',
        primary: '#C49A6C',
        dotFill: 'rgba(232, 213, 192, 0.16)', // #E8D5C0
        glowStrokeFill: 'rgba(196, 154, 108, 0.24)', // #C49A6C
      }
    case ThemeEnum.WINE:
      return {
        bg2: '#2D0F1A',
        bg3: '#3F1525',
        primary: '#9F1239',
        dotFill: 'rgba(253, 164, 175, 0.16)', // #FDA4AF
        glowStrokeFill: 'rgba(159, 18, 57, 0.24)', // #9F1239
      }
    case ThemeEnum.WHEAT:
      return {
        bg2: '#FFF8E7',
        bg3: '#FEF3C7',
        primary: '#B45309',
        dotFill: 'rgba(252, 211, 77, 0.16)', // #FCD34D
        glowStrokeFill: 'rgba(180, 83, 9, 0.24)', // #B45309
      }
    case ThemeEnum.DEFAULT:
    default:
      return {
        bg2: '#F9FAFB',
        bg3: '#F3F4F6',
        primary: '#DC2626',
        dotFill: 'rgba(252, 165, 165, 0.16)', // #FCA5A5
        glowStrokeFill: 'rgba(220, 38, 38, 0.24)', // #DC2626
      }
  }
}

export function getThemeMoodShellBackground(theme: ThemeEnum) {
  const palette = getThemePalette(theme)
  // Used by the overlay shell background (theme-stable, hardcoded).
  return `radial-gradient(circle at center, ${palette.glowStrokeFill}, transparent 28%),linear-gradient(180deg, ${palette.bg3}, ${palette.bg2})`
}

function renderDefaultSvg(strokeHex: string, dotFill: string, className?: string) {
  const stroke = strokeHex
  const drawProps = { stroke, fill: 'none' as const }
  const dotProps = { stroke, fill: dotFill }
  return (
    <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
      {/* Crimson target + spark */}
      <path d="M320 70 C408 70 485 130 510 210 C485 290 408 320 320 320 C232 320 155 290 130 210 C155 130 232 70 320 70 Z" data-overlay-draw {...drawProps} />
      <path d="M320 110 C385 110 436 155 456 210 C436 265 385 300 320 300 C255 300 204 265 184 210 C204 155 255 110 320 110 Z" data-overlay-draw {...drawProps} />
      <path d="M320 95 V240" data-overlay-draw {...drawProps} />
      <path d="M205 210 H435" data-overlay-draw {...drawProps} />
      <path d="M250 140 L390 280" data-overlay-draw {...drawProps} />
      <circle cx="320" cy="210" r="10" data-overlay-dot {...dotProps} />
      <circle cx="435" cy="210" r="7" data-overlay-dot {...dotProps} />
      <circle cx="250" cy="140" r="6" data-overlay-dot {...dotProps} />
    </svg>
  )
}

function renderLightSvg(strokeHex: string, dotFill: string, className?: string) {
  const stroke = strokeHex
  const drawProps = { stroke, fill: 'none' as const }
  const dotProps = { stroke, fill: dotFill }
  return (
    <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
      {/* Sun + rays */}
      <path d="M320 105 C370 105 410 145 410 195 C410 245 370 285 320 285 C270 285 230 245 230 195 C230 145 270 105 320 105 Z" data-overlay-draw {...drawProps} />
      <path d="M320 55 V95" data-overlay-draw {...drawProps} />
      <path d="M320 285 V325" data-overlay-draw {...drawProps} />
      <path d="M220 195 H260" data-overlay-draw {...drawProps} />
      <path d="M380 195 H420" data-overlay-draw {...drawProps} />
      <path d="M250 135 L280 165" data-overlay-draw {...drawProps} />
      <path d="M360 165 L390 135" data-overlay-draw {...drawProps} />
      <path d="M250 255 L280 225" data-overlay-draw {...drawProps} />
      <path d="M360 225 L390 255" data-overlay-draw {...drawProps} />
      <circle cx="320" cy="195" r="9" data-overlay-dot {...dotProps} />
      <circle cx="280" cy="165" r="6" data-overlay-dot {...dotProps} />
      <circle cx="390" cy="135" r="6" data-overlay-dot {...dotProps} />
    </svg>
  )
}

function renderCorporateSvg(strokeHex: string, dotFill: string, className?: string) {
  const stroke = strokeHex
  const drawProps = { stroke, fill: 'none' as const }
  const dotProps = { stroke, fill: dotFill }
  return (
    <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
      {/* Skyscraper + chart */}
      <path d="M230 295 V145 L275 115 V295" data-overlay-draw {...drawProps} />
      <path d="M365 295 V95 L415 135 V295" data-overlay-draw {...drawProps} />
      <path d="M275 165 H365" data-overlay-draw {...drawProps} />
      <path d="M240 295 H400" data-overlay-draw {...drawProps} />
      <path d="M255 235 H285 V265 H255 Z" data-overlay-draw {...drawProps} />
      <path d="M300 220 H330 V265 H300 Z" data-overlay-draw {...drawProps} />
      <path d="M345 200 H375 V265 H345 Z" data-overlay-draw {...drawProps} />
      <circle cx="315" cy="225" r="7" data-overlay-dot {...dotProps} />
      <circle cx="360" cy="210" r="7" data-overlay-dot {...dotProps} />
    </svg>
  )
}

function renderForestSvg(strokeHex: string, dotFill: string, className?: string) {
  const stroke = strokeHex
  const drawProps = { stroke, fill: 'none' as const }
  const dotProps = { stroke, fill: dotFill }
  return (
    <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
      {/* Leaves */}
      <path d="M320 70 C285 110 255 155 265 210 C275 265 325 285 370 260 C415 235 420 165 405 120 C392 85 355 60 320 70 Z" data-overlay-draw {...drawProps} />
      <path d="M285 130 C250 150 220 190 225 220 C230 250 265 255 290 245 C315 235 330 205 320 175 C312 150 300 135 285 130 Z" data-overlay-draw {...drawProps} />
      <path d="M360 120 C395 115 425 130 430 160 C435 190 410 215 380 220" data-overlay-draw {...drawProps} />
      <path d="M305 250 C295 275 305 295 320 315" data-overlay-draw {...drawProps} />
      <path d="M335 250 C345 275 335 295 320 315" data-overlay-draw {...drawProps} />
      {/* veins */}
      <path d="M320 105 C305 135 300 170 315 205" data-overlay-draw {...drawProps} />
      <path d="M300 170 C270 185 260 210 270 235" data-overlay-draw {...drawProps} />
      <circle cx="270" cy="235" r="7" data-overlay-dot {...dotProps} />
      <circle cx="405" cy="165" r="7" data-overlay-dot {...dotProps} />
    </svg>
  )
}

function renderDarkSvg(strokeHex: string, dotFill: string, className?: string) {
  const stroke = strokeHex
  const drawProps = { stroke, fill: 'none' as const }
  const dotProps = { stroke, fill: dotFill }
  return (
    <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
      {/* Moon + stars */}
      <path d="M400 90 C345 110 320 160 330 205 C342 255 395 280 435 260 C405 245 395 215 405 185 C415 155 445 130 475 120 C455 95 428 80 400 90 Z" data-overlay-draw {...drawProps} />
      <path d="M470 85 L480 95" data-overlay-draw {...drawProps} />
      <path d="M485 110 L495 120" data-overlay-draw {...drawProps} />
      <circle cx="470" cy="85" r="6" data-overlay-dot {...dotProps} />
      <circle cx="505" cy="145" r="6" data-overlay-dot {...dotProps} />
      <circle cx="225" cy="120" r="6" data-overlay-dot {...dotProps} />
      <circle cx="255" cy="155" r="7" data-overlay-dot {...dotProps} />
    </svg>
  )
}

function renderCosmicSvg(strokeHex: string, dotFill: string, className?: string) {
  const stroke = strokeHex
  const drawProps = { stroke, fill: 'none' as const }
  const dotProps = { stroke, fill: dotFill }
  return (
    <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
      {/* Galaxy spiral + rings */}
      <path d="M205 215 C250 120 360 95 430 140 C500 185 470 285 380 280 C295 275 260 190 315 165 C365 142 410 180 400 225 C390 270 320 260 305 230" data-overlay-draw {...drawProps} />
      <path d="M300 95 C340 140 340 200 300 250" data-overlay-draw {...drawProps} />
      <path d="M375 110 C420 155 430 220 395 270" data-overlay-draw {...drawProps} />
      <circle cx="405" cy="165" r="9" data-overlay-dot {...dotProps} />
      <circle cx="310" cy="185" r="7" data-overlay-dot {...dotProps} />
      <circle cx="250" cy="235" r="6" data-overlay-dot {...dotProps} />
    </svg>
  )
}

function renderCoffeeSvg(strokeHex: string, dotFill: string, className?: string) {
  const stroke = strokeHex
  const drawProps = { stroke, fill: 'none' as const }
  const dotProps = { stroke, fill: dotFill }
  return (
    <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
      {/* Coffee cup + steam */}
      <path d="M240 140 H400 L385 270 H255 Z" data-overlay-draw {...drawProps} />
      <path d="M400 160 C450 160 455 230 400 230" data-overlay-draw {...drawProps} />
      <path d="M270 195 C300 215 340 215 370 195" data-overlay-draw {...drawProps} />
      {/* steam */}
      <path d="M295 110 C275 95 275 70 295 55 C315 40 325 65 310 80" data-overlay-draw {...drawProps} />
      <path d="M350 105 C330 90 330 70 350 55 C370 40 380 65 365 80" data-overlay-draw {...drawProps} />
      <circle cx="295" cy="85" r="7" data-overlay-dot {...dotProps} />
      <circle cx="365" cy="85" r="7" data-overlay-dot {...dotProps} />
    </svg>
  )
}

function renderWineSvg(strokeHex: string, dotFill: string, className?: string) {
  const stroke = strokeHex
  const drawProps = { stroke, fill: 'none' as const }
  const dotProps = { stroke, fill: dotFill }
  return (
    <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
      {/* Wine bottle */}
      <path
        d="M310 70 C318 55 322 55 330 70 L350 95 V140 C350 150 360 165 360 180 V260 C360 295 340 315 320 315 C300 315 280 295 280 260 V180 C280 165 290 150 290 140 V95 Z"
        data-overlay-draw
        {...drawProps}
      />
      <path d="M298 125 C320 140 340 140 362 125" data-overlay-draw {...drawProps} />
      <path d="M300 210 H340 V260 H300 Z" data-overlay-dot {...dotProps} />
      <circle cx="320" cy="105" r="7" data-overlay-dot {...dotProps} />
      <circle cx="340" cy="185" r="6" data-overlay-dot {...dotProps} />
    </svg>
  )
}

function renderWheatSvg(strokeHex: string, dotFill: string, className?: string) {
  const stroke = strokeHex
  const drawProps = { stroke, fill: 'none' as const }
  const dotProps = { stroke, fill: dotFill }
  return (
    <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
      {/* Wheat stalks + grains */}
      <path d="M320 70 C295 110 280 160 285 205 C290 250 305 280 320 315" data-overlay-draw {...drawProps} />
      <path d="M360 80 C390 125 410 165 405 210 C400 255 385 285 370 315" data-overlay-draw {...drawProps} />
      <path d="M285 165 C270 150 250 145 230 155" data-overlay-draw {...drawProps} />
      <path d="M365 165 C390 155 415 155 435 165" data-overlay-draw {...drawProps} />
      {/* grains */}
      <circle cx="275" cy="170" r="8" data-overlay-dot {...dotProps} />
      <circle cx="305" cy="190" r="6" data-overlay-dot {...dotProps} />
      <circle cx="335" cy="175" r="7" data-overlay-dot {...dotProps} />
      <circle cx="355" cy="190" r="6" data-overlay-dot {...dotProps} />
      <circle cx="395" cy="170" r="8" data-overlay-dot {...dotProps} />
      <circle cx="370" cy="210" r="7" data-overlay-dot {...dotProps} />
    </svg>
  )
}

export function ThemeMoodGraphics({ theme, className }: { theme: ThemeEnum; className?: string }) {
  const palette = getThemePalette(theme)
  const strokeHex = palette.primary
  const dotFill = palette.dotFill

  // 9 themes -> 9 theme-stable MoodGraphics (each theme has its own unique SVG).
  switch (theme) {
    case ThemeEnum.DEFAULT:
      return renderDefaultSvg(strokeHex, dotFill, className)
    case ThemeEnum.LIGHT:
      return renderLightSvg(strokeHex, dotFill, className)
    case ThemeEnum.CORPORATE:
      return renderCorporateSvg(strokeHex, dotFill, className)
    case ThemeEnum.FOREST:
      return renderForestSvg(strokeHex, dotFill, className)
    case ThemeEnum.DARK:
      return renderDarkSvg(strokeHex, dotFill, className)
    case ThemeEnum.COSMIC:
      return renderCosmicSvg(strokeHex, dotFill, className)
    case ThemeEnum.COFFEE:
      return renderCoffeeSvg(strokeHex, dotFill, className)
    case ThemeEnum.WINE:
      return renderWineSvg(strokeHex, dotFill, className)
    case ThemeEnum.WHEAT:
      return renderWheatSvg(strokeHex, dotFill, className)
    default:
      return renderCosmicSvg(strokeHex, dotFill, className)
  }
}
