import { useId } from 'react'

import styles from './MiniUniverseGlyph.module.css'

type Props = {
  /** 为 true 时关闭旋转与闪烁 */
  reducedMotion?: boolean
}

/**
 * 右上角「重新进入世界」按钮内的微型宇宙：旋臂 + 星点 + 核心微光，随主题色变化。
 */
export function MiniUniverseGlyph({ reducedMotion }: Props) {
  const uid = useId().replace(/:/g, '')
  const gradId = `mu-core-${uid}`
  const glowId = `mu-glow-${uid}`

  return (
    <svg
      className={`${styles.svg} ${reducedMotion ? styles.reduced : ''}`}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.95" />
          <stop offset="42%" stopColor="var(--color-primary-light)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.22" />
          <stop offset="70%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* 深空底 */}
      <circle cx="40" cy="40" r="38" className={styles.voidRim} />

      <g className={reducedMotion ? undefined : styles.haloPulse}>
        <circle cx="40" cy="40" r="26" fill={`url(#${glowId})`} />
      </g>

      {/* 慢旋臂：椭圆环 + 弧线，易读且稳定 */}
      <g
        className={reducedMotion ? undefined : styles.armForward}
        stroke="var(--color-primary)"
        strokeLinecap="round"
        fill="none"
      >
        <ellipse cx="40" cy="40" rx="29" ry="10" transform="rotate(-32 40 40)" opacity="0.38" strokeWidth="0.95" />
        <ellipse cx="40" cy="40" rx="23" ry="8" transform="rotate(48 40 40)" opacity="0.28" strokeWidth="0.75" />
        <path
          d="M40 12c14 0 24 10 28 22s-2 26-14 32-24 4-32-6-8-22 2-30 14-18 28-18z"
          opacity="0.22"
          strokeWidth="0.65"
        />
      </g>

      <g
        className={reducedMotion ? undefined : styles.armBackward}
        stroke="var(--color-primary-light)"
        strokeLinecap="round"
        fill="none"
      >
        <path
          d="M40 18 C52 22 58 34 54 46 S38 62 26 58 S14 38 22 26 S34 16 40 18"
          opacity="0.3"
          strokeWidth="0.8"
        />
        <path
          d="M18 40 C22 28 34 22 46 26 S58 38 54 50 S42 62 30 58 S14 48 18 40"
          opacity="0.22"
          strokeWidth="0.7"
        />
      </g>

      {/* 星点 */}
      <g className={styles.stars} fill="var(--color-primary)">
        <circle className={reducedMotion ? undefined : styles.star} cx="24" cy="26" r="1.1" />
        <circle
          className={reducedMotion ? undefined : styles.star}
          style={{ animationDelay: '0.4s' }}
          cx="54"
          cy="22"
          r="0.85"
        />
        <circle
          className={reducedMotion ? undefined : styles.star}
          style={{ animationDelay: '0.9s' }}
          cx="58"
          cy="48"
          r="1"
        />
        <circle
          className={reducedMotion ? undefined : styles.star}
          style={{ animationDelay: '0.15s' }}
          cx="20"
          cy="52"
          r="0.75"
        />
        <circle
          className={reducedMotion ? undefined : styles.star}
          style={{ animationDelay: '1.1s' }}
          cx="44"
          cy="58"
          r="0.9"
        />
        <circle
          className={reducedMotion ? undefined : styles.star}
          style={{ animationDelay: '0.65s' }}
          cx="32"
          cy="18"
          r="0.65"
        />
      </g>

      {/* 星系核 */}
      <circle cx="40" cy="40" r="5.5" fill={`url(#${gradId})`} className={styles.core} />
      <circle cx="40" cy="40" r="2.2" fill="var(--color-bg)" opacity="0.35" />
    </svg>
  )
}
