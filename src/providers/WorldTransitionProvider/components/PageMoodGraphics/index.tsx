import { useTheme } from 'nfx-ui/themes'

import { ROUTES } from '@/navigations/routes'

type PageKey = string

export function PageMoodGraphics({ page, className }: { page: PageKey; className?: string }) {
  const { currentTheme } = useTheme()
  const { variables } = currentTheme.colors

  // Use current theme's CSS variables => colors vary per theme.
  const stroke = variables.primary
  const dotFill = variables.primaryTransparent

  const commonDrawProps = { stroke, fill: 'none' as const }
  const commonDotProps = { stroke, fill: dotFill }

  // 6 different page graphics (shape-only differs; colors come from current theme)
  switch (page) {
    case ROUTES.HOME:
      return (
        <svg viewBox="0 0 640 340" aria-hidden="true" className={className}>
          <ellipse cx="320" cy="170" rx="170" ry="78" data-overlay-draw {...commonDrawProps} />
          <path d="M195 170 C255 95 385 95 445 170 C385 245 255 245 195 170 Z" data-overlay-draw {...commonDrawProps} />
          <circle cx="320" cy="170" r="10" data-overlay-dot {...commonDotProps} />
          <circle cx="420" cy="140" r="6" data-overlay-dot {...commonDotProps} />
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
          <path d="M320 70 C280 110 270 165 320 205 C370 165 360 110 320 70 Z" data-overlay-draw {...commonDrawProps} />
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
          <circle cx="320" cy="210" r="7" data-overlay-draw {...commonDrawProps} />
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
          <circle cx="320" cy="170" r="90" data-overlay-draw {...commonDrawProps} />
          <circle cx="320" cy="170" r="10" data-overlay-dot {...commonDotProps} />
        </svg>
      )
    }
  }
}

