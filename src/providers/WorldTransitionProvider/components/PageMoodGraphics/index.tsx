import { useTheme } from 'nfx-ui/themes'

import { ROUTES } from '@/navigations/routes'

type PageKey = string

/** Orbit / ring strokes (theme primary). */
const orbitStroke = { strokeWidth: 1.12 } as const

export function PageMoodGraphics({ page, className }: { page: PageKey; className?: string }) {
  const { currentTheme } = useTheme()
  const { variables } = currentTheme.colors

  const stroke = variables.primary
  const dotFill = variables.primaryTransparent

  const commonDrawProps = { stroke, fill: 'none' as const }
  const commonDotProps = { stroke, fill: dotFill }

  switch (page) {
    case ROUTES.WORLD:
      return (
        <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
          {/* Outermost flat orbit (drawn first = behind) */}
          <g transform="rotate(7 320 170)">
            <ellipse
              cx="320"
              cy="170"
              rx="198"
              ry="36"
              data-overlay-draw
              {...commonDrawProps}
              {...orbitStroke}
            />
            <circle cx="518" cy="168" r="2.6" data-overlay-dot {...commonDotProps} />
          </g>

          {/* Wide tilted ellipse orbit */}
          <g transform="rotate(-10 320 170)">
            <ellipse
              cx="320"
              cy="170"
              rx="168"
              ry="44"
              data-overlay-draw
              {...commonDrawProps}
              {...orbitStroke}
            />
            <circle cx="468" cy="186" r="4.2" data-overlay-dot {...commonDotProps} />
            <circle cx="178" cy="188" r="3.6" data-overlay-dot {...commonDotProps} />
            <circle cx="312" cy="128" r="3.2" data-overlay-dot {...commonDotProps} />
          </g>

          {/* Mid steep ellipse orbit */}
          <g transform="rotate(16 320 170)">
            <ellipse
              cx="320"
              cy="170"
              rx="128"
              ry="62"
              data-overlay-draw
              {...commonDrawProps}
              {...orbitStroke}
            />
            <circle cx="420" cy="138" r="4.5" data-overlay-dot {...commonDotProps} />
            {/* Ringed gas giant */}
            <ellipse
              cx="238"
              cy="208"
              rx="14"
              ry="3.8"
              transform="rotate(-38 238 208)"
              data-overlay-draw
              {...commonDrawProps}
              {...orbitStroke}
            />
            <ellipse
              cx="238"
              cy="208"
              rx="11"
              ry="2.6"
              transform="rotate(-38 238 208)"
              data-overlay-draw
              {...commonDrawProps}
              {...orbitStroke}
            />
            <circle cx="238" cy="208" r="5.2" data-overlay-dot {...commonDotProps} />
            <circle cx="352" cy="228" r="3.4" data-overlay-dot {...commonDotProps} />
          </g>

          {/* Inner oblique orbit */}
          <g transform="rotate(-24 320 170)">
            <ellipse
              cx="320"
              cy="170"
              rx="92"
              ry="34"
              data-overlay-draw
              {...commonDrawProps}
              {...orbitStroke}
            />
            <circle cx="398" cy="162" r="3.8" data-overlay-dot {...commonDotProps} />
            <circle cx="252" cy="178" r="3.3" data-overlay-dot {...commonDotProps} />
          </g>

          {/* Near-circular inner orbit */}
          <ellipse
            cx="320"
            cy="170"
            rx="58"
            ry="54"
            data-overlay-draw
            {...commonDrawProps}
            {...orbitStroke}
          />
          <circle cx="378" cy="150" r="3.6" data-overlay-dot {...commonDotProps} />
          {/* Second ringed planet */}
          <ellipse
            cx="268"
            cy="148"
            rx="12"
            ry="3.2"
            transform="rotate(52 268 148)"
            data-overlay-draw
            {...commonDrawProps}
            {...orbitStroke}
          />
          <ellipse
            cx="268"
            cy="148"
            rx="9.5"
            ry="2.2"
            transform="rotate(52 268 148)"
            data-overlay-draw
            {...commonDrawProps}
            {...orbitStroke}
          />
          <circle cx="268" cy="148" r="4.4" data-overlay-dot {...commonDotProps} />
          <circle cx="320" cy="224" r="3" data-overlay-dot {...commonDotProps} />

          {/* Central star — drawn last so it reads on top */}
          <circle cx="320" cy="170" r="13" data-overlay-dot {...commonDotProps} />
        </svg>
      )
    case ROUTES.INTRO:
      return (
        <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
          <path d="M200 70V290" data-overlay-draw {...commonDrawProps} />
          <path d="M240 110V250" data-overlay-draw {...commonDrawProps} />
          <path d="M360 70V290" data-overlay-draw {...commonDrawProps} />
          <path d="M400 110V250" data-overlay-draw {...commonDrawProps} />
          <path d="M240 170H400" data-overlay-draw {...commonDrawProps} />
          <circle cx="320" cy="170" r="9" data-overlay-dot {...commonDotProps} />
        </svg>
      )
    case ROUTES.PROJECTS:
      return (
        <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
          <path d="M180 240 L320 90 L460 240" data-overlay-draw {...commonDrawProps} />
          <path d="M240 240 V160 H400 V240" data-overlay-draw {...commonDrawProps} />
          <circle cx="320" cy="140" r="10" data-overlay-dot {...commonDotProps} />
          <circle cx="240" cy="240" r="7" data-overlay-dot {...commonDotProps} />
          <circle cx="400" cy="240" r="7" data-overlay-dot {...commonDotProps} />
        </svg>
      )
    case ROUTES.LIFE:
      return (
        <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
          <path
            d="M320 70 C280 110 270 165 320 205 C370 165 360 110 320 70 Z"
            data-overlay-draw
            {...commonDrawProps}
          />
          <path d="M250 225 C310 200 330 200 390 225" data-overlay-draw {...commonDrawProps} />
          <path d="M280 255 C310 235 330 235 360 255" data-overlay-draw {...commonDrawProps} />
          <circle cx="320" cy="140" r="10" data-overlay-dot {...commonDotProps} />
        </svg>
      )
    case ROUTES.HIGHLIGHTS:
      return (
        <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
          <path d="M320 70 V270" data-overlay-draw {...commonDrawProps} />
          <path d="M240 140C280 115 360 115 400 140" data-overlay-draw {...commonDrawProps} />
          <path d="M210 200C260 160 380 160 430 200" data-overlay-draw {...commonDrawProps} />
          <circle cx="320" cy="120" r="10" data-overlay-dot {...commonDotProps} />
          <circle cx="320" cy="210" r="7" data-overlay-dot {...commonDotProps} />
        </svg>
      )
    case ROUTES.CONTACT:
      return (
        <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
          <path d="M200 120H440V250H200 Z" data-overlay-draw {...commonDrawProps} />
          <path d="M200 120L320 200L440 120" data-overlay-draw {...commonDrawProps} />
          <circle cx="320" cy="185" r="9" data-overlay-dot {...commonDotProps} />
          <circle cx="270" cy="230" r="6" data-overlay-dot {...commonDotProps} />
        </svg>
      )
    default: {
      return (
        <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
          <path
            d="M 200 170 A 120 55 0 0 1 440 170"
            data-overlay-draw
            {...commonDrawProps}
            {...orbitStroke}
          />
          <path d="M320 170 L248 118" data-overlay-draw {...commonDrawProps} {...orbitStroke} />
          <path d="M320 170 L392 118" data-overlay-draw {...commonDrawProps} {...orbitStroke} />
          <path d="M248 118 L392 118" data-overlay-draw {...commonDrawProps} {...orbitStroke} />
          <circle cx="320" cy="170" r="9" data-overlay-dot {...commonDotProps} />
          <circle cx="248" cy="118" r="4" data-overlay-dot {...commonDotProps} />
          <circle cx="392" cy="118" r="4" data-overlay-dot {...commonDotProps} />
          <circle cx="320" cy="88" r="2.5" data-overlay-dot {...commonDotProps} />
        </svg>
      )
    }
  }
}
