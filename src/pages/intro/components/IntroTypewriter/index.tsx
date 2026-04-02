import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

import { useReducedMotion } from '@/hooks'

import styles from './styles.module.css'

type Props = {
  text: string
  className?: string
}

/**
 * Fast per-character reveal (GSAP stagger). Paragraphs separated by blank lines in `text`.
 */
export function IntroTypewriter({ text, className }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const paragraphs = text
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const chars = root.querySelectorAll<HTMLElement>('[data-char]')
      if (!chars.length) return

      if (reducedMotion) {
        gsap.set(chars, { opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        chars,
        { opacity: 0, y: 5 },
        {
          opacity: 1,
          y: 0,
          duration: 0.04,
          stagger: 0.011,
          ease: 'power2.out',
          overwrite: 'auto',
        },
      )
    },
    { scope: rootRef, dependencies: [text, reducedMotion] },
  )

  if (!paragraphs.length) {
    return null
  }

  return (
    <div ref={rootRef} className={`${styles.root} ${className ?? ''}`}>
      {paragraphs.map((para, pi) => (
        <p key={pi} className={styles.para}>
          {Array.from(para).map((ch, ci) =>
            ch === '\n' ? (
              <br key={`${pi}-${ci}`} />
            ) : (
              <span key={`${pi}-${ci}`} className={styles.char} data-char>
                {ch}
              </span>
            ),
          )}
        </p>
      ))}
    </div>
  )
}
